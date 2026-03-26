import type {
  LoginPayload,
  LoginResult,
  MenuTreeNode,
  PermissionCode,
  UserProfile
} from '@enterprise/shared';
import { http } from './http';

export function login(payload: LoginPayload) {
  return http.post<LoginResult>('/auth/login', payload);
}

export function refresh(refreshToken: string) {
  return http.post<LoginResult>('/auth/refresh', { refreshToken });
}

export function logout(refreshToken: string) {
  return http.post<null>('/auth/logout', { refreshToken });
}

export function fetchProfile() {
  return http.get<UserProfile>('/auth/profile');
}

export function fetchMenus() {
  return http.get<MenuTreeNode[]>('/permissions/menus');
}

export function fetchCodes() {
  return http.get<PermissionCode[]>('/permissions/codes');
}
