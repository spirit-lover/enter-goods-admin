# Admin React UI/UX Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade `apps/admin-react` from a default Ant Design admin UI into a cohesive business-grade console with stronger brand, hierarchy, and dashboard/list-page polish, without changing business behavior.

**Architecture:** Keep all existing route, data, and permission logic intact. Concentrate UI work in the shared shell, login page, dashboard layout, and global stylesheet/token layer, then apply the same visual language to list and system pages using existing Ant Design building blocks.

**Tech Stack:** React 19, TypeScript, Vite, Ant Design 6, React Router, Zustand, TanStack Query, Vitest, Testing Library, CSS

---

### Task 1: Establish Global Design Tokens And Surface System

**Files:**
- Modify: `apps/admin-react/src/style.css`
- Test: `apps/admin-react/src/tests/app-shell.spec.tsx`

**Step 1: Write the failing test**

Update the shell test assertions so it checks for the new premium shell markers that must remain visible after the redesign:

```tsx
expect(screen.getByText('企业商品后台')).toBeInTheDocument();
expect(screen.getByText('商品中台控制台')).toBeInTheDocument();
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @enterprise/admin-react test -- src/tests/app-shell.spec.tsx`

Expected: FAIL because the new shell copy does not exist yet.

**Step 3: Write minimal implementation**

Refactor `apps/admin-react/src/style.css` to define:

- root color tokens
- shell background layers
- panel surface classes
- page header rhythm
- premium card and toolbar styles
- responsive layout adjustments

Keep all changes additive and scoped to `admin-react`.

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @enterprise/admin-react test -- src/tests/app-shell.spec.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add apps/admin-react/src/style.css apps/admin-react/src/tests/app-shell.spec.tsx
git commit -m "feat: add admin react design token system"
```

### Task 2: Redesign The Shared App Shell

**Files:**
- Modify: `apps/admin-react/src/layouts/app-shell.tsx`
- Modify: `apps/admin-react/src/tests/app-shell.spec.tsx`

**Step 1: Write the failing test**

Extend the existing shell test to assert:

- branded top heading
- shell subtitle
- user area still renders username
- menu label rendering still works

```tsx
expect(screen.getByText('企业商品运营中台')).toBeInTheDocument();
expect(screen.getByText('商品中台控制台')).toBeInTheDocument();
expect(screen.getByText('系统管理员')).toBeInTheDocument();
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @enterprise/admin-react test -- src/tests/app-shell.spec.tsx`

Expected: FAIL because the new shell structure is not implemented.

**Step 3: Write minimal implementation**

Update `apps/admin-react/src/layouts/app-shell.tsx` to:

- add a more distinctive brand block in the sider
- add a lighter but more structured top bar
- wrap breadcrumb and content inside a dedicated content frame
- keep routing, logout, and menu behavior unchanged

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @enterprise/admin-react test -- src/tests/app-shell.spec.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add apps/admin-react/src/layouts/app-shell.tsx apps/admin-react/src/tests/app-shell.spec.tsx
git commit -m "feat: redesign admin react shell"
```

### Task 3: Upgrade The Login Page Into A Brand Entry Experience

**Files:**
- Modify: `apps/admin-react/src/views/login/login-page.tsx`
- Modify: `apps/admin-react/src/style.css`

**Step 1: Write the failing test**

Add or update the login-page test coverage to require:

- hero headline
- capability chips or cards
- default account hint

Example:

```tsx
expect(screen.getByText('企业商品运营控制台')).toBeInTheDocument();
expect(screen.getByText('权限治理')).toBeInTheDocument();
expect(screen.getByText(/admin \/ Admin123!/)).toBeInTheDocument();
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @enterprise/admin-react test -- src/tests/auth-store.spec.ts src/tests/login-page.spec.tsx`

Expected: FAIL because the richer login composition does not exist yet.

**Step 3: Write minimal implementation**

Refactor `apps/admin-react/src/views/login/login-page.tsx` to:

- create a left-side brand narrative area
- add 3 concise capability highlights
- keep the form compact and enterprise-focused
- preserve submit behavior and store integration

