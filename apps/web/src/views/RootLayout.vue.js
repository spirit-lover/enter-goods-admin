import { computed } from 'vue';
import { useRouter } from 'vue-router';
import AppShell from '../layouts/AppShell.vue';
import { useAuthStore } from '../stores/auth';
import { usePermissionStore } from '../stores/permission';
const authStore = useAuthStore();
const permissionStore = usePermissionStore();
const router = useRouter();
const username = computed(() => authStore.user?.displayName ?? '未登录');
async function handleLogout() {
    await authStore.logout();
    permissionStore.reset();
    router.push('/login');
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof AppShell, typeof AppShell, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AppShell, new AppShell({
    ...{ 'onLogout': {} },
    menus: (__VLS_ctx.permissionStore.menus),
    username: (__VLS_ctx.username),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onLogout': {} },
    menus: (__VLS_ctx.permissionStore.menus),
    username: (__VLS_ctx.username),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onLogout: (__VLS_ctx.handleLogout)
};
var __VLS_7 = {};
__VLS_2.slots.default;
const __VLS_8 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_2;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AppShell: AppShell,
            permissionStore: permissionStore,
            username: username,
            handleLogout: handleLogout,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
