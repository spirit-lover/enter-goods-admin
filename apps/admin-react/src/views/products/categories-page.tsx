import { useQuery } from '@tanstack/react-query';
import { Space, Table, Tag } from 'antd';
import type { CategoryDTO } from '@enterprise/shared';
import { fetchCategories } from '../../api/product';
import { DataPanel } from '../../components/data-panel';
import { OverviewStrip } from '../../components/overview-strip';
import { PageHeader } from '../../components/page-header';

export function CategoriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const categories = data ?? [];
  const enabledCount = categories.filter((item) => item.status === 'enabled').length;

  return (
    <Space orientation="vertical" size={20} className="page-stack">
      <PageHeader
        eyebrow="Category Governance"
        title="分类管理"
        description="查看商品分类状态与排序配置。"
      />
      <OverviewStrip
        items={[
          { label: '分类总数', value: categories.length, hint: '当前可维护的分类条目', tone: 'navy' },
          { label: '启用中', value: enabledCount, hint: '正在承接商品归属的分类', tone: 'emerald' },
          {
            label: '停用中',
            value: categories.length - enabledCount,
            hint: '已下线或待整理的分类',
            tone: 'gold'
          }
        ]}
      />
      <DataPanel
        eyebrow="Category Ledger"
        title="分类台账"
        description="保持分类命名、状态和排序的可读性，便于商品运营与导航管理协同。"
      >
        <Table<CategoryDTO>
          rowKey="id"
          loading={isLoading}
          dataSource={categories}
          pagination={false}
          columns={[
            { title: '分类名称', dataIndex: 'name', key: 'name' },
            {
              title: '状态',
              key: 'status',
              render: (_, record) => (
                <Tag color={record.status === 'enabled' ? 'success' : 'default'}>
                  {record.status === 'enabled' ? '启用' : '停用'}
                </Tag>
              )
            },
            { title: '排序', dataIndex: 'sort', key: 'sort' }
          ]}
        />
      </DataPanel>
    </Space>
  );
}
