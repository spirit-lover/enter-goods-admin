<script setup lang="ts">
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
</script>

<template>
  <AppShell :menus="permissionStore.menus" :username="username" @logout="handleLogout">
    <router-view />
  </AppShell>
</template>
