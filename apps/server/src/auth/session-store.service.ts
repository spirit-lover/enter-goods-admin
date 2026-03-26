import { Inject, Injectable, Optional, UnauthorizedException } from '@nestjs/common';
import { DATA_STORE, type DataStore } from '../data/contracts/data-store';
import { RedisClientService } from '../redis/redis.client';

@Injectable()
export class SessionStoreService {
  constructor(
    @Inject(DATA_STORE) private readonly store: DataStore,
    @Optional() @Inject(RedisClientService) private readonly redisClient?: RedisClientService
  ) {}

  private useRedis(): boolean {
    return (process.env.SESSION_DRIVER ?? 'datastore').toLowerCase() === 'redis' && Boolean(this.redisClient);
  }

  private accessKey(token: string): string {
    return `session:access:${token}`;
  }

  private refreshKey(token: string): string {
    return `session:refresh:${token}`;
  }

  private userAccessSetKey(userId: string): string {
    return `session:user:${userId}:access`;
  }

  private userRefreshSetKey(userId: string): string {
    return `session:user:${userId}:refresh`;
  }

  async save(userId: string, accessToken: string, refreshToken: string): Promise<void> {
    if (this.useRedis()) {
      await this.redisClient!.setValue(this.accessKey(accessToken), userId, 7200);
      await this.redisClient!.setValue(this.refreshKey(refreshToken), userId, 604800);
      await this.redisClient!.addSetMembers(this.userAccessSetKey(userId), [accessToken]);
      await this.redisClient!.addSetMembers(this.userRefreshSetKey(userId), [refreshToken]);
      return;
    }
    await this.store.saveSession(userId, accessToken, refreshToken);
  }

  async resolveAccessToken(token: string): Promise<string> {
    const userId = this.useRedis()
      ? await this.redisClient!.getValue(this.accessKey(token))
      : await this.store.resolveAccessToken(token);
    if (!userId) {
      throw new UnauthorizedException('登录状态已失效');
    }
    return userId;
  }

  async resolveRefreshToken(token: string): Promise<string> {
    const userId = this.useRedis()
      ? await this.redisClient!.getValue(this.refreshKey(token))
      : await this.store.resolveRefreshToken(token);
    if (!userId) {
      throw new UnauthorizedException('刷新令牌已失效');
    }
    return userId;
  }

  async revoke(refreshToken: string): Promise<void> {
    if (this.useRedis()) {
      const userId = await this.redisClient!.getValue(this.refreshKey(refreshToken));
      if (!userId) {
        return;
      }
      const [accessTokens, refreshTokens] = await Promise.all([
        this.redisClient!.getSetMembers(this.userAccessSetKey(userId)),
        this.redisClient!.getSetMembers(this.userRefreshSetKey(userId))
      ]);
      await this.redisClient!.deleteKeys([
        ...accessTokens.map((token) => this.accessKey(token)),
        ...refreshTokens.map((token) => this.refreshKey(token))
      ]);
      await this.redisClient!.deleteKey(this.userAccessSetKey(userId));
      await this.redisClient!.deleteKey(this.userRefreshSetKey(userId));
      return;
    }
    await this.store.revokeSession(refreshToken);
  }
}
