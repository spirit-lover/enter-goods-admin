import { useQuery } from '@tanstack/react-query';
import { Space, Table, Tag } from 'antd';
import { fetchRoles } from '../../api/system';
import type { RoleRecord } from '../../api/system';
import { DataPanel } from '../../components/data-panel';
import { OverviewStrip } from '../../components/overview-strip';
import { PageHeader } from '../../components/page-header';

export function RolesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles
  });

  const roles = data ?? [];
  const permissionCount = roles.reduce((sum, item) => sum + item.permissionCodes.length, 0);
  const menuCount = roles.reduce((sum, item) => sum + (item.menuIds?.length ?? 0), 0);

  return (
    <Space orientation="vertical" size={20} className="page-stack">
      <PageHeader
        eyebrow="Role Matrix"
        title="角色管理"
        description="查看角色可访问的菜单与权限规模。"
      />
      <OverviewStrip
        items={[
          { label: '角色数量', value: roles.length, hint: '当前治理体系中的角色总数', tone: 'navy' },
          { label: '权限挂载', value: permissionCount, hint: '所有角色下权限码合计', tone: 'emerald' },
          { label: '菜单挂载', value: menuCount, hint: '角色关联的菜单节点总量', tone: 'gold' }
        ]}
      />
      <DataPanel
        eyebrow="Role Ledger"
        title="角色授权台账"
        description="将角色对应的菜单与权限规模公开化，方便做授权收敛和治理审查。"
      >
        <Table<RoleRecord>
          rowKey="id"
          loading={isLoading}
          dataSource={roles}
          pagination={false}
          columns={[
            { title: '角色名称', dataIndex: 'name', key: 'name' },
            {
              title: '权限数量',
              key: 'permissionCount',
              render: (_, record) => record.permissionCodes.length
            },
            {
              title: '菜单数量',
              key: 'menuCount',
              render: (_, record) => record.menuIds?.length ?? 0
            },
            {
              title: '权限摘要',
              key: 'permissions',
              render: (_, record) => (
                <Space wrap>
                  {record.permissionCodes.slice(0, 4).map((item) => (
                    <Tag key={item} color="success">
                      {item}
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
