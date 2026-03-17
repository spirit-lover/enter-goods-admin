<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { MenuTreeNode } from '@enterprise/shared';
import { fetchMenus } from '../../api/system';

const menus = ref<MenuTreeNode[]>([]);
const loading = ref(false);

function renderLabel(data: MenuTreeNode) {
  return `${data.title} · ${data.path}`;
}

onMounted(async () => {
  loading.value = true;
  try {
    menus.value = await fetchMenus();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page-view">
    <div class="page-view__header">
      <div>
        <h2>菜单管理</h2>
        <p>查看系统菜单树、路由路径和权限挂载关系。</p>
      </div>
    </div>

    <el-card shadow="never" class="page-block">
      <el-skeleton :loading="loading" animated>
        <template #template>
          <el-skeleton-item variant="p" style="width: 100%; height: 180px" />
        </template>
        <el-empty v-if="!menus.length" description="暂无菜单数据" />
        <el-tree
          v-else
          :data="menus"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <template #default="{ data }">
            <div class="tree-node">
              <span class="tree-node__title">{{ renderLabel(data) }}</span>
              <el-tag size="small" effect="plain">{{ data.type }}</el-tag>
            </div>
          </template>
        </el-tree>
      </el-skeleton>
    </el-card>
  </div>
</template>
