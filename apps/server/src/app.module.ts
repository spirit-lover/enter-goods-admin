import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { SessionStoreService } from './auth/session-store.service';
import { AuditService } from './audit/audit.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { DATA_STORE } from './data/contracts/data-store';
import { PrismaDataStore } from './data/prisma-data.store';
import { PermissionController } from './permission/permission.controller';
import { PermissionService } from './permission/permission.service';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { SystemController } from './system/system.controller';
import { SystemService } from './system/system.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PermissionGuard } from './common/guards/permission.guard';

@Module({
  controllers: [AuthController, PermissionController, ProductController, DashboardController, SystemController],
  providers: [
    PrismaDataStore,
    { provide: DATA_STORE, useExisting: PrismaDataStore },
    AuditService,
    SessionStoreService,
    AuthService,
    PermissionService,
    ProductService,
    DashboardService,
    SystemService,
    JwtAuthGuard,
    PermissionGuard
  ]
})
export class AppModule {}
