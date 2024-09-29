import { Injectable } from '@nestjs/common';
import { PineconeClient } from '@pinecone-database/pinecone';

@Injectable()
export class VectorDbService {
  private pinecone: PineconeClient;

  constructor() {
    this.pinecone = new PineconeClient();
    this.pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY,
    });
  }

  async storeVectors(vectors: any[]) {
    const index = this.pinecone.Index(process.env.PINECONE_INDEX);
    await index.upsert(vectors);
  }

  async queryVectors(query: any) {
    const index = this.pinecone.Index(process.env.PINECONE_INDEX);
    return await index.query(query);
  }
}