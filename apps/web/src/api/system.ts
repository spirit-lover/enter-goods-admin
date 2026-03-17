import type { MenuTreeNode, UserProfile } from '@enterprise/shared';
import { http } from './http';

export function fetchDashboardSummary() {
  return http.get<{
    productCount: number;
    activeProductCount: number;
    orderCount: number;
    paidOrderAmount: number;
    inventoryAlertCount: number;
    latestLogs: Array<{ id: string; action: string; detail: string; operatorName: string; createdAt: string }>;
  }>('/dashboard/summary');
}

export function fetchUsers() {
  return http.get<UserProfile[]>('/system/users');
}

export function fetchRoles() {
  return http.get<Array<{ id: string; name: string; permissionCodes: string[] }>>('/system/roles');
}

export function fetchMenus() {
  return http.get<MenuTreeNode[]>('/system/menus');
}

export function fetchLogs() {
  return http.get<Array<{ id: string; module: string; action: string; detail: string; operatorName: string; createdAt: string }>>('/system/logs');
}

export function fetchSettings() {
  return http.get<Record<string, string | number>>('/system/settings');
}
