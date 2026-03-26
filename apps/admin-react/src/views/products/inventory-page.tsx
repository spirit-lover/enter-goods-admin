import { useQuery } from '@tanstack/react-query';
import { Space, Table, Tag } from 'antd';
import type { InventoryRecordDTO } from '@enterprise/shared';
import { fetchInventoryRecords } from '../../api/product';
import { DataPanel } from '../../components/data-panel';
import { OverviewStrip } from '../../components/overview-strip';
import { PageHeader } from '../../components/page-header';

export function InventoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['inventory-records'],
    queryFn: fetchInventoryRecords
  });

  const records = data ?? [];
  const inboundCount = records.filter((item) => item.change > 0).length;
  const outboundCount = records.filter((item) => item.change < 0).length;

  return (
    <Space orientation="vertical" size={20} className="page-stack">
      <PageHeader
        eyebrow="Inventory Watch"
        title="库存管理"
        description="查看商品库存变更明细和操作记录。"
      />
      <OverviewStrip
        items={[
          { label: '变更记录', value: records.length, hint: '当前库存流水总数', tone: 'navy' },
          { label: '入库动作', value: inboundCount, hint: '库存增加的操作条目', tone: 'emerald' },
          { label: '出库动作', value: outboundCount, hint: '库存减少的操作条目', tone: 'gold' }
        ]}
      />
      <DataPanel
        eyebrow="Inventory Ledger"
        title="库存变更明细"
        description="聚焦商品库存变化、操作原因与经办人，适合做异常排查和补货复盘。"
      >
        <Table<InventoryRecordDTO>
          rowKey="id"
          loading={isLoading}
          dataSource={records}
          pagination={false}
          columns={[
            { title: '商品', dataIndex: 'productName', key: 'productName' },
            {
              title: '变更数量',
              key: 'change',
              render: (_, record) => (
                <Tag color={record.change > 0 ? 'success' : 'error'}>
                  {record.change > 0 ? '+' : ''}
                  {record.change}
                </Tag>
              )
            },
            { title: '原因', dataIndex: 'reason', key: 'reason' },
            { title: '操作人', dataIndex: 'operatorName', key: 'operatorName' },
            { title: '时间', dataIndex: 'createdAt', key: 'createdAt' }
          ]}
        />
      </DataPanel>
    </Space>
  );
}
