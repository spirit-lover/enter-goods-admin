import { Inject, Injectable } from '@nestjs/common';
import { ObjectId, type Filter, type Sort } from 'mongodb';
import { buildMenuTree, type CategoryDTO, type InventoryAdjustPayload, type InventoryRecordDTO, type MenuTreeNode, type OrderDTO, type PageResult, type PermissionCode, type ProductDTO, type ProductFilter, type ProductUpsertPayload, type UserProfile } from '@enterprise/shared';
import type { DataStore, OperationLogRecord, RoleRecord, UserRecord } from './contracts/data-store';
import { MongoClientService } from './mongo.client';

interface MongoUserDocument {
  id: string;
  username: string;
  passwordHash: string;
  displayName: string;
  email: string;
  phone: string;
  department: string;
  status?: string;
  roleIds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface MongoRoleDocument {
  id: string;
  name: string;
  permissionCodes?: string[];
  menuIds?: string[];
  createdAt?: Date;
}

interface MongoMenuDocument {
  id: string;
  parentId: string | null;
  name: string;
  title: string;
  path: string;
  component?: string | null;
  permission?: string | null;
  type: string;
  icon?: string | null;
  hidden: boolean;
  sort: number;
  createdAt?: Date;
}

interface MongoCategoryDocument {
  id: string;
  name: string;
  status: CategoryDTO['status'];
  sort: number;
  createdAt?: Date;
}

interface MongoProductDocument {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  costPrice: number;
  stock: number;
  sales: number;
  status: ProductDTO['status'];
  cover: string;
  description: string;
  createdBy?: string;
  updatedBy?: string;
  remark?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MongoInventoryRecordDocument {
  id: string;
  productId: string;
  productName: string;
  change: number;
  reason: string;
  operatorName: string;
  createdAt: Date;
}

interface MongoOrderDocument {
  id: string;
  orderNo: string;
  customerName: string;
  amount: number;
  status: OrderDTO['status'];
  remark?: string;
  createdAt: Date;
}

interface MongoOperationLogDocument {
  id: string;
  action: string;
  module: string;
  operatorId: string;
  operatorName: string;
  detail: string;
  ip: string;
  createdAt: Date;
}

interface MongoSessionDocument {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toMenuNode(item: MongoMenuDocument): MenuTreeNode {
  return {
    id: item.id,
    parentId: item.parentId,
    name: item.name,
    title: item.title,
    icon: item.icon ?? undefined,
    path: item.path,
    component: item.component ?? undefined,
    permission: (item.permission as PermissionCode | null) ?? undefined,
    type: item.type as MenuTreeNode['type'],
    hidden: item.hidden
  };
}

@Injectable()
export class MongoDataStore implements DataStore {
  constructor(@Inject(MongoClientService) private readonly mongoClientService: MongoClientService) {}

  private async db() {
    return this.mongoClientService.getDb();
  }

  private async getCategoryMap(categoryIds: string[]): Promise<Map<string, MongoCategoryDocument>> {
    const ids = Array.from(new Set(categoryIds.filter(Boolean)));
    if (ids.length === 0) {
      return new Map();
    }

    const categories = await (await this.db())
      .collection<MongoCategoryDocument>('productCategories')
      .find({ id: { $in: ids } })
      .toArray();

    return new Map(categories.map((item) => [item.id, item]));
  }

  private toProductDTO(item: MongoProductDocument, categoryMap: Map<string, MongoCategoryDocument>): ProductDTO {
    return {
      id: item.id,
      name: item.name,
      sku: item.sku,
      categoryId: item.categoryId,
      categoryName: categoryMap.get(item.categoryId)?.name ?? '未分类',
      price: item.price,
      costPrice: item.costPrice,
      stock: item.stock,
      sales: item.sales,
      status: item.status,
      cover: item.cover,
      description: item.description,
      updatedAt: item.updatedAt.toISOString()
    };
  }

  async findUserByUsername(username: string): Promise<UserRecord | undefined> {
    const user = await (await this.db()).collection<MongoUserDocument>('users').findOne({ username });
    if (!user) {
      return undefined;
    }

    return {
      id: user.id,
      username: user.username,
      passwordHash: user.passwordHash,
      displayName: user.displayName,
      email: user.email,
      phone: user.phone,
      department: user.department,
      roleIds: asStringArray(user.roleIds)
    };
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const db = await this.db();
    const user = await db.collection<MongoUserDocument>('users').findOne({ id: userId });
    if (!user) {
      return undefined;
    }

    const roleIds = asStringArray(user.roleIds);
    const roles = await db
      .collection<MongoRoleDocument>('roles')
      .find({ id: { $in: roleIds } })
      .sort({ createdAt: 1 })
      .toArray();

    const menuIds = Array.from(new Set(roles.flatMap((item) => asStringArray(item.menuIds))));
    const menus = await db
      .collection<MongoMenuDocument>('menus')
      .find({ id: { $in: menuIds } })
      .sort({ sort: 1, createdAt: 1 })
      .toArray();

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      phone: user.phone,
      department: user.department,
      roleIds,
      roles: roles.map((item) => item.name),
      permissions: roles.flatMap((item) => asStringArray(item.permissionCodes) as PermissionCode[]),
      menus: buildMenuTree(menus.map(toMenuNode))
    };
  }

