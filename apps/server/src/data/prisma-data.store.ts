import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { buildMenuTree, type CategoryDTO, type InventoryAdjustPayload, type InventoryRecordDTO, type MenuTreeNode, type OrderDTO, type PageResult, type PermissionCode, type ProductDTO, type ProductFilter, type ProductUpsertPayload, type UserProfile } from '@enterprise/shared';
import type { DataStore, OperationLogRecord, RoleRecord, UserRecord } from './contracts/data-store';

function asStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
}

function toProductDTO(item: Prisma.ProductGetPayload<{ include: { category: true } }>): ProductDTO {
  return {
    id: item.id,
    name: item.name,
    sku: item.sku,
    categoryId: item.categoryId,
    categoryName: item.category.name,
    price: Number(item.price),
    costPrice: Number(item.costPrice),
    stock: item.stock,
    sales: item.sales,
    status: item.status as ProductDTO['status'],
    cover: item.cover,
    description: item.description,
    updatedAt: item.updatedAt.toISOString()
  };
}

function toMenuNode(item: { id: string; parentId: string | null; name: string; title: string; icon: string | null; path: string; component: string | null; permission: string | null; type: string; hidden: boolean; }): MenuTreeNode {
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
export class PrismaDataStore extends PrismaClient implements DataStore {
  async findUserByUsername(username: string): Promise<UserRecord | undefined> {
    const user = await this.user.findUnique({ where: { username } });
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
    const user = await this.user.findUnique({ where: { id: userId } });
    if (!user) {
      return undefined;
    }

    const roleIds = asStringArray(user.roleIds);
    const roles = await this.role.findMany({ where: { id: { in: roleIds } } });
    const menuIds = Array.from(new Set(roles.flatMap((item) => asStringArray(item.menuIds))));
    const menus = await this.menu.findMany({ where: { id: { in: menuIds } }, orderBy: [{ sort: 'asc' }, { createdAt: 'asc' }] });

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
    const users = await this.user.findMany({ orderBy: { createdAt: 'asc' } });
    const profiles = await Promise.all(users.map((item) => this.getUserProfile(item.id)));
    return profiles.filter((item): item is UserProfile => Boolean(item));
  }

  async listRoles(): Promise<RoleRecord[]> {
    const roles = await this.role.findMany({ orderBy: { createdAt: 'asc' } });
    return roles.map((item) => ({
      id: item.id,
      name: item.name,
      permissionCodes: asStringArray(item.permissionCodes) as PermissionCode[],
      menuIds: asStringArray(item.menuIds)
    }));
  }

  async listMenus(): Promise<MenuTreeNode[]> {
    const menus = await this.menu.findMany({ orderBy: [{ sort: 'asc' }, { createdAt: 'asc' }] });
    return buildMenuTree(menus.map(toMenuNode));
  }

  async listOperationLogs(): Promise<OperationLogRecord[]> {
    const logs = await this.operationLog.findMany({ orderBy: { createdAt: 'desc' } });
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
    const record = await this.operationLog.create({ data: input });
    return {
      id: record.id,
      action: record.action,
      module: record.module,
      operatorId: record.operatorId,
      operatorName: record.operatorName,
      detail: record.detail,
      ip: record.ip,
      createdAt: record.createdAt.toISOString()
    };
  }

  async saveSession(userId: string, accessToken: string, refreshToken: string): Promise<void> {
    await this.session.create({ data: { userId, accessToken, refreshToken } });
  }

  async resolveAccessToken(token: string): Promise<string | null> {
    const session = await this.session.findUnique({ where: { accessToken: token } });
    return session?.userId ?? null;
  }

  async resolveRefreshToken(token: string): Promise<string | null> {
    const session = await this.session.findUnique({ where: { refreshToken: token } });
    return session?.userId ?? null;
  }

  async revokeSession(refreshToken: string): Promise<void> {
    const session = await this.session.findUnique({ where: { refreshToken } });
    if (!session) {
      return;
    }
    await this.session.deleteMany({ where: { userId: session.userId } });
  }

  async listProducts(filter: ProductFilter): Promise<PageResult<ProductDTO>> {
    const keyword = filter.keyword?.trim();
    const where: Prisma.ProductWhereInput = {
      categoryId: filter.categoryId || undefined,
      status: filter.status || undefined,
      ...(keyword
        ? { OR: [{ name: { contains: keyword } }, { sku: { contains: keyword } }] }
        : {})
    };

    const [items, total] = await Promise.all([
      this.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (filter.page - 1) * filter.pageSize,
        take: filter.pageSize
      }),
      this.product.count({ where })
    ]);

    return {
      items: items.map(toProductDTO),
      total,
      page: filter.page,
      pageSize: filter.pageSize
    };
  }

  async getProductDetail(id: string): Promise<ProductDTO | undefined> {
    const item = await this.product.findUnique({ where: { id }, include: { category: true } });
    return item ? toProductDTO(item) : undefined;
  }

  async createProduct(payload: ProductUpsertPayload): Promise<ProductDTO> {
    const item = await this.product.create({
      data: {
        id: `prod-${Date.now()}`,
        name: payload.name,
        sku: payload.sku,
        categoryId: payload.categoryId,
        price: new Prisma.Decimal(payload.price),
        costPrice: new Prisma.Decimal(payload.costPrice),
        stock: payload.stock,
        sales: 0,
        status: payload.status,
        cover: payload.cover,
        description: payload.description
      },
      include: { category: true }
    });
    return toProductDTO(item);
  }

  async updateProduct(id: string, payload: ProductUpsertPayload): Promise<ProductDTO> {
    const item = await this.product.update({
      where: { id },
      data: {
        name: payload.name,
        sku: payload.sku,
        categoryId: payload.categoryId,
        price: new Prisma.Decimal(payload.price),
        costPrice: new Prisma.Decimal(payload.costPrice),
        stock: payload.stock,
        status: payload.status,
        cover: payload.cover,
        description: payload.description
      },
      include: { category: true }
    });
    return toProductDTO(item);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.product.delete({ where: { id } });
  }

  async publishProduct(id: string, status: ProductDTO['status']): Promise<ProductDTO> {
    const item = await this.product.update({ where: { id }, data: { status }, include: { category: true } });
    return toProductDTO(item);
  }

  async adjustInventory(payload: InventoryAdjustPayload, _operatorId: string, operatorName: string): Promise<ProductDTO> {
    const item = await this.$transaction(async (tx) => {
      await tx.inventoryRecord.create({
        data: {
          productId: payload.productId,
          change: payload.change,
          reason: payload.reason,
          operatorName
        }
      });
      return tx.product.update({
        where: { id: payload.productId },
        data: { stock: { increment: payload.change } },
        include: { category: true }
      });
    });
    return toProductDTO(item);
  }

  async listCategories(): Promise<CategoryDTO[]> {
    const categories = await this.productCategory.findMany({ orderBy: [{ sort: 'asc' }, { createdAt: 'asc' }] });
    return categories.map((item) => ({ id: item.id, name: item.name, status: item.status as CategoryDTO['status'], sort: item.sort }));
  }

  async listInventoryRecords(): Promise<InventoryRecordDTO[]> {
    const records = await this.inventoryRecord.findMany({ include: { product: true }, orderBy: { createdAt: 'asc' } });
    return records.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      change: item.change,
      reason: item.reason,
      createdAt: item.createdAt.toISOString(),
      operatorName: item.operatorName
    }));
  }

  async listOrders(): Promise<OrderDTO[]> {
    const orders = await this.order.findMany({ orderBy: { createdAt: 'desc' } });
    return orders.map((item) => ({
      id: item.id,
      orderNo: item.orderNo,
      customerName: item.customerName,
      amount: Number(item.amount),
      status: item.status as OrderDTO['status'],
      createdAt: item.createdAt.toISOString()
    }));
  }
}
