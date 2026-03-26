import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { SessionStoreService } from './auth/session-store.service';
import { AuditService } from './audit/audit.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { DATA_STORE } from './data/contracts/data-store';
import { MongoClientService } from './data/mongo.client';
import { MongoDataStore } from './data/mongo-data.store';
import { PrismaDataStore } from './data/prisma-data.store';
import { RedisClientService } from './redis/redis.client';
import { PermissionController } from './permission/permission.controller';
import { PermissionService } from './permission/permission.service';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { SystemController } from './system/system.controller';
import { SystemService } from './system/system.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PermissionGuard } from './common/guards/permission.guard';

export function resolveDataStoreDriver(): 'mongo' | 'mysql' {
  const driver = (process.env.DATA_STORE_DRIVER ?? process.env.PERSISTENCE_DRIVER ?? 'mysql').toLowerCase();
  return driver === 'mongo' ? 'mongo' : 'mysql';
}

@Module({
  controllers: [AuthController, PermissionController, ProductController, DashboardController, SystemController],
  providers: [
    PrismaDataStore,
    MongoClientService,
    MongoDataStore,
    RedisClientService,
    {
      provide: DATA_STORE,
      inject: [PrismaDataStore, MongoDataStore],
      useFactory: (prismaStore: PrismaDataStore, mongoStore: MongoDataStore) =>
        resolveDataStoreDriver() === 'mongo' ? mongoStore : prismaStore
    },
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
