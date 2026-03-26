import { App as AntApp, Spin } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  MemoryRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate
} from 'react-router-dom';
import { protectedRoutes, publicRoutes } from './route-config';
import { AppShell } from '../layouts/app-shell';
import { useAuthStore, usePermissionStore } from '../stores/store-provider';

interface RouterProps {
  initialEntries?: string[];
}

function ProtectedLayout() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const restoreProfile = useAuthStore((state) => state.restoreProfile);
  const logout = useAuthStore((state) => state.logout);
  const menus = usePermissionStore((state) => state.menus);
  const permissions = usePermissionStore((state) => state.permissions);
  const loadAccessContext = usePermissionStore((state) => state.loadAccessContext);
  const resetPermission = usePermissionStore((state) => state.reset);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (!accessToken) {
        if (active) {
          setBooting(false);
        }
        return;
      }

      const tasks: Array<Promise<unknown>> = [];
      if (!user) {
        tasks.push(restoreProfile());
      }
      if (!permissions.length || !menus.length) {
        tasks.push(loadAccessContext());
      }

      if (tasks.length) {
        await Promise.all(tasks);
      }

      if (active) {
        setBooting(false);
      }
    }

    setBooting(true);
    bootstrap().catch(() => {
      if (active) {
        setBooting(false);
      }
    });

    return () => {
      active = false;
    };
  }, [accessToken, loadAccessContext, menus.length, permissions.length, restoreProfile, user]);

  if (!accessToken) {
    return <Navigate replace to="/login" />;
  }

  if (booting) {
    return (
      <div className="app-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AntApp>
      <AppShell
        menus={menus}
        username={user?.displayName ?? '未登录'}
        onLogout={async () => {
          await logout();
          resetPermission();
          navigate('/login');
        }}
      >
        <Outlet />
      </AppShell>
    </AntApp>
  );
}

function PermissionOutlet({ permission }: { permission?: string }) {
  const can = usePermissionStore((state) => state.can);
  if (!can(permission as never)) {
    return <Navigate replace to="/dashboard" />;
  }
  return <Outlet />;
}

function RouterContent() {
  const routeElements = useMemo(
    () =>
      protectedRoutes.map((route) => (
        <Route element={<PermissionOutlet permission={route.permission} />} key={route.path}>
          <Route path={route.path} element={route.element} />
        </Route>
      )),
    []
  );

  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Navigate replace to="/dashboard" />} />
        {routeElements}
      </Route>
      <Route path="*" element={<Navigate replace to="/dashboard" />} />
    </Routes>
  );
}

export function AppRouter({ initialEntries }: RouterProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false
          }
        }
      })
  );

  const content = initialEntries ? (
    <MemoryRouter initialEntries={initialEntries}>
      <RouterContent />
    </MemoryRouter>
  ) : (
    <BrowserRouter>
      <RouterContent />
    </BrowserRouter>
  );

  return <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>;
}
