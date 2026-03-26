# Redis Session And Cache Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 `apps/server` 接入 Redis，用于登录 session/token 存储，以及 `dashboard`、`permission` 接口缓存。

**Architecture:** 保持现有 `DataStore` 负责长期业务数据，新增 `RedisClientService` 负责 Redis 连接。`SessionStoreService` 在 `SESSION_DRIVER=redis` 时走 Redis，否则回退到现有 `DataStore`；`DashboardService` 和 `PermissionService` 在 `CACHE_DRIVER=redis` 时走 Redis 缓存，否则直接查库。

**Tech Stack:** NestJS、TypeScript、ioredis、Vitest、Docker Redis

---

### Task 1: 写 Redis session 失败测试

**Files:**
- Create: `apps/server/test/session-store.redis.spec.ts`
- Modify: `apps/server/src/auth/session-store.service.ts`

**Step 1: Write the failing test**

覆盖两个行为：
- `SESSION_DRIVER=redis` 时，`save/resolve/revoke` 走 Redis 而不是 `DataStore`
- `revoke` 会让该用户的 access/refresh token 同时失效

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @enterprise/server test -- test/session-store.redis.spec.ts`
Expected: FAIL，提示 Redis 路径不存在

**Step 3: Write minimal implementation**

新增 Redis 客户端封装和 SessionStoreService 的 Redis 分支。

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @enterprise/server test -- test/session-store.redis.spec.ts`
Expected: PASS

### Task 2: 写 dashboard/permission 缓存失败测试

**Files:**
- Create: `apps/server/test/redis-cache.spec.ts`
- Modify: `apps/server/src/dashboard/dashboard.service.ts`
- Modify: `apps/server/src/permission/permission.service.ts`

**Step 1: Write the failing test**

覆盖三个行为：
- `DashboardService.summary()` 命中缓存后不重复查库
- `PermissionService.getMenus()` 命中缓存后不重复查库
- `PermissionService.getCodes()` 命中缓存后不重复查库

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @enterprise/server test -- test/redis-cache.spec.ts`
Expected: FAIL，提示缓存路径缺失

**Step 3: Write minimal implementation**

给两个 service 接入 Redis 缓存键和 TTL。

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @enterprise/server test -- test/redis-cache.spec.ts`
Expected: PASS

### Task 3: 实现 Redis 基础设施与模块注册

**Files:**
- Create: `apps/server/src/redis/redis.client.ts`
- Modify: `apps/server/src/app.module.ts`
- Modify: `apps/server/.env.example`

**Step 1: Write the failing test**

补一个 provider 初始化测试，确保 Redis 客户端不会在 `memory` 模式下强制连接。

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @enterprise/server test -- test/session-store.redis.spec.ts test/redis-cache.spec.ts`
Expected: FAIL，指向依赖注入或配置问题

**Step 3: Write minimal implementation**

实现 Redis 客户端惰性连接、字符串/JSON 读写、set/setex/del/set-members 辅助方法。

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @enterprise/server test -- test/session-store.redis.spec.ts test/redis-cache.spec.ts`
Expected: PASS

### Task 4: 完整验证

**Files:**
- Check: `apps/server/test/session-store.redis.spec.ts`
- Check: `apps/server/test/redis-cache.spec.ts`

**Step 1: Run focused tests**

Run: `pnpm --filter @enterprise/server test -- test/session-store.redis.spec.ts test/redis-cache.spec.ts`
Expected: PASS

**Step 2: Run related existing tests**

Run: `pnpm --filter @enterprise/server test -- test/auth.service.spec.ts test/product.service.spec.ts test/permission.guard.spec.ts`
Expected: PASS

**Step 3: Run typecheck**

Run: `pnpm --filter @enterprise/server typecheck`
Expected: PASS
