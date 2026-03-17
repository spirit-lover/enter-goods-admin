import { defineStore } from 'pinia';
import * as authApi from '../api/auth';
export const usePermissionStore = defineStore('permission', {
    state: () => ({
        menus: [],
        permissions: []
    }),
    actions: {
        async loadAccessContext() {
            const [menus, permissions] = await Promise.all([authApi.fetchMenus(), authApi.fetchCodes()]);
            this.menus = menus;
            this.permissions = permissions;
        },
        can(permission) {
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
