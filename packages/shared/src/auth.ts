import type { MenuTreeNode, PermissionCode } from './permission';

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  phone: string;
  department: string;
  roleIds: string[];
  roles: string[];
  permissions: PermissionCode[];
  menus: MenuTreeNode[];
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserProfile;
}
