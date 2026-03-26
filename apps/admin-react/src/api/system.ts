import type { MenuTreeNode, UserProfile } from '@enterprise/shared';
import { http } from './http';

export interface DashboardSummary {
  productCount: number;
  activeProductCount: number;
  orderCount: number;
  paidOrderAmount: number;
  inventoryAlertCount: number;
  latestLogs: Array<{
    id: string;
    action: string;
    detail: string;
    operatorName: string;
    createdAt: string;
  }>;
}

export interface RoleRecord {
  id: string;
  name: string;
  permissionCodes: string[];
  menuIds?: string[];
}

export interface LogRecord {
  id: string;
  module: string;
  action: string;
  detail: string;
  operatorName: string;
  createdAt: string;
}

export function fetchDashboardSummary() {
  return http.get<DashboardSummary>('/dashboard/summary');
}

export function fetchUsers() {
  return http.get<UserProfile[]>('/system/users');
}

export function fetchRoles() {
  return http.get<RoleRecord[]>('/system/roles');
}

export function fetchMenus() {
  return http.get<MenuTreeNode[]>('/system/menus');
}

export function fetchLogs() {
  return http.get<LogRecord[]>('/system/logs');
}

export function fetchSettings() {
  return http.get<Record<string, string | number>>('/system/settings');
}
