# Element Plus UI Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将前端登录页和后台各业务页统一替换为 Element Plus 组件风格，保留现有业务逻辑与权限行为。

**Architecture:** 保持 Vue3 + Pinia + Vue Router 结构不变，只重构视图层。页面统一收束为 Element Plus 的布局、表单、表格、卡片和弹窗组件，少量全局样式只负责容器间距、背景和响应式。

**Tech Stack:** Vue 3、Vite、TypeScript、Element Plus、Pinia、Vue Router、Vitest

---

### Task 1: 规划视图替换范围

**Files:**
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/layouts/AppShell.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/login/LoginView.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/style.css`
- Test: `D:/work/enterprise-goods-admin/apps/web/src/tests/app-shell.spec.ts`

**Step 1: 明确布局入口与测试约束**

确认后台壳层、登录页和全局样式是这轮改造的共享入口，避免分散修改。

**Step 2: 保持现有权限与路由契约**

侧边菜单继续依赖 `menus` 树，退出登录事件和登录提交事件不改名。

**Step 3: 先完成公共骨架**

先改 `AppShell` 和 `LoginView`，为后续所有页面提供统一视觉容器。

### Task 2: 替换登录页与后台壳层

**Files:**
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/layouts/AppShell.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/login/LoginPage.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/login/LoginView.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/RootLayout.vue`

**Step 1: 将后台壳层改为 Element Plus 容器**

用 `el-container`、`el-aside`、`el-header`、`el-main` 和 `el-menu` 渲染菜单。

**Step 2: 将登录页改为 Element Plus 表单**

用 `el-card`、`el-form`、`el-input`、`el-button`、`el-alert` 呈现登录页。

**Step 3: 保持现有交互**

用户名显示、退出事件、登录提交和错误提示继续沿用现有逻辑。

### Task 3: 替换仪表盘与商品域页面

**Files:**
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/dashboard/DashboardView.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/product/ProductListView.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/product/ProductForm.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/product/CategoryView.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/product/InventoryView.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/product/OrderView.vue`
- Test: `D:/work/enterprise-goods-admin/apps/web/src/tests/product-form.spec.ts`

**Step 1: 仪表盘切换为统计卡片**

使用 `el-row`、`el-col`、`el-card`、`el-statistic`、`el-timeline`。

**Step 2: 商品列表切换为标准表格页**

使用 `el-form`、`el-input`、`el-select`、`el-table`、`el-tag`、`el-button`。

**Step 3: 商品弹窗切换为 `el-dialog`**

使用 `el-form` 和基础校验，保持 `submit` 事件返回标准 DTO。

**Step 4: 其余商品域页面切换为只读表格卡片**

分类、库存、订单统一为 `el-card + el-table`。

### Task 4: 替换系统管理页面与收缩样式

**Files:**
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/system/UsersView.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/system/RolesView.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/system/MenusView.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/system/LogsView.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/views/system/SettingsView.vue`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/style.css`

**Step 1: 系统页统一为 Element Plus 卡片与表格**

用户、角色、日志用 `el-table`，菜单用 `el-tree`，设置用 `el-descriptions`。

**Step 2: 删除旧的手写按钮、表格和表单样式**

保留页面背景、布局留白和响应式类，避免与 Element Plus 组件样式冲突。

### Task 5: 更新测试并验证

**Files:**
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/tests/app-shell.spec.ts`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/tests/login-view.spec.ts`
- Modify: `D:/work/enterprise-goods-admin/apps/web/src/tests/product-form.spec.ts`

**Step 1: 调整测试选择器**

让测试适配 Element Plus 渲染结构和新的 `data-testid`。

**Step 2: 运行前端验证**

Run: `pnpm --filter @enterprise/web test`
Expected: PASS

Run: `pnpm --filter @enterprise/web typecheck`
Expected: PASS

**Step 3: 运行全仓验证**

Run: `pnpm test`
Expected: PASS

Run: `pnpm build`
Expected: PASS
