import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  App,
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag
} from 'antd';
import type { ProductDTO, ProductFilter, ProductUpsertPayload } from '@enterprise/shared';
import { PERMISSION_CODES } from '@enterprise/shared';
import { useState } from 'react';
import {
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  publishProduct,
  updateProduct
} from '../../api/product';
import { DataPanel } from '../../components/data-panel';
import { OverviewStrip } from '../../components/overview-strip';
import { PageHeader } from '../../components/page-header';
import { Permission } from '../../components/permission';
import { ProductDrawer } from './product-drawer';

const initialFilter: ProductFilter = {
  keyword: '',
  categoryId: '',
  status: undefined,
  page: 1,
  pageSize: 10
};

function resolveStatusMeta(status: ProductDTO['status']) {
  if (status === 'active') {
    return { label: '上架', color: 'success' as const };
  }
  if (status === 'inactive') {
    return { label: '下架', color: 'warning' as const };
  }
  return { label: '草稿', color: 'default' as const };
}

export function ProductsPage() {
  const [form] = Form.useForm<ProductFilter>();
  const [filter, setFilter] = useState<ProductFilter>(initialFilter);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const productsQuery = useQuery({
    queryKey: ['products', filter],
    queryFn: () => fetchProducts(filter)
  });

  const refreshProducts = async () => {
    await queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: ProductUpsertPayload) => {
      if (editingProduct) {
        return updateProduct(editingProduct.id, payload);
      }
      return createProduct(payload);
    },
    onSuccess: async () => {
      message.success(editingProduct ? '商品已更新' : '商品已创建');
      setDrawerOpen(false);
      setEditingProduct(null);
      await refreshProducts();
    }
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' }) =>
      publishProduct(id, status),
    onSuccess: async (_, variables) => {
      message.success(variables.status === 'active' ? '商品已上架' : '商品已下架');
      await refreshProducts();
    }
  });

  const removeMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      message.success('商品已删除');
      await refreshProducts();
    }
  });

  const productItems = productsQuery.data?.items ?? [];
  const activeCount = productItems.filter((item) => item.status === 'active').length;
  const draftCount = productItems.filter((item) => item.status === 'draft').length;
  const lowStockCount = productItems.filter((item) => item.stock <= 20).length;

  return (
    <Space orientation="vertical" size={20} className="page-stack">
      <PageHeader
        eyebrow="Merchandise Operations"
        title="商品管理"
        description="统一维护商品信息、分类归属、库存和上下架状态。"
        extra={
          <Permission permission={PERMISSION_CODES.productWrite}>
            <Button
              type="primary"
              onClick={() => {
                setEditingProduct(null);
                setDrawerOpen(true);
              }}
            >
              新增商品
            </Button>
          </Permission>
        }
      />
      <OverviewStrip
        testId="products-overview"
        items={[
          {
            label: '在架商品',
            value: activeCount,
            hint: '聚焦当前可售货品规模',
            tone: 'navy'
          },
          {
            label: '草稿待完善',
            value: draftCount,
            hint: '待补齐信息或待审核发布',
            tone: 'gold'
          },
          {
            label: '低库存提醒',
            value: lowStockCount,
            hint: '库存低于 20 的商品条目',
            tone: 'emerald'
          },
          {
            label: '本页记录',
            value: productsQuery.data?.total ?? 0,
            hint: '当前筛选条件下的总记录数',
            tone: 'navy'
          }
        ]}
      />
      <Card className="surface-card toolbar-card" data-testid="products-toolbar">
        <div className="toolbar-card__header">
          <div>
            <span className="toolbar-card__eyebrow">Query Console</span>
            <h3>筛选经营中的商品池</h3>
            <p>按关键字、分类和状态快速定位商品，并把操作集中在同一工作台完成。</p>
          </div>
        </div>
        <Form
          form={form}
          layout="inline"
          className="toolbar-form"
          onFinish={(values) =>
            setFilter((current) => ({
              ...current,
              keyword: values.keyword ?? '',
              categoryId: values.categoryId ?? '',
              status: values.status,
              page: 1
            }))
          }
        >
          <Form.Item label="关键字" name="keyword">
            <Input placeholder="搜索商品名或 SKU" allowClear />
          </Form.Item>
          <Form.Item label="商品分类" name="categoryId">
            <Select
              allowClear
              style={{ width: 180 }}
              options={(categoriesQuery.data ?? []).map((item) => ({
                label: item.name,
                value: item.id
              }))}
            />
          </Form.Item>
          <Form.Item label="商品状态" name="status">
            <Select
              allowClear
              style={{ width: 180 }}
              options={[
                { label: '草稿', value: 'draft' },
                { label: '上架', value: 'active' },
                { label: '下架', value: 'inactive' }
              ]}
            />
          </Form.Item>
          <Space className="toolbar-form__actions">
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setFilter(initialFilter);
              }}
            >
              重置
            </Button>
          </Space>
        </Form>
      </Card>
      <DataPanel
        testId="products-table-panel"
        eyebrow="Operations Board"
        title="商品经营台账"
        description="同步查看商品名称、库存、销量、上下架状态与最近更新时间，适合连续做发布和清理动作。"
        extra={<Tag color="blue">{`共 ${productsQuery.data?.total ?? 0} 条记录`}</Tag>}
      >
        <Table<ProductDTO>
          rowKey="id"
          loading={productsQuery.isLoading}
          dataSource={productItems}
          pagination={{
            current: filter.page,
            pageSize: filter.pageSize,
            total: productsQuery.data?.total ?? 0,
            onChange: (page, pageSize) =>
              setFilter((current) => ({ ...current, page, pageSize }))
          }}
          columns={[
            { title: '商品名称', dataIndex: 'name', key: 'name' },
            { title: 'SKU', dataIndex: 'sku', key: 'sku' },
            { title: '分类', dataIndex: 'categoryName', key: 'categoryName' },
            { title: '售价', key: 'price', render: (_, record) => `¥ ${record.price}` },
            { title: '库存', dataIndex: 'stock', key: 'stock' },
            { title: '销量', dataIndex: 'sales', key: 'sales' },
            {
              title: '状态',
              key: 'status',
              render: (_, record) => {
                const meta = resolveStatusMeta(record.status);
                return <Tag color={meta.color}>{meta.label}</Tag>;
              }
            },
            { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
            {
              title: '操作',
              key: 'actions',
              render: (_, record) => (
                <Space size={12}>
                  <Button
                    type="link"
                    onClick={() => {
                      setEditingProduct(record);
                      setDrawerOpen(true);
                    }}
                  >
                    编辑
                  </Button>
                  <Permission permission={PERMISSION_CODES.productPublish}>
                    <Button
                      type="link"
                      onClick={() =>
                        publishMutation.mutate({
                          id: record.id,
                          status: record.status === 'active' ? 'inactive' : 'active'
                        })
                      }
                    >
                      {record.status === 'active' ? '下架' : '上架'}
                    </Button>
                  </Permission>
                  <Permission permission={PERMISSION_CODES.productWrite}>
                    <Popconfirm
                      title={`确认删除商品“${record.name}”吗？`}
                      okText="确认"
                      cancelText="取消"
                      onConfirm={() => removeMutation.mutate(record.id)}
                    >
                      <Button type="link" danger>
                        删除
                      </Button>
                    </Popconfirm>
                  </Permission>
                </Space>
              )
            }
          ]}
        />
      </DataPanel>
      {drawerOpen ? (
        <ProductDrawer
          open={drawerOpen}
          initialValue={editingProduct}
          categories={categoriesQuery.data ?? []}
          onClose={() => {
            setDrawerOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={(payload) => saveMutation.mutate(payload)}
        />
      ) : null}
    </Space>
  );
}
