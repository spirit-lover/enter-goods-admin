import { useQuery } from '@tanstack/react-query';
import { Card, Empty, List, Space, Statistic, Tag, Typography } from 'antd';
import { fetchDashboardSummary } from '../../api/system';
import { PageHeader } from '../../components/page-header';

const metricMeta: Array<{
  key: 'productCount' | 'activeProductCount' | 'orderCount' | 'paidOrderAmount' | 'inventoryAlertCount';
  label: string;
  tone: 'slate' | 'blue' | 'neutral' | 'gold' | 'amber';
  prefix?: string;
}> = [
  { key: 'productCount', label: '商品总数', tone: 'slate' },
  { key: 'activeProductCount', label: '上架商品', tone: 'blue' },
  { key: 'orderCount', label: '订单总数', tone: 'neutral' },
  { key: 'paidOrderAmount', label: '已支付金额', tone: 'gold', prefix: '¥' },
  { key: 'inventoryAlertCount', label: '库存预警', tone: 'amber' }
];

export function DashboardPage() {
  const { data } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary
  });

  const summary = data ?? {
    productCount: 0,
    activeProductCount: 0,
    orderCount: 0,
    paidOrderAmount: 0,
    inventoryAlertCount: 0,
    latestLogs: []
  };

  return (
    <Space orientation="vertical" size={24} className="page-stack">
      <PageHeader
        eyebrow="Operations Cockpit"
        title="运营概览"
        description="以统一视角追踪商品、库存、订单与治理动作，帮助团队在同一工作台内完成日常决策。"
      />

      <div className="dashboard-hero" data-testid="dashboard-hero">
        <Card className="dashboard-hero__summary">
          <Tag variant="filled" className="dashboard-hero__tag">
            Daily Brief
          </Tag>
          <Typography.Title level={3}>今日经营态势一览</Typography.Title>
          <Typography.Paragraph>
            重点关注商品活跃度、订单支付表现与库存风险，把最影响节奏的信号前置到首页。
          </Typography.Paragraph>
          <div className="dashboard-hero__signals">
            <div className="dashboard-signal">
              <span className="dashboard-signal__label">活跃商品占比</span>
              <strong>
                {summary.productCount
                  ? `${Math.round((summary.activeProductCount / summary.productCount) * 100)}%`
                  : '0%'}
              </strong>
            </div>
            <div className="dashboard-signal">
              <span className="dashboard-signal__label">待处理风险</span>
              <strong>{summary.inventoryAlertCount}</strong>
            </div>
            <div className="dashboard-signal">
              <span className="dashboard-signal__label">订单规模</span>
              <strong>{summary.orderCount}</strong>
            </div>
          </div>
        </Card>

        <Card className="dashboard-activity-panel" data-testid="dashboard-activity-panel" title="最近操作">
          {summary.latestLogs.length ? (
            <List
              dataSource={summary.latestLogs}
              renderItem={(log) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${log.operatorName} · ${log.action}`}
                    description={
            <Space orientation="vertical" size={2}>
                        <Typography.Text>{log.detail}</Typography.Text>
                        <Typography.Text type="secondary">{log.createdAt}</Typography.Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="暂无日志" />
          )}
        </Card>
      </div>

      <div className="dashboard-kpi-grid" data-testid="dashboard-kpi-grid">
        {metricMeta.map((item) => (
          <Card key={item.key} className={`dashboard-kpi dashboard-kpi--${item.tone}`}>
            <Statistic
              title={item.label}
              value={summary[item.key]}
              prefix={item.prefix}
            />
          </Card>
        ))}
      </div>
    </Space>
  );
}
