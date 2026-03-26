import { useQuery } from '@tanstack/react-query';
import { Space, Table, Tag } from 'antd';
import type { OrderDTO } from '@enterprise/shared';
import { fetchOrders } from '../../api/product';
import { DataPanel } from '../../components/data-panel';
import { OverviewStrip } from '../../components/overview-strip';
import { PageHeader } from '../../components/page-header';

function resolveStatus(status: OrderDTO['status']) {
  if (status === 'paid') {
    return { label: '已支付', color: 'success' as const };
  }
  if (status === 'pending') {
    return { label: '待处理', color: 'warning' as const };
  }
  if (status === 'completed') {
    return { label: '已完成', color: 'processing' as const };
  }
  return { label: '已关闭', color: 'default' as const };
}

export function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  });

  const orders = data ?? [];
  const paidCount = orders.filter((item) => item.status === 'paid' || item.status === 'completed').length;
  const pendingCount = orders.filter((item) => item.status === 'pending').length;
  const amount = orders.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <Space orientation="vertical" size={20} className="page-stack">
      <PageHeader
        eyebrow="Order Fulfillment"
        title="订单管理"
        description="查看订单状态、客户与成交金额。"
      />
      <OverviewStrip
        items={[
          { label: '订单总量', value: orders.length, hint: '当前加载的订单记录', tone: 'navy' },
          { label: '待处理', value: pendingCount, hint: '需要继续跟进的订单', tone: 'gold' },
          { label: '已成交', value: paidCount, hint: '已支付或已完成订单', tone: 'emerald' },
          { label: '成交额', value: `¥ ${amount.toFixed(0)}`, hint: '当前订单池累计金额', tone: 'navy' }
        ]}
      />
      <DataPanel
        eyebrow="Order Ledger"
        title="订单履约台账"
        description="将客户、成交金额与状态进度集中在一处，方便客服、运营和仓配统一协作。"
      >
        <Table<OrderDTO>
          rowKey="id"
          loading={isLoading}
          dataSource={orders}
          pagination={false}
          columns={[
            { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
            { title: '客户', dataIndex: 'customerName', key: 'customerName' },
            { title: '金额', key: 'amount', render: (_, record) => `¥ ${record.amount}` },
            {
              title: '状态',
              key: 'status',
              render: (_, record) => {
                const meta = resolveStatus(record.status);
                return <Tag color={meta.color}>{meta.label}</Tag>;
              }
            },
            { title: '时间', dataIndex: 'createdAt', key: 'createdAt' }
          ]}
        />
      </DataPanel>
    </Space>
  );
}
