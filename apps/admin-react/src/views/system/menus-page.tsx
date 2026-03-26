import { useQuery } from '@tanstack/react-query';
import { Empty, Space, Tree, Typography } from 'antd';
import type { MenuTreeNode } from '@enterprise/shared';
import type { ReactNode } from 'react';
import { fetchMenus } from '../../api/system';
import { DataPanel } from '../../components/data-panel';
import { OverviewStrip } from '../../components/overview-strip';
import { PageHeader } from '../../components/page-header';

interface TreeNode {
  key: string;
  title: ReactNode;
  children?: TreeNode[];
}

function toTreeData(nodes: MenuTreeNode[]): TreeNode[] {
  return nodes.map((node) => ({
    key: node.id,
    title: (
      <div className="tree-label">
        <Typography.Text>{`${node.title} · ${node.path}`}</Typography.Text>
        <Typography.Text type="secondary">{node.type}</Typography.Text>
      </div>
    ),
    children: node.children ? toTreeData(node.children) : undefined
  }));
}

function countMenuNodes(nodes: MenuTreeNode[]): number {
  return nodes.reduce((sum, node) => sum + 1 + countMenuNodes(node.children ?? []), 0);
}

export function MenusPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['system-menus'],
    queryFn: fetchMenus
  });

  const menuTree = data ?? [];
  const totalNodes = countMenuNodes(menuTree);
  const rootCount = menuTree.length;

  return (
    <Space orientation="vertical" size={20} className="page-stack">
      <PageHeader
        eyebrow="Navigation Governance"
        title="菜单管理"
        description="查看系统菜单树、路由路径和权限挂载关系。"
      />
      <OverviewStrip
        items={[
          { label: '根菜单', value: rootCount, hint: '一级导航节点数量', tone: 'navy' },
          { label: '总节点', value: totalNodes, hint: '当前菜单树节点规模', tone: 'gold' },
          { label: '治理状态', value: totalNodes ? '已加载' : '待配置', hint: '菜单树是否具备可视化数据', tone: 'emerald' }
        ]}
      />
      <DataPanel
        eyebrow="Route Topology"
        title="菜单拓扑视图"
        description="集中校验菜单标题、路径和节点层级，方便路由治理与权限挂载核对。"
        className="table-panel--tree"
      >
        <div className="tree-surface">
          {menuTree.length ? <Tree treeData={toTreeData(menuTree)} defaultExpandAll /> : <Empty description="暂无菜单数据" />}
        </div>
      </DataPanel>
    </Space>
  );
}
