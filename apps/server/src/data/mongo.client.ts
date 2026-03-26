import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class MongoClientService implements OnModuleDestroy {
  private client?: MongoClient;
  private db?: Db;

  async getDb(): Promise<Db> {
    if (this.db) {
      return this.db;
    }

    const url = process.env.MONGODB_URL;
    const dbName = process.env.MONGODB_DB_NAME;
    if (!url || !dbName) {
      throw new Error('缺少 MongoDB 连接配置，请设置 MONGODB_URL 和 MONGODB_DB_NAME');
    }

    this.client = new MongoClient(url);
    await this.client.connect();
    this.db = this.client.db(dbName);
    return this.db;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.close();
    }
    this.client = undefined;
    this.db = undefined;
  }
}
