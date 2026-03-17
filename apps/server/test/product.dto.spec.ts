import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { ProductUpsertDto } from '../src/product/product.dto';

describe('ProductUpsertDto', () => {
  it('对非法商品参数返回校验错误', () => {
    const dto = plainToInstance(ProductUpsertDto, {
      name: '',
      sku: '',
      categoryId: '',
      price: -1,
      costPrice: -5,
      stock: -2,
      status: 'invalid',
      cover: '',
      description: ''
    });

    const errors = validateSync(dto);

    expect(errors.length).toBeGreaterThan(0);
  });
});
