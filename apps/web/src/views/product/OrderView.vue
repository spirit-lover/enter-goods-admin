<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { OrderDTO } from '@enterprise/shared';
import { fetchOrders } from '../../api/product';

const orders = ref<OrderDTO[]>([]);
const loading = ref(false);

function resolveStatus(status: OrderDTO['status']) {
  if (status === 'paid') {
    return { label: '已支付', type: 'success' as const };
  }
  if (status === 'pending') {
    return { label: '待处理', type: 'warning' as const };
  }
  return { label: status, type: 'info' as const };
}

onMounted(async () => {
  loading.value = true;
  try {
    orders.value = await fetchOrders();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page-view">
    <div class="page-view__header">
      <div>
        <h2>订单管理</h2>
        <p>查看订单状态、客户与成交金额。</p>
      </div>
    </div>

    <el-card shadow="never" class="page-block">
      <el-table :data="orders" :loading="loading" stripe>
        <el-table-column prop="orderNo" label="订单号" min-width="180" />
        <el-table-column prop="customerName" label="客户" min-width="160" />
        <el-table-column label="金额" min-width="120">
          <template #default="{ row }">¥ {{ row.amount }}</template>
        </el-table-column>
        <el-table-column label="状态" min-width="120">
          <template #default="{ row }">
            <el-tag :type="resolveStatus(row.status).type">{{ resolveStatus(row.status).label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间" min-width="180" />
      </el-table>
    </el-card>
  </div>
</template>
