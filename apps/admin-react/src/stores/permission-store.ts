import type { MenuTreeNode, PermissionCode } from '@enterprise/shared';
import { createStore } from 'zustand/vanilla';
import * as authApi from '../api/auth';

export interface PermissionState {
  menus: MenuTreeNode[];
  permissions: PermissionCode[];
  loadAccessContext: () => Promise<void>;
  can: (permission?: PermissionCode) => boolean;
  reset: () => void;
}

export type PermissionStore = ReturnType<typeof createPermissionStore>;

export function createPermissionStore() {
  return createStore<PermissionState>()((set, get) => ({
    menus: [],
    permissions: [],
    async loadAccessContext() {
      const [menus, permissions] = await Promise.all([authApi.fetchMenus(), authApi.fetchCodes()]);
      set({ menus: menus ?? [], permissions: permissions ?? [] });
    },
    can(permission) {
      if (!permission) {
        return true;
      }
      return get().permissions.includes(permission);
    },
    reset() {
      set({ menus: [], permissions: [] });
    }
  }));
}
