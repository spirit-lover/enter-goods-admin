<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchLogs } from '../../api/system';

const logs = ref<any[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    logs.value = await fetchLogs();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page-view">
    <div class="page-view__header">
      <div>
        <h2>操作日志</h2>
        <p>追踪系统内的关键操作行为与审计记录。</p>
      </div>
    </div>

    <el-card shadow="never" class="page-block">
      <el-table :data="logs" :loading="loading" stripe>
        <el-table-column prop="module" label="模块" min-width="120" />
        <el-table-column prop="action" label="动作" min-width="120" />
        <el-table-column prop="detail" label="内容" min-width="320" show-overflow-tooltip />
        <el-table-column prop="operatorName" label="操作人" min-width="140" />
        <el-table-column prop="createdAt" label="时间" min-width="180" />
      </el-table>
    </el-card>
  </div>
</template>
