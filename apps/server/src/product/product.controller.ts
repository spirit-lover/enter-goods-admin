import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import type { UserProfile } from '@enterprise/shared';
import { PERMISSION_CODES } from '@enterprise/shared';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permission } from '../common/decorators/permission.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { AdjustInventoryDto, ProductQueryDto, ProductUpsertDto, PublishProductDto } from './product.dto';
import { ProductService } from './product.service';

@Controller('products')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Permission(PERMISSION_CODES.productRead)
  list(@Query() query: ProductQueryDto) {
    return this.productService.list(query);
  }

  @Get('categories')
  @Permission(PERMISSION_CODES.productRead)
  categories() {
    return this.productService.categories();
  }

  @Get('inventory/records')
  @Permission(PERMISSION_CODES.inventoryAdjust)
  inventoryRecords() {
    return this.productService.inventoryRecords();
  }

  @Get('orders')
  @Permission(PERMISSION_CODES.orderRead)
  orders() {
    return this.productService.orders();
  }

  @Get(':id')
  @Permission(PERMISSION_CODES.productRead)
  detail(@Param('id') id: string) {
    return this.productService.detail(id);
  }

  @Post()
  @Permission(PERMISSION_CODES.productWrite)
  create(@Body() body: ProductUpsertDto, @CurrentUser() user: UserProfile) {
    return this.productService.create(body, user.id, user.displayName);
  }

  @Patch(':id')
  @Permission(PERMISSION_CODES.productWrite)
  update(@Param('id') id: string, @Body() body: ProductUpsertDto, @CurrentUser() user: UserProfile) {
    return this.productService.update(id, body, user.id, user.displayName);
  }

  @Patch(':id/status')
  @Permission(PERMISSION_CODES.productPublish)
  publish(@Param('id') id: string, @Body() body: PublishProductDto, @CurrentUser() user: UserProfile) {
    return this.productService.publish(id, body.status, user.id, user.displayName);
  }

  @Post('inventory/adjust')
  @Permission(PERMISSION_CODES.inventoryAdjust)
  adjustInventory(@Body() body: AdjustInventoryDto, @CurrentUser() user: UserProfile) {
    return this.productService.adjustInventory(body, user.id, user.displayName);
  }

  @Delete(':id')
  @Permission(PERMISSION_CODES.productWrite)
  remove(@Param('id') id: string, @CurrentUser() user: UserProfile) {
    return this.productService.remove(id, user.id, user.displayName);
  }
}
