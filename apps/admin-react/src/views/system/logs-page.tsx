import { useQuery } from '@tanstack/react-query';
import { Space, Table } from 'antd';
import { fetchLogs } from '../../api/system';
import type { LogRecord } from '../../api/system';
import { DataPanel } from '../../components/data-panel';
import { OverviewStrip } from '../../components/overview-strip';
import { PageHeader } from '../../components/page-header';

export function LogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['logs'],
    queryFn: fetchLogs
  });

  const logs = data ?? [];
  const moduleCount = new Set(logs.map((item) => item.module)).size;
  const operatorCount = new Set(logs.map((item) => item.operatorName)).size;

  return (
    <Space orientation="vertical" size={20} className="page-stack">
      <PageHeader
        eyebrow="Audit Timeline"
        title="操作日志"
        description="追踪系统内的关键操作行为与审计记录。"
      />
      <OverviewStrip
        items={[
          { label: '审计记录', value: logs.length, hint: '当前日志样本总量', tone: 'navy' },
          { label: '涉及模块', value: moduleCount, hint: '发生关键动作的模块数', tone: 'gold' },
          { label: '操作人', value: operatorCount, hint: '当前日志涉及的账号数', tone: 'emerald' }
        ]}
      />
      <DataPanel
        eyebrow="Audit Ledger"
        title="关键操作审计流"
        description="聚焦模块、动作、操作人和时间，便于排查异常行为与追踪责任归属。"
      >
        <Table<LogRecord>
          rowKey="id"
          loading={isLoading}
          dataSource={logs}
          pagination={false}
          columns={[
            { title: '模块', dataIndex: 'module', key: 'module' },
            { title: '动作', dataIndex: 'action', key: 'action' },
            { title: '内容', dataIndex: 'detail', key: 'detail' },
            { title: '操作人', dataIndex: 'operatorName', key: 'operatorName' },
            { title: '时间', dataIndex: 'createdAt', key: 'createdAt' }
          ]}
        />
      </DataPanel>
    </Space>
  );
}
