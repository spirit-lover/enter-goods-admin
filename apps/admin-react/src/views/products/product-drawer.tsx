import { Button, Drawer, Form, Input, InputNumber, Select, Space, Typography } from 'antd';
import type { CategoryDTO, ProductDTO, ProductUpsertPayload } from '@enterprise/shared';
import { useEffect } from 'react';

interface ProductDrawerProps {
  open: boolean;
  initialValue: ProductDTO | null;
  categories: CategoryDTO[];
  onClose: () => void;
  onSubmit: (payload: ProductUpsertPayload) => void | Promise<void>;
}

interface ProductFormValues
  extends Omit<ProductUpsertPayload, 'price' | 'costPrice' | 'stock'> {
  price?: number;
  costPrice?: number;
  stock?: number;
}

const defaultCover = 'https://images.example.com/default.png';

function buildInitialValues(
  categories: CategoryDTO[],
  product: ProductDTO | null
): ProductFormValues {
  if (product) {
    return {
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      price: product.price,
      costPrice: product.costPrice,
      stock: product.stock,
      status: product.status,
      cover: product.cover,
      description: product.description
    };
  }

  return {
    name: '',
    sku: '',
    categoryId: categories[0]?.id ?? '',
    price: undefined,
    costPrice: undefined,
    stock: undefined,
    status: 'draft',
    cover: defaultCover,
    description: ''
  };
}

export function ProductDrawer({
  open,
  initialValue,
  categories,
  onClose,
  onSubmit
}: ProductDrawerProps) {
  const [form] = Form.useForm<ProductFormValues>();

  useEffect(() => {
    form.setFieldsValue(buildInitialValues(categories, initialValue));
  }, [categories, form, initialValue]);

  return (
    <Drawer
      title={initialValue ? '编辑商品' : '新增商品'}
      open={open}
      size="large"
      className="drawer-shell"
      getContainer={false}
      onClose={onClose}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            onClick={() => {
              void form.validateFields().then((values) =>
                onSubmit({
                  ...values,
                  price: Number(values.price),
                  costPrice: Number(values.costPrice),
                  stock: Number(values.stock)
                })
              );
            }}
          >
            保存商品
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" initialValues={buildInitialValues(categories, initialValue)}>
        <div className="drawer-intro">
          <span className="drawer-intro__eyebrow">Merchandise Editor</span>
          <Typography.Title level={4}>
            {initialValue ? '更新商品信息与经营状态' : '创建新的商品档案'}
          </Typography.Title>
          <Typography.Paragraph>
            先维护基础身份与经营参数，再补充封面和描述，保证商品在发布前具备完整信息。
          </Typography.Paragraph>
        </div>
        <section className="drawer-section">
          <div className="drawer-section__header">
            <Typography.Title level={5}>基础信息</Typography.Title>
            <Typography.Paragraph>定义商品身份、分类归属与当前经营状态。</Typography.Paragraph>
          </div>
          <div className="form-grid">
            <Form.Item label="商品名称" name="name" rules={[{ required: true, message: '请输入商品名称' }]}>
              <Input id="name" placeholder="请输入商品名称" />
            </Form.Item>
            <Form.Item label="SKU" name="sku" rules={[{ required: true, message: '请输入 SKU' }]}>
              <Input id="sku" placeholder="请输入 SKU" />
            </Form.Item>
            <Form.Item
              label="商品分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择商品分类' }]}
            >
              <Select
                options={categories.map((category) => ({ label: category.name, value: category.id }))}
              />
            </Form.Item>
            <Form.Item label="商品状态" name="status">
              <Select
                options={[
                  { label: '草稿', value: 'draft' },
                  { label: '上架', value: 'active' },
                  { label: '下架', value: 'inactive' }
                ]}
              />
            </Form.Item>
          </div>
        </section>
        <section className="drawer-section">
          <div className="drawer-section__header">
            <Typography.Title level={5}>经营参数</Typography.Title>
            <Typography.Paragraph>围绕定价、库存和展示素材整理一套完整的经营资料。</Typography.Paragraph>
          </div>
          <div className="form-grid">
            <Form.Item label="售价" name="price" rules={[{ required: true, message: '请输入售价' }]}>
              <InputNumber id="price" min={0} precision={2} className="field-block" />
            </Form.Item>
            <Form.Item label="成本价" name="costPrice" rules={[{ required: true, message: '请输入成本价' }]}>
              <InputNumber id="costPrice" min={0} precision={2} className="field-block" />
            </Form.Item>
            <Form.Item label="库存" name="stock" rules={[{ required: true, message: '请输入库存' }]}>
              <InputNumber id="stock" min={0} precision={0} className="field-block" />
            </Form.Item>
            <Form.Item label="封面地址" name="cover">
              <Input placeholder="请输入封面图地址" />
            </Form.Item>
            <Form.Item label="商品描述" name="description" className="form-grid__full">
              <Input.TextArea id="description" rows={4} placeholder="请输入商品描述" />
            </Form.Item>
          </div>
        </section>
      </Form>
    </Drawer>
  );
}
