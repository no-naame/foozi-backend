import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RestaurantService {
  async fetchRestaurants(lat: number, lng: number) {
    try {
      const response = await axios.get(
        'https://www.swiggy.com/dapi/restaurants/list/v5',
        {
          params: {
            lat,
            lng,
            'is-seo-homepage-enabled': true,
            page_type: 'DESKTOP_WEB_LISTING',
          },
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
          },
        },
      );
      return response.data.data.cards;
    } catch (error) {
      console.error('Error fetching Swiggy data:', error);
      throw new Error('Failed to fetch data from Swiggy');
    }
  }

  async fetchMenus(restaurantId: string) {
    return [];
  }
}
