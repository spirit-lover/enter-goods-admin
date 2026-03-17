<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { LoginPayload } from '@enterprise/shared';

defineOptions({ name: 'LoginView' });

const emit = defineEmits<{
  submit: [payload: LoginPayload];
}>();

const formRef = ref<FormInstance>();
const loading = ref(false);
const errorMessages = ref<string[]>([]);
const form = reactive<LoginPayload>({ username: '', password: '' });

const rules: FormRules<LoginPayload> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ min: 8, message: '请输入至少 8 位密码', trigger: 'blur' }]
};

async function handleSubmit() {
  const nextErrors: string[] = [];
  if (!form.username.trim()) {
    nextErrors.push('请输入用户名');
  }
  if (form.password.trim().length < 8) {
    nextErrors.push('请输入至少 8 位密码');
  }
  errorMessages.value = nextErrors;
  if (nextErrors.length) {
    await formRef.value?.validate().catch(() => false);
    return;
  }

  loading.value = true;
  try {
    emit('submit', { ...form });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <el-card class="login-panel" shadow="hover">
    <template #header>
      <div class="login-panel__header">
        <div>
          <h1>企业商品后台管理平台</h1>
          <p>登录后进入商品、库存、订单与系统管理后台。</p>
        </div>
        <el-tag type="primary" effect="light">企业版</el-tag>
      </div>
    </template>

    <el-alert
      v-for="item in errorMessages"
      :key="item"
      class="login-panel__alert"
      type="error"
      :closable="false"
      show-icon
    >
      <template #title>{{ item }}</template>
    </el-alert>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="large">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" name="username" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          name="password"
          type="password"
          placeholder="请输入密码"
          show-password
          clearable
        />
      </el-form-item>
      <el-button
        data-testid="submit-login"
        class="login-panel__submit"
        type="primary"
        :loading="loading"
        @click="handleSubmit"
      >
        登录系统
      </el-button>
    </el-form>
  </el-card>
</template>
