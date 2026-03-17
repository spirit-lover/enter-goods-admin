import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsIn(['draft', 'active', 'inactive'])
  status?: 'draft' | 'active' | 'inactive';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize = 10;
}

export class ProductUpsertDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  sku!: string;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  costPrice!: number;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsIn(['draft', 'active', 'inactive'])
  status!: 'draft' | 'active' | 'inactive';

  @IsString()
  @IsNotEmpty()
  cover!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}

export class PublishProductDto {
  @IsIn(['active', 'inactive'])
  status!: 'active' | 'inactive';
}

export class AdjustInventoryDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  change!: number;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}
