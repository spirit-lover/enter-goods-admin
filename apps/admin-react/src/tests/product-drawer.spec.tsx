import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ProductUpsertPayload } from '@enterprise/shared';
import { ProductDrawer } from '../views/products/product-drawer';

describe('ProductDrawer', () => {
  it('提交时输出标准商品载荷', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <ProductDrawer
        open
        categories={[{ id: 'cate-electronics', name: '数码电器', status: 'enabled', sort: 1 }]}
        initialValue={null}
        onClose={() => undefined}
        onSubmit={handleSubmit}
      />
    );

    await user.type(screen.getByLabelText('商品名称'), '企业网关');
    await user.type(screen.getByLabelText('SKU'), 'GW-001');
    await user.type(screen.getByLabelText('售价'), '1999');
    await user.type(screen.getByLabelText('成本价'), '1200');
    await user.clear(screen.getByLabelText('库存'));
    await user.type(screen.getByLabelText('库存'), '18');
    await user.type(screen.getByLabelText('商品描述'), '网络设备新品');
    await user.click(screen.getByRole('button', { name: '保存商品' }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit.mock.calls[0][0] satisfies ProductUpsertPayload).toMatchObject({
      name: '企业网关',
      sku: 'GW-001',
      categoryId: 'cate-electronics',
      price: 1999,
      costPrice: 1200,
      stock: 18,
      status: 'draft'
    });
  }, 10000);
});
