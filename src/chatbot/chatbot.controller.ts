import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  @Post()
  async chat(@Body() body: { input: string; lat: number; lng: number }) {
    const { input, lat, lng } = body;
    return this.chatbotService.generateResponse(input, lat, lng);
  }
}