Apply matching styles in `apps/admin-react/src/style.css`.

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @enterprise/admin-react test -- src/tests/auth-store.spec.ts src/tests/login-page.spec.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add apps/admin-react/src/views/login/login-page.tsx apps/admin-react/src/style.css apps/admin-react/src/tests/login-page.spec.tsx
git commit -m "feat: redesign admin react login page"
```

### Task 4: Turn Dashboard Into A Business Operations Cockpit

**Files:**
- Modify: `apps/admin-react/src/views/dashboard/dashboard-page.tsx`
- Modify: `apps/admin-react/src/style.css`

**Step 1: Write the failing test**

Add a dashboard test that asserts:

- the primary heading still renders
- metrics remain visible
- recent activity panel is still present

```tsx
expect(screen.getByText('运营概览')).toBeInTheDocument();
expect(screen.getByText('商品总数')).toBeInTheDocument();
expect(screen.getByText('最近操作')).toBeInTheDocument();
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @enterprise/admin-react test -- src/tests/dashboard-page.spec.tsx`

Expected: FAIL because no dashboard-focused design test exists yet.

**Step 3: Write minimal implementation**

Refactor `apps/admin-react/src/views/dashboard/dashboard-page.tsx` to:

- give the metrics stronger grouping
- create a clearer top summary zone
- improve secondary module rhythm for logs and status panels
- preserve existing data fetching and values

Add only the styles needed in `apps/admin-react/src/style.css`.

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @enterprise/admin-react test -- src/tests/dashboard-page.spec.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add apps/admin-react/src/views/dashboard/dashboard-page.tsx apps/admin-react/src/style.css apps/admin-react/src/tests/dashboard-page.spec.tsx
git commit -m "feat: redesign admin react dashboard"
```

### Task 5: Unify Page Headers, Toolbars, And Table Surfaces

**Files:**
- Modify: `apps/admin-react/src/components/page-header.tsx`
- Modify: `apps/admin-react/src/views/products/products-page.tsx`
- Modify: `apps/admin-react/src/views/products/categories-page.tsx`
- Modify: `apps/admin-react/src/views/products/inventory-page.tsx`
- Modify: `apps/admin-react/src/views/products/orders-page.tsx`
- Modify: `apps/admin-react/src/views/system/users-page.tsx`
- Modify: `apps/admin-react/src/views/system/roles-page.tsx`
- Modify: `apps/admin-react/src/views/system/menus-page.tsx`
- Modify: `apps/admin-react/src/views/system/logs-page.tsx`
- Modify: `apps/admin-react/src/views/system/settings-page.tsx`
- Modify: `apps/admin-react/src/style.css`
- Test: `apps/admin-react/src/tests/products-page.spec.tsx`

**Step 1: Write the failing test**

Enhance `apps/admin-react/src/tests/products-page.spec.tsx` to confirm the page still exposes:

- page title
- query controls
- core table interactions

The test should remain focused on behavior while expecting the redesigned shell and page header text to remain present.

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @enterprise/admin-react test -- src/tests/products-page.spec.tsx`

Expected: FAIL after you tighten assertions around the redesigned page header and surface structure.

**Step 3: Write minimal implementation**

Apply a consistent page composition:

- stronger page header hierarchy
- toolbar-like filter panel
- premium table wrapper
- cleaner action spacing
- consistent treatment of secondary system pages

Do not change API calls, mutations, or permission logic.

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @enterprise/admin-react test -- src/tests/products-page.spec.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add apps/admin-react/src/components/page-header.tsx apps/admin-react/src/views/products apps/admin-react/src/views/system apps/admin-react/src/style.css apps/admin-react/src/tests/products-page.spec.tsx
git commit -m "feat: unify admin react page surfaces"
```

### Task 6: Final Polish, Regression Verification, And Cleanup

**Files:**
- Modify: `apps/admin-react/src/style.css`
- Review: `apps/admin-react/src/**/*`

**Step 1: Write the failing test**

No new feature test here. Instead, identify any unstable UI assertions and add only the smallest regression coverage needed.

**Step 2: Run focused validation to find gaps**

Run:

```bash
pnpm --filter @enterprise/admin-react test
pnpm --filter @enterprise/admin-react typecheck
pnpm --filter @enterprise/admin-react build
```

Expected: Any failures point to regressions introduced by the redesign.

**Step 3: Write minimal implementation**

Use this pass to:

- remove visual inconsistencies
- fix responsive issues
- trim redundant CSS
- ensure login, shell, dashboard, and list pages feel consistent

Do not expand scope into new business features.

**Step 4: Run full verification**

Run:

```bash
pnpm --filter @enterprise/admin-react test
pnpm --filter @enterprise/admin-react typecheck
pnpm --filter @enterprise/admin-react build
pnpm typecheck
pnpm build
```

Expected: All commands PASS. If `pnpm test` fails at root because of unrelated backend environment issues, document the exact failure and keep `admin-react` verification green.

**Step 5: Commit**

```bash
git add apps/admin-react docs/plans
git commit -m "feat: polish admin react business ui"
```
