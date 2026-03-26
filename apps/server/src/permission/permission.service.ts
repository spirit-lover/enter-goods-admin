import { Inject, Injectable, Optional } from '@nestjs/common';
import type { UserProfile } from '@enterprise/shared';
import { DATA_STORE, type DataStore } from '../data/contracts/data-store';
import { RedisClientService } from '../redis/redis.client';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(DATA_STORE) private readonly store: DataStore,
    @Optional() @Inject(RedisClientService) private readonly redisClient?: RedisClientService
  ) {}

  private useRedisCache(): boolean {
    return (process.env.CACHE_DRIVER ?? 'memory').toLowerCase() === 'redis' && Boolean(this.redisClient);
  }

  private profileCacheKey(userId: string): string {
    return `cache:permission:profile:${userId}`;
  }

  private async getProfile(userId: string): Promise<UserProfile | undefined> {
    if (this.useRedisCache()) {
      const cached = await this.redisClient!.getJson<UserProfile>(this.profileCacheKey(userId));
      if (cached) {
        return cached;
      }
    }

    const profile = await this.store.getUserProfile(userId);
    if (profile && this.useRedisCache()) {
      await this.redisClient!.setJson(this.profileCacheKey(userId), profile, 300);
    }
    return profile;
  }

  async getMenus(userId: string) {
    return (await this.getProfile(userId))?.menus ?? [];
  }

  async getCodes(userId: string) {
    return (await this.getProfile(userId))?.permissions ?? [];
  }
}
