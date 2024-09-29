import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantService } from './restaurant/restaurant.service';
import { VectorDbService } from './vector-db/vector-db.service';
import { ChatbotService } from './chatbot/chatbot.service';
import { ChatbotController } from './chatbot/chatbot.controller';

@Module({
  imports: [],
  controllers: [AppController, ChatbotController],
  providers: [AppService, RestaurantService, VectorDbService, ChatbotService],
})
export class AppModule {}
