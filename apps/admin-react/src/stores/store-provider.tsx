import type { ReactNode } from 'react';
import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import type { AuthState, AuthStore } from './auth-store';
import { createAuthStore } from './auth-store';
import type { PermissionState, PermissionStore } from './permission-store';
import { createPermissionStore } from './permission-store';

const authStoreContext = createContext<AuthStore | null>(null);
const permissionStoreContext = createContext<PermissionStore | null>(null);

export interface StoreProvidersProps {
  children: ReactNode;
  authStore?: AuthStore;
  permissionStore?: PermissionStore;
}

export function StoreProviders({ children, authStore, permissionStore }: StoreProvidersProps) {
  const authStoreRef = useRef<AuthStore>(authStore ?? createAuthStore());
  const permissionStoreRef = useRef<PermissionStore>(permissionStore ?? createPermissionStore());

  return (
    <authStoreContext.Provider value={authStoreRef.current}>
      <permissionStoreContext.Provider value={permissionStoreRef.current}>
        {children}
      </permissionStoreContext.Provider>
    </authStoreContext.Provider>
  );
}

export function useAuthStore<T>(selector: (state: AuthState) => T) {
  const store = useContext(authStoreContext);
  if (!store) {
    throw new Error('Auth store is not available');
  }
  return useStore(store, selector);
}

export function usePermissionStore<T>(selector: (state: PermissionState) => T) {
  const store = useContext(permissionStoreContext);
  if (!store) {
    throw new Error('Permission store is not available');
  }
  return useStore(store, selector);
}
