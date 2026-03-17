import { defineStore } from 'pinia';
import * as authApi from '../api/auth';
const ACCESS_TOKEN_KEY = 'enterprise_access_token';
const REFRESH_TOKEN_KEY = 'enterprise_refresh_token';
export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? '',
        refreshToken: window.localStorage.getItem(REFRESH_TOKEN_KEY) ?? '',
        user: null
    }),
    getters: {
        isAuthenticated: (state) => Boolean(state.accessToken)
    },
    actions: {
        async login(payload) {
            const result = await authApi.login(payload);
            this.setSession(result.accessToken, result.refreshToken, result.user);
            return result;
        },
        async restoreProfile() {
            if (!this.accessToken) {
                return null;
            }
            this.user = await authApi.fetchProfile();
            return this.user;
        },
        async logout() {
            if (this.refreshToken) {
                await authApi.logout(this.refreshToken);
            }
            this.clearSession();
        },
        setSession(accessToken, refreshToken, user) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.user = user;
            window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        },
        clearSession() {
            this.accessToken = '';
            this.refreshToken = '';
            this.user = null;
            window.localStorage.removeItem(ACCESS_TOKEN_KEY);
            window.localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
    }
});
