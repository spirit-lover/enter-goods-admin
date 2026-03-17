import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useAuthStore } from '../stores/auth';
import { usePermissionStore } from '../stores/permission';
export const router = createRouter({
    history: createWebHistory(),
    routes
});
router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    const permissionStore = usePermissionStore();
    if (to.path === '/login') {
        return true;
    }
    if (!authStore.isAuthenticated) {
        return '/login';
    }
    if (!authStore.user) {
        await authStore.restoreProfile();
    }
    if (!permissionStore.permissions.length) {
        await permissionStore.loadAccessContext();
    }
    const permission = to.meta.permission;
    if (permission && !permissionStore.can(permission)) {
        return '/dashboard';
    }
    return true;
});
