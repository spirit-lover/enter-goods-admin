import { Inject, Injectable } from '@nestjs/common';
import { DATA_STORE, type DataStore } from '../data/contracts/data-store';

@Injectable()
export class PermissionService {
  constructor(@Inject(DATA_STORE) private readonly store: DataStore) {}

  async getMenus(userId: string) {
    return (await this.store.getUserProfile(userId))?.menus ?? [];
  }

  async getCodes(userId: string) {
    return (await this.store.getUserProfile(userId))?.permissions ?? [];
  }
}
