import { Inject, Injectable } from '@nestjs/common';
import { DATA_STORE, type DataStore } from '../data/contracts/data-store';

@Injectable()
export class SystemService {
  constructor(@Inject(DATA_STORE) private readonly store: DataStore) {}

  async users() {
    return this.store.listUsers();
  }

  async roles() {
    return this.store.listRoles();
  }

  async menus() {
    return this.store.listMenus();
  }

  async logs() {
    return this.store.listOperationLogs();
  }

  settings() {
    return {
      systemName: '企业商品后台管理平台',
      refreshTokenTTL: 604800,
      accessTokenTTL: 7200,
      storageDriver: 'mysql',
      cacheDriver: 'memory'
    };
  }
}
