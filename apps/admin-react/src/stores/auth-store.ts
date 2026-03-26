import type { LoginPayload, UserProfile } from '@enterprise/shared';
import { createStore } from 'zustand/vanilla';
import * as authApi from '../api/auth';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../api/http';

export interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: UserProfile | null;
  login: (payload: LoginPayload) => Promise<void>;
  restoreProfile: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  setSession: (accessToken: string, refreshToken: string, user: UserProfile) => void;
  clearSession: () => void;
}

function getStoredToken(key: string) {
  return window.localStorage.getItem(key) ?? '';
}

export type AuthStore = ReturnType<typeof createAuthStore>;

export function createAuthStore() {
  return createStore<AuthState>()((set, get) => ({
    accessToken: getStoredToken(ACCESS_TOKEN_KEY),
    refreshToken: getStoredToken(REFRESH_TOKEN_KEY),
    user: null,
    async login(payload) {
      const result = await authApi.login(payload);
      get().setSession(result.accessToken, result.refreshToken, result.user);
    },
    async restoreProfile() {
      if (!get().accessToken) {
        return null;
      }
      const user = await authApi.fetchProfile();
      set({ user });
      return user;
    },
    async logout() {
      const refreshToken = get().refreshToken;
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
      get().clearSession();
    },
    setSession(accessToken, refreshToken, user) {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      set({ accessToken, refreshToken, user });
    },
    clearSession() {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
      set({ accessToken: '', refreshToken: '', user: null });
    }
  }));
}
