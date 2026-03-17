import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { InventoryAdjustPayload, ProductDTO, ProductFilter, ProductUpsertPayload } from '@enterprise/shared';
import { AuditService } from '../audit/audit.service';
import { DATA_STORE, type DataStore } from '../data/contracts/data-store';

@Injectable()
export class ProductService {
  constructor(
    @Inject(DATA_STORE) private readonly store: DataStore,
    private readonly auditService: AuditService
  ) {}

  async list(filter: ProductFilter) {
    return this.store.listProducts(filter);
  }

  async detail(id: string): Promise<ProductDTO> {
    const product = await this.store.getProductDetail(id);
    if (!product) {
      throw new NotFoundException('商品不存在');
    }
    return product;
  }

  async create(payload: ProductUpsertPayload, operatorId: string, operatorName: string): Promise<ProductDTO> {
    const created = await this.store.createProduct(payload, operatorId, operatorName);
    await this.auditService.record({ action: 'product.create', module: 'product', operatorId, operatorName, detail: `创建商品 ${created.name}` });
    return created;
  }

  async update(id: string, payload: ProductUpsertPayload, operatorId: string, operatorName: string): Promise<ProductDTO> {
    const current = await this.store.updateProduct(id, payload, operatorId, operatorName);
    await this.auditService.record({ action: 'product.update', module: 'product', operatorId, operatorName, detail: `更新商品 ${current.name}` });
    return current;
  }

  async remove(id: string, operatorId: string, operatorName: string): Promise<void> {
    const current = await this.detail(id);
    await this.store.deleteProduct(id);
    await this.auditService.record({ action: 'product.delete', module: 'product', operatorId, operatorName, detail: `删除商品 ${current.name}` });
  }

  async publish(id: string, status: ProductDTO['status'], operatorId: string, operatorName: string): Promise<ProductDTO> {
    const product = await this.store.publishProduct(id, status, operatorId, operatorName);
    await this.auditService.record({ action: 'product.publish', module: 'product', operatorId, operatorName, detail: `${status === 'active' ? '上架' : '下架'}商品 ${product.name}` });
    return product;
  }

  async adjustInventory(payload: InventoryAdjustPayload, operatorId: string, operatorName: string): Promise<ProductDTO> {
    const product = await this.store.adjustInventory(payload, operatorId, operatorName);
    await this.auditService.record({ action: 'inventory.adjust', module: 'inventory', operatorId, operatorName, detail: `调整商品 ${product.name} 库存 ${payload.change}` });
    return product;
  }

  async categories() {
    return this.store.listCategories();
  }

  async inventoryRecords() {
    return this.store.listInventoryRecords();
  }

  async orders() {
    return this.store.listOrders();
  }
}
