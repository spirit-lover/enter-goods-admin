import { Inject, Injectable, Optional } from '@nestjs/common';
import { DATA_STORE, type DataStore } from '../data/contracts/data-store';
import { RedisClientService } from '../redis/redis.client';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(DATA_STORE) private readonly store: DataStore,
    @Optional() @Inject(RedisClientService) private readonly redisClient?: RedisClientService
  ) {}

  private useRedisCache(): boolean {
    return (process.env.CACHE_DRIVER ?? 'memory').toLowerCase() === 'redis' && Boolean(this.redisClient);
  }

  async summary() {
    if (this.useRedisCache()) {
      const cached = await this.redisClient!.getJson<Awaited<ReturnType<DashboardService['buildSummary']>>>('cache:dashboard:summary');
      if (cached) {
        return cached;
      }
    }

    const summary = await this.buildSummary();
    if (this.useRedisCache()) {
      await this.redisClient!.setJson('cache:dashboard:summary', summary, 60);
    }
    return summary;
  }

  private async buildSummary() {
    const [products, orders, logs] = await Promise.all([
      this.store.listProducts({ page: 1, pageSize: 1000 }),
      this.store.listOrders(),
      this.store.listOperationLogs()
    ]);
    return {
      productCount: products.total,
      activeProductCount: products.items.filter((item) => item.status === 'active').length,
      orderCount: orders.length,
      paidOrderAmount: orders.filter((item) => item.status === 'paid' || item.status === 'completed').reduce((total, item) => total + item.amount, 0),
      inventoryAlertCount: products.items.filter((item) => item.stock < 20).length,
      latestLogs: logs.slice(0, 5)
    };
  }
}
