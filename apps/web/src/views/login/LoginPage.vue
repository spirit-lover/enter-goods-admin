<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import LoginView from './LoginView.vue';
import { useAuthStore } from '../../stores/auth';
import { usePermissionStore } from '../../stores/permission';

const authStore = useAuthStore();
const permissionStore = usePermissionStore();
const router = useRouter();

async function handleLogin(payload: { username: string; password: string }) {
  try {
    await authStore.login(payload);
    await permissionStore.loadAccessContext();
    ElMessage.success('登录成功');
    router.push('/dashboard');
  } catch (error) {
    ElMessage.error('登录失败，请检查用户名和密码');
    console.error(error);
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__hero">
      <div class="login-page__copy">
        <el-tag type="primary" effect="dark">Enterprise Console</el-tag>
        <h2>面向企业商品运营的统一后台</h2>
        <p>基于权限控制、商品管理、库存流水和系统日志构建的一体化控制台。</p>
        <div class="login-page__feature-list">
          <el-tag>RBAC 权限控制</el-tag>
          <el-tag type="success">商品全生命周期</el-tag>
          <el-tag type="warning">审计留痕</el-tag>
        </div>
      </div>
      <LoginView @submit="handleLogin" />
    </div>
  </div>
</template>
