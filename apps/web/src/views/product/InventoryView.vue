<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { InventoryRecordDTO } from '@enterprise/shared';
import { fetchInventoryRecords } from '../../api/product';

const records = ref<InventoryRecordDTO[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    records.value = await fetchInventoryRecords();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page-view">
    <div class="page-view__header">
      <div>
        <h2>库存管理</h2>
        <p>查看商品库存变更明细和操作记录。</p>
      </div>
    </div>

    <el-card shadow="never" class="page-block">
      <el-table :data="records" :loading="loading" stripe>
        <el-table-column prop="productName" label="商品" min-width="220" />
        <el-table-column label="变更数量" min-width="120">
          <template #default="{ row }">
            <el-tag :type="row.change > 0 ? 'success' : 'danger'">
              {{ row.change > 0 ? '+' : '' }}{{ row.change }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" min-width="160" />
        <el-table-column prop="operatorName" label="操作人" min-width="140" />
        <el-table-column prop="createdAt" label="时间" min-width="180" />
      </el-table>
    </el-card>
  </div>
</template>
