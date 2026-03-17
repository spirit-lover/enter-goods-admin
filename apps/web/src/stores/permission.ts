import { defineStore } from 'pinia';
import type { MenuTreeNode, PermissionCode } from '@enterprise/shared';
import * as authApi from '../api/auth';

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    menus: [] as MenuTreeNode[],
    permissions: [] as PermissionCode[]
  }),
  actions: {
    async loadAccessContext() {
      const [menus, permissions] = await Promise.all([authApi.fetchMenus(), authApi.fetchCodes()]);
      this.menus = menus;
      this.permissions = permissions;
    },
    can(permission?: PermissionCode) {
      if (!permission) {
        return true;
      }
      return this.permissions.includes(permission);
    },
    reset() {
      this.menus = [];
      this.permissions = [];
    }
  }
});
