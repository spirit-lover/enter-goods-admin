import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import type { LoginPayload, LoginResult } from '@enterprise/shared';
import { AuditService } from '../audit/audit.service';
import { DATA_STORE, type DataStore } from '../data/contracts/data-store';
import { SessionStoreService } from './session-store.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATA_STORE) private readonly store: DataStore,
    private readonly auditService: AuditService,
    private readonly sessionStore: SessionStoreService
  ) {}

  async login(payload: LoginPayload, ip: string): Promise<LoginResult> {
    const user = await this.store.findUserByUsername(payload.username);
    if (!user || !compareSync(payload.password, user.passwordHash)) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const accessToken = `access.${this.buildToken(user.id, 'access')}`;
    const refreshToken = `refresh.${this.buildToken(user.id, 'refresh')}`;
    await this.sessionStore.save(user.id, accessToken, refreshToken);
    await this.auditService.record({
      action: 'auth.login',
      module: 'auth',
      operatorId: user.id,
      operatorName: user.displayName,
      detail: `${user.username} 登录后台系统`,
      ip
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 7200,
      user: (await this.store.getUserProfile(user.id))!
    };
  }

  async refresh(refreshToken: string): Promise<LoginResult> {
    const userId = await this.sessionStore.resolveRefreshToken(refreshToken);
    const user = await this.store.getUserProfile(userId);
    if (!user) {
      throw new UnauthorizedException('登录状态已失效');
    }

    const nextAccessToken = `access.${this.buildToken(user.id, 'access')}`;
    const nextRefreshToken = `refresh.${this.buildToken(user.id, 'refresh')}`;
    await this.sessionStore.revoke(refreshToken);
    await this.sessionStore.save(user.id, nextAccessToken, nextRefreshToken);

    return {
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
      expiresIn: 7200,
      user
    };
  }

  async logout(refreshToken: string, userId: string): Promise<void> {
    await this.sessionStore.revoke(refreshToken);
    await this.auditService.record({
      action: 'auth.logout',
      module: 'auth',
      operatorId: userId,
      operatorName: (await this.store.getUserProfile(userId))?.displayName ?? '未知用户',
      detail: '退出后台系统'
    });
  }

  async getProfile(userId: string) {
    const user = await this.store.getUserProfile(userId);
    if (!user) {
      throw new UnauthorizedException('登录状态已失效');
    }
    return user;
  }

  async resolveUserByAccessToken(token: string) {
    return this.getProfile(await this.sessionStore.resolveAccessToken(token));
  }

  private buildToken(userId: string, type: 'access' | 'refresh') {
    return Buffer.from(`${type}:${userId}:${Date.now()}`).toString('base64url');
  }
}
