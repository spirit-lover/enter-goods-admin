<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { CategoryDTO, ProductDTO, ProductUpsertPayload } from '@enterprise/shared';

defineOptions({ name: 'ProductForm' });

const props = defineProps<{
  modelValue: boolean;
  initialValue: ProductDTO | null;
  categories: CategoryDTO[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [payload: ProductUpsertPayload];
}>();

const formRef = ref<FormInstance>();
const form = reactive<ProductUpsertPayload>({
  name: '',
  sku: '',
  categoryId: '',
  price: 0,
  costPrice: 0,
  stock: 0,
  status: 'draft',
  cover: 'https://images.example.com/default.png',
  description: ''
});

const rules: FormRules<ProductUpsertPayload> = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  sku: [{ required: true, message: '请输入 SKU', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
  costPrice: [{ required: true, message: '请输入成本价', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }]
};

function resetForm(value: ProductDTO | null) {
  Object.assign(form, value ?? {
    name: '',
    sku: '',
    categoryId: props.categories[0]?.id ?? '',
    price: 0,
    costPrice: 0,
    stock: 0,
    status: 'draft',
    cover: 'https://images.example.com/default.png',
    description: ''
  });
}

watch(() => props.initialValue, (value) => resetForm(value), { immediate: true });
watch(() => props.categories, () => {
  if (!form.categoryId && props.categories.length) {
    form.categoryId = props.categories[0].id;
  }
}, { immediate: true });

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) {
    return;
  }

  emit('submit', {
    ...form,
    price: Number(form.price),
    costPrice: Number(form.costPrice),
    stock: Number(form.stock)
  });
}

function handleClose() {
  visible.value = false;
}

defineExpose({
  form,
  submit
});
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="initialValue ? '编辑商品' : '新增商品'"
    width="720px"
    :teleported="false"
    @closed="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="form.name" name="name" placeholder="请输入商品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="SKU" prop="sku">
            <el-input v-model="form.sku" name="sku" placeholder="请输入 SKU" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品分类" prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
              <el-option label="草稿" value="draft" />
              <el-option label="上架" value="active" />
              <el-option label="下架" value="inactive" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="售价" prop="price">
            <el-input v-model="form.price" name="price" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="成本价" prop="costPrice">
            <el-input v-model="form.costPrice" name="costPrice" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="库存" prop="stock">
            <el-input v-model="form.stock" name="stock" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="封面地址" prop="cover">
            <el-input v-model="form.cover" name="cover" placeholder="请输入封面图地址" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商品描述" prop="description">
            <el-input
              v-model="form.description"
              name="description"
              type="textarea"
              :rows="4"
              placeholder="请输入商品描述"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="page-actions page-actions--end">
        <el-button @click="visible = false">取消</el-button>
        <el-button data-testid="submit-product" type="primary" @click="submit">保存商品</el-button>
      </div>
    </template>
  </el-dialog>
</template>
