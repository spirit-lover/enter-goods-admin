import { useQuery } from '@tanstack/react-query';
import { Descriptions, Empty, Space } from 'antd';
import { fetchSettings } from '../../api/system';
import { DataPanel } from '../../components/data-panel';
import { OverviewStrip } from '../../components/overview-strip';
import { PageHeader } from '../../components/page-header';

export function SettingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings
  });

  const entries = Object.entries(data ?? {});

  return (
    <Space orientation="vertical" size={20} className="page-stack">
      <PageHeader
        eyebrow="Runtime Baseline"
        title="系统设置"
        description="查看当前后台运行时的关键配置项。"
      />
      <OverviewStrip
        items={[
          { label: '配置项', value: entries.length, hint: '当前已暴露的运行时配置数量', tone: 'navy' },
          {
            label: '状态',
            value: entries.length ? '已同步' : '待补充',
            hint: '配置面板是否拿到有效数据',
            tone: 'gold'
          }
        ]}
      />
      <DataPanel
        eyebrow="Configuration Ledger"
        title="运行配置一览"
        description="面向运维和值班场景整理关键参数，减少排查时的上下文切换。"
        className="table-panel--descriptions"
      >
        {entries.length ? (
          <Descriptions bordered column={1}>
            {entries.map(([key, value]) => (
              <Descriptions.Item key={key} label={key}>
                {String(value)}
              </Descriptions.Item>
            ))}
          </Descriptions>
        ) : (
          <Empty description="暂无设置项" />
        )}
      </DataPanel>
    </Space>
  );
}
