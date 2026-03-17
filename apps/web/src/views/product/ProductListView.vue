<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { PERMISSION_CODES, type CategoryDTO, type ProductDTO, type ProductFilter, type ProductUpsertPayload } from '@enterprise/shared';
import { createProduct, deleteProduct, fetchCategories, fetchProducts, publishProduct, updateProduct } from '../../api/product';
import ProductForm from './ProductForm.vue';

const filter = reactive<ProductFilter>({ keyword: '', categoryId: '', status: undefined, page: 1, pageSize: 10 });
const products = ref<ProductDTO[]>([]);
const categories = ref<CategoryDTO[]>([]);
const total = ref(0);
const loading = ref(false);
const dialogVisible = ref(false);
const editingProduct = ref<ProductDTO | null>(null);

function resetEditor() {
  dialogVisible.value = false;
  editingProduct.value = null;
}

function statusMeta(status: ProductDTO['status']) {
  if (status === 'active') {
    return { label: '上架', type: 'success' as const };
  }
  if (status === 'inactive') {
    return { label: '下架', type: 'warning' as const };
  }
  return { label: '草稿', type: 'info' as const };
}

async function loadData() {
  loading.value = true;
  try {
    const [productResult, categoryResult] = await Promise.all([
      fetchProducts(filter),
      fetchCategories()
    ]);
    products.value = productResult.items;
    total.value = productResult.total;
    categories.value = categoryResult;
  } finally {
    loading.value = false;
  }
}

async function handleSubmit(payload: ProductUpsertPayload) {
  if (editingProduct.value) {
    await updateProduct(editingProduct.value.id, payload);
    ElMessage.success('商品已更新');
  } else {
    await createProduct(payload);
    ElMessage.success('商品已创建');
  }
  resetEditor();
  await loadData();
}

function handleCreate() {
  editingProduct.value = null;
  dialogVisible.value = true;
}

function handleEdit(product: ProductDTO) {
  editingProduct.value = product;
  dialogVisible.value = true;
}

async function handlePublish(product: ProductDTO) {
  const nextStatus = product.status === 'active' ? 'inactive' : 'active';
  await publishProduct(product.id, nextStatus);
  ElMessage.success(nextStatus === 'active' ? '商品已上架' : '商品已下架');
  await loadData();
}

async function handleRemove(product: ProductDTO) {
  await ElMessageBox.confirm(`确认删除商品“${product.name}”吗？`, '删除确认', {
    type: 'warning'
  });
  await deleteProduct(product.id);
  ElMessage.success('商品已删除');
  await loadData();
}

function handleQuery() {
  filter.page = 1;
  loadData();
}

function handleReset() {
  filter.keyword = '';
  filter.categoryId = '';
  filter.status = undefined;
  filter.page = 1;
  loadData();
}

onMounted(loadData);
</script>

<template>
  <div class="page-view">
    <div class="page-view__header">
      <div>
        <h2>商品管理</h2>
        <p>统一维护商品信息、分类归属、库存和上下架状态。</p>
      </div>
      <div class="page-actions">
        <el-button v-permission="PERMISSION_CODES.productWrite" type="primary" @click="handleCreate">
          新增商品
        </el-button>
      </div>
    </div>

    <el-card shadow="never" class="page-block">
      <el-form inline label-position="top" class="table-toolbar">
        <el-form-item label="关键字">
          <el-input v-model="filter.keyword" placeholder="搜索商品名或 SKU" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="filter.categoryId" placeholder="全部分类" clearable style="width: 180px">
            <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select v-model="filter.status" placeholder="全部状态" clearable style="width: 180px">
            <el-option label="草稿" value="draft" />
            <el-option label="上架" value="active" />
            <el-option label="下架" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item class="table-toolbar__actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="products" :loading="loading" stripe>
        <el-table-column prop="name" label="商品名称" min-width="220" />
        <el-table-column prop="sku" label="SKU" min-width="140" />
        <el-table-column prop="categoryName" label="分类" min-width="120" />
        <el-table-column label="售价" min-width="100">
          <template #default="{ row }">¥ {{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" min-width="90" />
        <el-table-column prop="sales" label="销量" min-width="90" />
        <el-table-column label="状态" min-width="110">
          <template #default="{ row }">
            <el-tag :type="statusMeta(row.status).type">{{ statusMeta(row.status).label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" min-width="180" />
        <el-table-column label="操作" fixed="right" min-width="220">
          <template #default="{ row }">
            <div class="page-actions">
              <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button
                v-permission="PERMISSION_CODES.productPublish"
                link
                type="warning"
                @click="handlePublish(row)"
              >
                {{ row.status === 'active' ? '下架' : '上架' }}
              </el-button>
              <el-button
                v-permission="PERMISSION_CODES.productWrite"
                link
                type="danger"
                @click="handleRemove(row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-actions page-actions--end page-block__footer">
        <el-pagination
          v-model:current-page="filter.page"
          v-model:page-size="filter.pageSize"
          background
          layout="total, prev, pager, next"
          :total="total"
          @current-change="loadData"
        />
      </div>
    </el-card>

    <ProductForm
      v-model="dialogVisible"
      :initial-value="editingProduct"
      :categories="categories"
      @submit="handleSubmit"
    />
  </div>
</template>
