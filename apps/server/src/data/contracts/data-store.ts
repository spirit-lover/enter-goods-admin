import type { CategoryDTO, InventoryAdjustPayload, InventoryRecordDTO, MenuTreeNode, OrderDTO, PageResult, PermissionCode, ProductDTO, ProductFilter, ProductUpsertPayload, UserProfile } from '@enterprise/shared';

export const DATA_STORE = Symbol('DATA_STORE');

export interface RoleRecord {
  id: string;
  name: string;
  permissionCodes: PermissionCode[];
  menuIds: string[];
}

export interface UserRecord {
  id: string;
  username: string;
  passwordHash: string;
  displayName: string;
  email: string;
  phone: string;
  department: string;
  roleIds: string[];
}

export interface OperationLogRecord {
  id: string;
  action: string;
  module: string;
  operatorId: string;
  operatorName: string;
  detail: string;
  ip: string;
  createdAt: string;
}

export interface SessionRecord {
  userId: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
}

export interface DataStore {
  findUserByUsername(username: string): Promise<UserRecord | undefined>;
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  listUsers(): Promise<UserProfile[]>;
  listRoles(): Promise<RoleRecord[]>;
  listMenus(): Promise<MenuTreeNode[]>;
  listOperationLogs(): Promise<OperationLogRecord[]>;
  createOperationLog(input: Omit<OperationLogRecord, 'id' | 'createdAt'>): Promise<OperationLogRecord>;
  saveSession(userId: string, accessToken: string, refreshToken: string): Promise<void>;
  resolveAccessToken(token: string): Promise<string | null>;
  resolveRefreshToken(token: string): Promise<string | null>;
  revokeSession(refreshToken: string): Promise<void>;
  listProducts(filter: ProductFilter): Promise<PageResult<ProductDTO>>;
  getProductDetail(id: string): Promise<ProductDTO | undefined>;
  createProduct(payload: ProductUpsertPayload, operatorId: string, operatorName: string): Promise<ProductDTO>;
  updateProduct(id: string, payload: ProductUpsertPayload, operatorId: string, operatorName: string): Promise<ProductDTO>;
  deleteProduct(id: string): Promise<void>;
  publishProduct(id: string, status: ProductDTO['status'], operatorId: string, operatorName: string): Promise<ProductDTO>;
  adjustInventory(payload: InventoryAdjustPayload, operatorId: string, operatorName: string): Promise<ProductDTO>;
  listCategories(): Promise<CategoryDTO[]>;
  listInventoryRecords(): Promise<InventoryRecordDTO[]>;
  listOrders(): Promise<OrderDTO[]>;
}
