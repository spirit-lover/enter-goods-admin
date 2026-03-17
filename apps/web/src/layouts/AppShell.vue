<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuTreeNode } from '@enterprise/shared';

defineOptions({ name: 'AppShell' });

const props = defineProps<{
  menus: MenuTreeNode[];
  username: string;
}>();

defineEmits<{
  logout: [];
}>();

const route = useRoute();
const activePath = computed(() => route.path);

function resolveMenuPath(menu: MenuTreeNode): string {
  if (menu.children?.length) {
    return resolveMenuPath(menu.children[0]);
  }
  return menu.path;
}
</script>

<template>
  <el-container class="app-shell">
    <el-aside class="app-shell__aside" width="240px">
      <div class="app-shell__brand">
        <span class="app-shell__brand-title">企业商品后台</span>
        <span class="app-shell__brand-subtitle">Element Plus 控制台</span>
      </div>
      <el-scrollbar>
        <el-menu
          :default-active="activePath"
          class="app-shell__menu"
          background-color="transparent"
          text-color="#c9d4e4"
          active-text-color="#ffffff"
          router
        >
          <template v-for="group in props.menus" :key="group.id">
            <el-sub-menu v-if="group.children?.length" :index="group.id">
              <template #title>
                <span>{{ group.title }}</span>
              </template>
              <el-menu-item
                v-for="item in group.children"
                :key="item.id"
                :index="resolveMenuPath(item)"
              >
                {{ item.title }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="resolveMenuPath(group)">
              {{ group.title }}
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header class="app-shell__header">
        <div>
          <div class="app-shell__headline">企业级商品后台管理平台</div>
          <div class="app-shell__subline">统一权限、商品、库存与系统管理</div>
        </div>
        <el-dropdown trigger="click">
          <el-button type="primary" plain>
            {{ props.username }}
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$emit('logout')">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main class="app-shell__main">
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>
