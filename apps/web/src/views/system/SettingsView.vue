<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchSettings } from '../../api/system';

const settings = ref<Record<string, string | number>>({});
const loading = ref(false);

const entries = computed(() => Object.entries(settings.value));

onMounted(async () => {
  loading.value = true;
  try {
    settings.value = await fetchSettings();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page-view">
    <div class="page-view__header">
      <div>
        <h2>系统设置</h2>
        <p>查看当前后台运行时的关键配置项。</p>
      </div>
    </div>

    <el-card shadow="never" class="page-block">
      <el-skeleton :loading="loading" animated>
        <template #template>
          <el-skeleton-item variant="p" style="width: 100%; height: 160px" />
        </template>
        <el-descriptions v-if="entries.length" :column="1" border>
          <el-descriptions-item v-for="[key, value] in entries" :key="key" :label="key">
            {{ value }}
          </el-descriptions-item>
        </el-descriptions>
        <el-empty v-else description="暂无设置项" />
      </el-skeleton>
    </el-card>
  </div>
</template>
