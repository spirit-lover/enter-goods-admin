import { useQuery } from '@tanstack/react-query';
import { Space, Table, Tag } from 'antd';
import type { UserProfile } from '@enterprise/shared';
import { fetchUsers } from '../../api/system';
import { DataPanel } from '../../components/data-panel';
import { OverviewStrip } from '../../components/overview-strip';
import { PageHeader } from '../../components/page-header';

export function UsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  const users = data ?? [];
  const departments = new Set(users.map((item) => item.department).filter(Boolean));
  const roles = new Set(users.flatMap((item) => item.roles));

  return (
    <Space orientation="vertical" size={20} className="page-stack">
      <PageHeader
        eyebrow="Governance Center"
        title="用户管理"
        description="查看当前可登录后台的用户、部门和角色归属。"
      />
      <OverviewStrip
        testId="users-overview"
        items={[
          { label: '活跃用户', value: users.length, hint: '当前后台可登录账号数量', tone: 'navy' },
          { label: '覆盖部门', value: departments.size, hint: '已接入后台的部门范围', tone: 'gold' },
          { label: '角色类型', value: roles.size, hint: '用户承担的角色组合数量', tone: 'emerald' }
        ]}
      />
      <DataPanel
        testId="users-table-panel"
        eyebrow="Access Ledger"
        title="用户访问台账"
        description="保持账号、部门和角色归属的清晰映射，便于权限审查和跨部门协作。"
      >
        <Table<UserProfile>
          rowKey="id"
          loading={isLoading}
          dataSource={users}
          pagination={false}
          columns={[
            { title: '用户名', dataIndex: 'username', key: 'username' },
            { title: '姓名', dataIndex: 'displayName', key: 'displayName' },
            { title: '部门', dataIndex: 'department', key: 'department' },
            {
              title: '角色',
              key: 'roles',
              render: (_, record) => (
                <Space wrap>
                  {record.roles.map((role) => (
                    <Tag key={role} color="processing">
                      {role}
                    </Tag>
                  ))}
                </Space>
              )
            }
          ]}
        />
      </DataPanel>
    </Space>
  );
}
