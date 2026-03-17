# 企业级商品后台管理平台

基于 `pnpm workspace` 的全栈 Monorepo，前端使用 `Vue3 + Vite + TypeScript`，后端使用 `NestJS 风格模块化 Node.js`，并预留 `Prisma + MySQL + Redis` 接入能力。

## 目录结构

- `apps/web`：后台前端，包含登录、仪表盘、商品/分类/库存/订单、系统管理页面
- `apps/server`：后端 API，包含认证、RBAC、商品、库存、订单、日志与系统配置接口
- `packages/shared`：前后端共享 DTO、权限码、菜单模型与分页响应类型

## 当前能力

- 登录、退出、获取当前用户信息
- RBAC 权限控制、动态菜单、按钮权限指令
- 商品管理、上下架、删除、库存流水
- 分类管理、订单列表、操作日志、系统设置
- 仪表盘统计
- Docker Compose 启动 MySQL/Redis
- Prisma schema 与基础 seed 骨架

## 本地启动

```bash
pnpm install
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
pnpm dev
```

默认前端地址：`http://localhost:5173`
默认后端地址：`http://localhost:3000`
Swagger 地址：`http://localhost:3000/docs`

## 验证命令

```bash
pnpm test
pnpm typecheck
pnpm build
```

## 默认账号

- 管理员：`admin / Admin123!`
- 运营专员：`operator / Operator123!`

## 基础设施

```bash
docker compose up -d
```

当前后端默认使用内存数据仓启动，以便在没有数据库初始化的情况下直接运行主流程；`apps/server/prisma/schema.prisma` 与 `docker-compose.yml` 已为接入 MySQL/Redis 预留完整骨架。

## 后续建议

- 将 `InMemoryDataStore` 替换为 Prisma Repository
- 使用真实 JWT 与 Redis session/refresh token 存储
- 补充 E2E 登录与商品管理主链路测试
- 完成上传、导出与对象存储适配
