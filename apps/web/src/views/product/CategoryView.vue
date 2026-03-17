<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { CategoryDTO } from '@enterprise/shared';
import { fetchCategories } from '../../api/product';

const categories = ref<CategoryDTO[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    categories.value = await fetchCategories();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page-view">
    <div class="page-view__header">
      <div>
        <h2>分类管理</h2>
        <p>查看商品分类状态与排序配置。</p>
      </div>
    </div>

    <el-card shadow="never" class="page-block">
      <el-table :data="categories" :loading="loading" stripe>
        <el-table-column prop="name" label="分类名称" min-width="180" />
        <el-table-column label="状态" min-width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'enabled' ? 'success' : 'info'">
              {{ row.status === 'enabled' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" min-width="100" />
      </el-table>
    </el-card>
  </div>
</template>
