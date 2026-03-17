import { Inject, Injectable } from '@nestjs/common';
import { DATA_STORE, type DataStore } from '../data/contracts/data-store';

@Injectable()
export class DashboardService {
  constructor(@Inject(DATA_STORE) private readonly store: DataStore) {}

  async summary() {
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
