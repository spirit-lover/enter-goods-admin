<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchDashboardSummary } from '../../api/system';

const summary = ref({
  productCount: 0,
  activeProductCount: 0,
  orderCount: 0,
  paidOrderAmount: 0,
  inventoryAlertCount: 0,
  latestLogs: [] as Array<{ id: string; action: string; detail: string; operatorName: string; createdAt: string }>
});

onMounted(async () => {
  summary.value = await fetchDashboardSummary();
});
</script>

<template>
  <div class="page-view">
    <div class="page-view__header">
      <div>
        <h2>运营概览</h2>
        <p>关注商品、订单和库存的核心运行指标。</p>
      </div>
    </div>

    <el-row :gutter="16" class="dashboard-grid">
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="metric-card">
          <el-statistic title="商品总数" :value="summary.productCount" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="metric-card">
          <el-statistic title="上架商品" :value="summary.activeProductCount" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="metric-card">
          <el-statistic title="订单总数" :value="summary.orderCount" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="metric-card">
          <el-statistic title="已支付金额" :value="summary.paidOrderAmount" prefix="¥" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="metric-card metric-card--warn">
          <el-statistic title="库存预警" :value="summary.inventoryAlertCount" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="page-block">
      <template #header>
        <div class="page-block__title">最近操作</div>
      </template>
      <el-empty v-if="!summary.latestLogs.length" description="暂无日志" />
      <el-timeline v-else>
        <el-timeline-item
          v-for="log in summary.latestLogs"
          :key="log.id"
          :timestamp="log.createdAt"
          placement="top"
        >
          <div class="timeline-entry__title">{{ log.operatorName }} · {{ log.action }}</div>
          <div class="timeline-entry__detail">{{ log.detail }}</div>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>
