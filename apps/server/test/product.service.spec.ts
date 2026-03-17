import { describe, expect, it } from 'vitest';
import { ProductService } from '../src/product/product.service';
import { AuditService } from '../src/audit/audit.service';
import { InMemoryDataStore } from '../src/data/in-memory-data.store';

describe('ProductService', () => {
  it('按关键字分页查询商品', async () => {
    const store = new InMemoryDataStore();
    const auditService = new AuditService(store);
    const service = new ProductService(store, auditService);

    const result = await service.list({ keyword: '旗舰', page: 1, pageSize: 10 });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toContain('旗舰');
  });

  it('创建商品时记录操作日志', async () => {
    const store = new InMemoryDataStore();
    const auditService = new AuditService(store);
    const service = new ProductService(store, auditService);

    const created = await service.create({
      name: '新品笔记本',
      sku: 'NB-1000',
      categoryId: 'cate-electronics',
      price: 8999,
      costPrice: 6500,
      stock: 12,
      status: 'draft',
      cover: 'https://example.com/notebook.png',
      description: '企业采购主推机型'
    }, 'u-admin', '系统管理员');
    const logs = await store.listOperationLogs();

    expect(created.id).toBeTruthy();
    expect(logs[0]?.action).toBe('product.create');
  });

  it('调整库存后会同步写入库存流水', async () => {
    const store = new InMemoryDataStore();
    const auditService = new AuditService(store);
    const service = new ProductService(store, auditService);
    const before = await store.getProductDetail('prod-001');

    const updated = await service.adjustInventory({ productId: 'prod-001', change: 5, reason: '补货' }, 'u-admin', '系统管理员');
    const records = await store.listInventoryRecords();
    const logs = await store.listOperationLogs();

    expect(updated.stock).toBe((before?.stock ?? 0) + 5);
    expect(records.at(-1)?.change).toBe(5);
    expect(logs[0]?.action).toBe('inventory.adjust');
  });
});