  async listUsers(): Promise<UserProfile[]> {
    const users = await (await this.db()).collection<MongoUserDocument>('users').find({}).sort({ createdAt: 1 }).toArray();
    const profiles = await Promise.all(users.map((item) => this.getUserProfile(item.id)));
    return profiles.filter((item): item is UserProfile => Boolean(item));
  }

  async listRoles(): Promise<RoleRecord[]> {
    const roles = await (await this.db()).collection<MongoRoleDocument>('roles').find({}).sort({ createdAt: 1 }).toArray();
    return roles.map((item) => ({
      id: item.id,
      name: item.name,
      permissionCodes: asStringArray(item.permissionCodes) as PermissionCode[],
      menuIds: asStringArray(item.menuIds)
    }));
  }

  async listMenus(): Promise<MenuTreeNode[]> {
    const menus = await (await this.db()).collection<MongoMenuDocument>('menus').find({}).sort({ sort: 1, createdAt: 1 }).toArray();
    return buildMenuTree(menus.map(toMenuNode));
  }

  async listOperationLogs(): Promise<OperationLogRecord[]> {
    const logs = await (await this.db())
      .collection<MongoOperationLogDocument>('operationLogs')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return logs.map((item) => ({
      id: item.id,
      action: item.action,
      module: item.module,
      operatorId: item.operatorId,
      operatorName: item.operatorName,
      detail: item.detail,
      ip: item.ip,
      createdAt: item.createdAt.toISOString()
    }));
  }

  async createOperationLog(input: Omit<OperationLogRecord, 'id' | 'createdAt'>): Promise<OperationLogRecord> {
    const record: MongoOperationLogDocument = {
      id: new ObjectId().toHexString(),
      action: input.action,
      module: input.module,
      operatorId: input.operatorId,
      operatorName: input.operatorName,
      detail: input.detail,
      ip: input.ip,
      createdAt: new Date()
    };

    await (await this.db()).collection<MongoOperationLogDocument>('operationLogs').insertOne(record);

    return {
      ...record,
      createdAt: record.createdAt.toISOString()
    };
  }

  async saveSession(userId: string, accessToken: string, refreshToken: string): Promise<void> {
    await (await this.db()).collection<MongoSessionDocument>('sessions').insertOne({
      id: new ObjectId().toHexString(),
      userId,
      accessToken,
      refreshToken,
      createdAt: new Date()
    });
  }

  async resolveAccessToken(token: string): Promise<string | null> {
    const session = await (await this.db()).collection<MongoSessionDocument>('sessions').findOne({ accessToken: token });
    return session?.userId ?? null;
  }

  async resolveRefreshToken(token: string): Promise<string | null> {
    const session = await (await this.db()).collection<MongoSessionDocument>('sessions').findOne({ refreshToken: token });
    return session?.userId ?? null;
  }

  async revokeSession(refreshToken: string): Promise<void> {
    const sessions = (await this.db()).collection<MongoSessionDocument>('sessions');
    const session = await sessions.findOne({ refreshToken });
    if (!session) {
      return;
    }

    await sessions.deleteMany({ userId: session.userId });
  }

  async listProducts(filter: ProductFilter): Promise<PageResult<ProductDTO>> {
    const db = await this.db();
    const keyword = filter.keyword?.trim();
    const where: Filter<MongoProductDocument> = {};

    if (filter.categoryId) {
      where.categoryId = filter.categoryId;
    }
    if (filter.status) {
      where.status = filter.status;
    }
    if (keyword) {
      const regex = new RegExp(escapeRegex(keyword), 'i');
      where.$or = [{ name: regex }, { sku: regex }];
    }

    const sort: Sort = { createdAt: -1 };
    const [items, total] = await Promise.all([
      db
        .collection<MongoProductDocument>('products')
        .find(where)
        .sort(sort)
        .skip((filter.page - 1) * filter.pageSize)
        .limit(filter.pageSize)
        .toArray(),
      db.collection<MongoProductDocument>('products').countDocuments(where)
    ]);

    const categoryMap = await this.getCategoryMap(items.map((item) => item.categoryId));

    return {
      items: items.map((item) => this.toProductDTO(item, categoryMap)),
      total,
      page: filter.page,
      pageSize: filter.pageSize
    };
  }

