<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchUsers } from '../../api/system';

const users = ref<any[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    users.value = await fetchUsers();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page-view">
    <div class="page-view__header">
      <div>
        <h2>用户管理</h2>
        <p>查看当前可登录后台的用户、部门和角色归属。</p>
      </div>
    </div>

    <el-card shadow="never" class="page-block">
      <el-table :data="users" :loading="loading" stripe>
        <el-table-column prop="username" label="用户名" min-width="140" />
        <el-table-column prop="displayName" label="姓名" min-width="140" />
        <el-table-column prop="department" label="部门" min-width="160" />
        <el-table-column label="角色" min-width="220">
          <template #default="{ row }">
            <div class="page-actions">
              <el-tag v-for="role in row.roles ?? []" :key="role" type="primary" effect="light">{{ role }}</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
