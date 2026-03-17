import { PERMISSION_CODES } from '@enterprise/shared';
export const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/LoginPage.vue')
    },
    {
        path: '/',
        component: () => import('../views/RootLayout.vue'),
        redirect: '/dashboard',
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('../views/dashboard/DashboardView.vue')
            },
            {
                path: '/goods/products',
                name: 'products',
                component: () => import('../views/product/ProductListView.vue'),
                meta: { permission: PERMISSION_CODES.productRead }
            },
            {
                path: '/goods/categories',
                name: 'categories',
                component: () => import('../views/product/CategoryView.vue'),
                meta: { permission: PERMISSION_CODES.productRead }
            },
            {
                path: '/goods/inventory',
                name: 'inventory',
                component: () => import('../views/product/InventoryView.vue'),
                meta: { permission: PERMISSION_CODES.inventoryAdjust }
            },
            {
                path: '/orders/list',
                name: 'orders',
                component: () => import('../views/product/OrderView.vue'),
                meta: { permission: PERMISSION_CODES.orderRead }
            },
            {
                path: '/system/users',
                name: 'users',
                component: () => import('../views/system/UsersView.vue'),
                meta: { permission: PERMISSION_CODES.systemUserManage }
            },
            {
                path: '/system/roles',
                name: 'roles',
                component: () => import('../views/system/RolesView.vue'),
                meta: { permission: PERMISSION_CODES.systemRoleManage }
            },
            {
                path: '/system/menus',
                name: 'menus',
                component: () => import('../views/system/MenusView.vue'),
                meta: { permission: PERMISSION_CODES.systemMenuManage }
            },
            {
                path: '/system/logs',
                name: 'logs',
                component: () => import('../views/system/LogsView.vue'),
                meta: { permission: PERMISSION_CODES.systemLogRead }
            },
            {
                path: '/system/settings',
                name: 'settings',
                component: () => import('../views/system/SettingsView.vue'),
                meta: { permission: PERMISSION_CODES.systemLogRead }
            }
        ]
    }
];