  async getProductDetail(id: string): Promise<ProductDTO | undefined> {
    const item = await (await this.db()).collection<MongoProductDocument>('products').findOne({ id });
    if (!item) {
      return undefined;
    }

    const categoryMap = await this.getCategoryMap([item.categoryId]);
    return this.toProductDTO(item, categoryMap);
  }

  async createProduct(payload: ProductUpsertPayload, operatorId: string, _operatorName: string): Promise<ProductDTO> {
    const db = await this.db();
    const item: MongoProductDocument = {
      id: `prod-${Date.now()}`,
      name: payload.name,
      sku: payload.sku,
      categoryId: payload.categoryId,
      price: payload.price,
      costPrice: payload.costPrice,
      stock: payload.stock,
      sales: 0,
      status: payload.status,
      cover: payload.cover,
      description: payload.description,
      createdBy: operatorId,
      updatedBy: operatorId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection<MongoProductDocument>('products').insertOne(item);
    const categoryMap = await this.getCategoryMap([item.categoryId]);
    return this.toProductDTO(item, categoryMap);
  }

  async updateProduct(id: string, payload: ProductUpsertPayload, operatorId: string, _operatorName: string): Promise<ProductDTO> {
    await (await this.db()).collection<MongoProductDocument>('products').updateOne(
      { id },
      {
        $set: {
          name: payload.name,
          sku: payload.sku,
          categoryId: payload.categoryId,
          price: payload.price,
          costPrice: payload.costPrice,
          stock: payload.stock,
          status: payload.status,
          cover: payload.cover,
          description: payload.description,
          updatedBy: operatorId,
          updatedAt: new Date()
        }
      }
    );

    return (await this.getProductDetail(id))!;
  }

  async deleteProduct(id: string): Promise<void> {
    await (await this.db()).collection<MongoProductDocument>('products').deleteOne({ id });
  }

  async publishProduct(id: string, status: ProductDTO['status'], operatorId: string, _operatorName: string): Promise<ProductDTO> {
    await (await this.db()).collection<MongoProductDocument>('products').updateOne(
      { id },
      {
        $set: {
          status,
          updatedBy: operatorId,
          updatedAt: new Date()
        }
      }
    );

    return (await this.getProductDetail(id))!;
  }

  async adjustInventory(payload: InventoryAdjustPayload, _operatorId: string, operatorName: string): Promise<ProductDTO> {
    const db = await this.db();
    const products = db.collection<MongoProductDocument>('products');
    const product = await products.findOne({ id: payload.productId });
    if (!product) {
      throw new Error('商品不存在');
    }

    await db.collection<MongoInventoryRecordDocument>('inventoryRecords').insertOne({
      id: new ObjectId().toHexString(),
      productId: payload.productId,
      productName: product.name,
      change: payload.change,
      reason: payload.reason,
      operatorName,
      createdAt: new Date()
    });

    await products.updateOne(
      { id: payload.productId },
      {
        $inc: { stock: payload.change },
        $set: { updatedAt: new Date() }
      }
    );

    return (await this.getProductDetail(payload.productId))!;
  }

  async listCategories(): Promise<CategoryDTO[]> {
    const categories = await (await this.db())
      .collection<MongoCategoryDocument>('productCategories')
      .find({})
      .sort({ sort: 1, createdAt: 1 })
      .toArray();

    return categories.map((item) => ({
      id: item.id,
      name: item.name,
      status: item.status,
      sort: item.sort
    }));
  }

  async listInventoryRecords(): Promise<InventoryRecordDTO[]> {
    const records = await (await this.db())
      .collection<MongoInventoryRecordDocument>('inventoryRecords')
      .find({})
      .sort({ createdAt: 1 })
      .toArray();

    return records.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      change: item.change,
      reason: item.reason,
      createdAt: item.createdAt.toISOString(),
      operatorName: item.operatorName
    }));
  }

  async listOrders(): Promise<OrderDTO[]> {
    const orders = await (await this.db()).collection<MongoOrderDocument>('orders').find({}).sort({ createdAt: -1 }).toArray();
    return orders.map((item) => ({
      id: item.id,
      orderNo: item.orderNo,
      customerName: item.customerName,
      amount: item.amount,
      status: item.status,
      createdAt: item.createdAt.toISOString()
    }));
  }
}
