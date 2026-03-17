import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { ProductUpsertPayload } from '@enterprise/shared';
import ProductForm from '../views/product/ProductForm.vue';

describe('ProductForm', () => {
  it('提交时输出标准商品载荷', async () => {
    const wrapper = mount(ProductForm, {
      props: {
        modelValue: true,
        initialValue: null,
        categories: [
          { id: 'cate-electronics', name: '数码电器', status: 'enabled', sort: 1 }
        ]
      }
    });

    await Promise.resolve();

    const vm = wrapper.vm as unknown as {
      form: ProductUpsertPayload;
      submit: () => Promise<void>;
    };

    vm.form.name = '企业网关';
    vm.form.sku = 'GW-001';
    vm.form.price = 1999;
    vm.form.costPrice = 1200;
    vm.form.stock = 18;
    vm.form.description = '网络设备新品';

    await vm.submit();

    const submitEvent = wrapper.emitted('submit');
    expect(submitEvent).toBeTruthy();
    expect(submitEvent?.[0]?.[0]).toMatchObject({
      name: '企业网关',
      sku: 'GW-001',
      categoryId: 'cate-electronics',
      price: 1999,
      costPrice: 1200,
      stock: 18,
      status: 'draft'
    });
  });
});
