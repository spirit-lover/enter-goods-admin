import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DATA_STORE, type DataStore } from '../data/contracts/data-store';

@Injectable()
export class SessionStoreService {
  constructor(@Inject(DATA_STORE) private readonly store: DataStore) {}

  async save(userId: string, accessToken: string, refreshToken: string): Promise<void> {
    await this.store.saveSession(userId, accessToken, refreshToken);
  }

  async resolveAccessToken(token: string): Promise<string> {
    const userId = await this.store.resolveAccessToken(token);
    if (!userId) {
      throw new UnauthorizedException('登录状态已失效');
    }
    return userId;
  }

  async resolveRefreshToken(token: string): Promise<string> {
    const userId = await this.store.resolveRefreshToken(token);
    if (!userId) {
      throw new UnauthorizedException('刷新令牌已失效');
    }
    return userId;
  }

  async revoke(refreshToken: string): Promise<void> {
    await this.store.revokeSession(refreshToken);
  }
}
