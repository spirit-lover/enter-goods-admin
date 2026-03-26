# MongoDB Data Store Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 `apps/server` 增加一套 `MongoDataStore` 实现，并通过环境变量在 MySQL/Prisma 与 MongoDB 之间切换。

**Architecture:** 保留现有 `DataStore` 抽象与服务层接口不变，新增 MongoDB 连接层和 `MongoDataStore`，在 `AppModule` 中使用 provider factory 根据环境变量选择实际实现。测试分为 provider 选择测试和 Mongo 数据访问行为测试，两条存储实现并存。

**Tech Stack:** NestJS、TypeScript、Prisma、MongoDB Node Driver、Vitest

---

### Task 1: 补环境变量切换的失败测试

**Files:**
- Modify: `apps/server/test/provider-selection.spec.ts`（新建）
- Check: `apps/server/src/app.module.ts`

**Step 1: Write the failing test**

补一组测试，定义：
- `DATA_STORE_DRIVER=mongo` 时返回 `MongoDataStore`
- `DATA_STORE_DRIVER=mysql` 或未设置时返回 `PrismaDataStore`

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @enterprise/server test -- test/provider-selection.spec.ts`
Expected: FAIL，提示缺少 Mongo provider 选择逻辑或缺少 `MongoDataStore`

**Step 3: Write minimal implementation**

新增 provider 工厂和导出函数，使测试能直接验证绑定结果。

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @enterprise/server test -- test/provider-selection.spec.ts`
Expected: PASS

### Task 2: 补 MongoDataStore 的失败测试

**Files:**
- Modify: `apps/server/test/mongo-data.store.spec.ts`（新建）
- Check: `apps/server/src/data/contracts/data-store.ts`
- Check: `apps/server/src/data/in-memory-data.store.ts`

**Step 1: Write the failing test**

覆盖至少两个行为：
- 读取管理员资料、角色、菜单和权限
- 创建商品后调整库存并写入库存流水

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @enterprise/server test -- test/mongo-data.store.spec.ts`
Expected: FAIL，提示 `MongoDataStore` 或连接层未实现

**Step 3: Write minimal implementation**

补 MongoDataStore 骨架与必要辅助函数，满足测试断言。

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @enterprise/server test -- test/mongo-data.store.spec.ts`
Expected: PASS

### Task 3: 实现 Mongo 连接层和完整 CRUD

**Files:**
- Create: `apps/server/src/data/mongo.client.ts`
- Create: `apps/server/src/data/mongo-data.store.ts`
- Modify: `apps/server/src/data/contracts/data-store.ts`（如需增加导出辅助类型）

**Step 1: Write the failing test**

基于 Task 2 的测试继续补齐缺失行为，不新增无关功能。

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @enterprise/server test -- test/mongo-data.store.spec.ts`
Expected: FAIL，明确指向缺失的 CRUD 或聚合逻辑

**Step 3: Write minimal implementation**

实现：
- 用户、角色、菜单、会话、日志、商品、分类、订单、库存流水的 CRUD
- 菜单树构建
- 商品分页、模糊查询、库存事务性更新（单文档/多文档最小一致性处理）

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @enterprise/server test -- test/mongo-data.store.spec.ts`
Expected: PASS

### Task 4: 接入模块切换与配置说明

**Files:**
- Modify: `apps/server/src/app.module.ts`
- Modify: `apps/server/package.json`
- Modify: `apps/server/.env.example`

**Step 1: Write the failing test**

补 provider 选择测试中缺失的分支断言，例如默认值和非法值回退行为。

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @enterprise/server test -- test/provider-selection.spec.ts`
Expected: FAIL，说明 provider factory 行为未完全覆盖

**Step 3: Write minimal implementation**

新增 Mongo 依赖、默认配置与环境变量说明，并完成 provider factory 接线。

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @enterprise/server test -- test/provider-selection.spec.ts`
Expected: PASS

### Task 5: 完整验证

**Files:**
- Check: `apps/server/test/provider-selection.spec.ts`
- Check: `apps/server/test/mongo-data.store.spec.ts`
- Check: `apps/server/test/prisma-data.store.spec.ts`

**Step 1: Run focused tests**

Run: `pnpm --filter @enterprise/server test -- test/provider-selection.spec.ts test/mongo-data.store.spec.ts`
Expected: PASS

**Step 2: Run broader server test suite**

Run: `pnpm --filter @enterprise/server test`
Expected: PASS

**Step 3: Run typecheck**

Run: `pnpm --filter @enterprise/server typecheck`
Expected: PASS
