import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisClientService implements OnModuleDestroy {
  private client?: Redis;

  private getClient(): Redis {
    if (!this.client) {
      this.client = new Redis(process.env.REDIS_URL ?? 'redis://127.0.0.1:6379', {
        lazyConnect: true,
        maxRetriesPerRequest: 1
      });
    }

    return this.client;
  }

  private async connectIfNeeded(): Promise<Redis> {
    const client = this.getClient();
    if (client.status === 'wait') {
      await client.connect();
    }
    return client;
  }

  async getValue(key: string): Promise<string | null> {
    return (await this.connectIfNeeded()).get(key);
  }

  async setValue(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const client = await this.connectIfNeeded();
    if (ttlSeconds) {
      await client.set(key, value, 'EX', ttlSeconds);
      return;
    }
    await client.set(key, value);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.getValue(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async setJson(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    await this.setValue(key, JSON.stringify(value), ttlSeconds);
  }

  async addSetMembers(key: string, members: string[]): Promise<void> {
    if (members.length === 0) {
      return;
    }
    await (await this.connectIfNeeded()).sadd(key, ...members);
  }

  async getSetMembers(key: string): Promise<string[]> {
    return (await this.connectIfNeeded()).smembers(key);
  }

  async deleteKey(key: string): Promise<void> {
    await (await this.connectIfNeeded()).del(key);
  }

  async deleteKeys(keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }
    await (await this.connectIfNeeded()).del(...keys);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = undefined;
    }
  }
}
