import { PERMISSION_CODES, type PermissionCode } from '@enterprise/shared';
import type { ReactNode } from 'react';
import { DashboardPage } from '../views/dashboard/dashboard-page';
import { LoginPage } from '../views/login/login-page';
import { CategoriesPage } from '../views/products/categories-page';
import { InventoryPage } from '../views/products/inventory-page';
import { OrdersPage } from '../views/products/orders-page';
import { ProductsPage } from '../views/products/products-page';
import { LogsPage } from '../views/system/logs-page';
import { MenusPage } from '../views/system/menus-page';
import { RolesPage } from '../views/system/roles-page';
import { SettingsPage } from '../views/system/settings-page';
import { UsersPage } from '../views/system/users-page';

export interface AppRoute {
  path: string;
  element: ReactNode;
  permission?: PermissionCode;
}

export const publicRoutes: AppRoute[] = [
  {
    path: '/login',
    element: <LoginPage />
  }
];

export const protectedRoutes: AppRoute[] = [
  {
    path: '/dashboard',
    element: <DashboardPage />
  },
  {
    path: '/goods/products',
    element: <ProductsPage />,
    permission: PERMISSION_CODES.productRead
  },
  {
    path: '/goods/categories',
    element: <CategoriesPage />,
    permission: PERMISSION_CODES.productRead
  },
  {
    path: '/goods/inventory',
    element: <InventoryPage />,
    permission: PERMISSION_CODES.inventoryAdjust
  },
  {
    path: '/orders/list',
    element: <OrdersPage />,
    permission: PERMISSION_CODES.orderRead
  },
  {
    path: '/system/users',
    element: <UsersPage />,
    permission: PERMISSION_CODES.systemUserManage
  },
  {
    path: '/system/roles',
    element: <RolesPage />,
    permission: PERMISSION_CODES.systemRoleManage
  },
  {
    path: '/system/menus',
    element: <MenusPage />,
    permission: PERMISSION_CODES.systemMenuManage
  },
  {
    path: '/system/logs',
    element: <LogsPage />,
    permission: PERMISSION_CODES.systemLogRead
  },
  {
    path: '/system/settings',
    element: <SettingsPage />,
    permission: PERMISSION_CODES.systemLogRead
  }
];
