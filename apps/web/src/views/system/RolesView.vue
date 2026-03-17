<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchRoles } from '../../api/system';

const roles = ref<any[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    roles.value = await fetchRoles();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page-view">
    <div class="page-view__header">
      <div>
        <h2>角色管理</h2>
        <p>查看角色可访问的菜单与权限规模。</p>
      </div>
    </div>

    <el-card shadow="never" class="page-block">
      <el-table :data="roles" :loading="loading" stripe>
        <el-table-column prop="name" label="角色名称" min-width="180" />
        <el-table-column label="权限数量" min-width="120">
          <template #default="{ row }">{{ row.permissionCodes?.length ?? 0 }}</template>
        </el-table-column>
        <el-table-column label="菜单数量" min-width="120">
          <template #default="{ row }">{{ row.menuIds?.length ?? 0 }}</template>
        </el-table-column>
        <el-table-column label="权限摘要" min-width="320">
          <template #default="{ row }">
            <div class="page-actions">
              <el-tag v-for="item in (row.permissionCodes ?? []).slice(0, 4)" :key="item" type="success" effect="light">
                {{ item }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
