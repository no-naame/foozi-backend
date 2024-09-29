import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LangChain } from 'langchain';
import { VectorDbService } from '../vector-db/vector-db.service';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable()
export class ChatbotService {
  private genAI: GoogleGenerativeAI;
  private langChain: LangChain;

  constructor(
    private vectorDbService: VectorDbService,
    private restaurantService: RestaurantService,
  ) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.langChain = new LangChain();
  }

  async generateResponse(userInput: string, lat: number, lng: number) {
    const restaurants = await this.restaurantService.fetchRestaurants(lat, lng);
    const menus = await Promise.all(
      restaurants.map(restaurant => this.restaurantService.fetchMenus(restaurant.id))
    );

    await this.vectorDbService.storeVectors(this.parseData(restaurants, menus));

    const relevantData = await this.vectorDbService.queryVectors(userInput);

    const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(userInput + " " + JSON.stringify(relevantData));
    const response = await result.response;
    const text = response.text();

    const fineTunedResponse = await this.langChain.refineOutput(text);

    return this.structureLLMOutput(fineTunedResponse);
  }

  private parseData(restaurants: any[], menus: any[]) {

    return [];
  }

  private structureLLMOutput(output: string) {

    return {
      id: 'chatcmpl-' + Math.random().toString(36).substr(2, 9),
      object: 'chat.completion',
      created: Date.now(),
      model: 'gpt-3.5-turbo-0613',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: output,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };
  }
}