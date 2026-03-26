import type { MenuProps } from 'antd';
import { Avatar, Breadcrumb, Button, Dropdown, Grid, Layout, Menu, Tag, Typography } from 'antd';
import type { MenuTreeNode } from '@enterprise/shared';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface AppShellProps {
  menus: MenuTreeNode[];
  username: string;
  onLogout?: () => void;
  children: ReactNode;
}

function resolveMenuPath(menu: MenuTreeNode): string {
  if (menu.children?.length) {
    return resolveMenuPath(menu.children[0]);
  }
  return menu.path;
}

function toMenuItems(nodes: MenuTreeNode[]): MenuProps['items'] {
  return nodes
    .filter((node) => !node.hidden && node.type !== 'button')
    .map((node) => {
      if (node.children?.length) {
        return {
          key: node.id,
          label: node.title,
          children: toMenuItems(node.children)
        };
      }

      return {
        key: resolveMenuPath(node),
        label: <Link to={resolveMenuPath(node)}>{node.title}</Link>
      };
    });
}

function buildBreadcrumbs(pathname: string, menus: MenuTreeNode[]) {
  const breadcrumbTrail: Array<{ title: string; path: string }> = [];

  const visit = (nodes: MenuTreeNode[], parents: Array<{ title: string; path: string }>) => {
    for (const node of nodes) {
      const current = [...parents, { title: node.title, path: resolveMenuPath(node) }];
      if (resolveMenuPath(node) === pathname) {
        breadcrumbTrail.push(...current);
        return true;
      }
      if (node.children?.length && visit(node.children, current)) {
        return true;
      }
    }
    return false;
  };

  visit(menus, []);
  return breadcrumbTrail;
}

export function AppShell({ menus, username, onLogout, children }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = Grid.useBreakpoint();

  const menuItems = useMemo(() => toMenuItems(menus), [menus]);
  const defaultOpenKeys = useMemo(
    () => menus.filter((node) => node.children?.length).map((node) => node.id),
    [menus]
  );
  const breadcrumbs = useMemo(
    () => buildBreadcrumbs(location.pathname, menus),
    [location.pathname, menus]
  );

  return (
    <Layout className="app-shell">
      <Sider
        width={screens.lg ? 280 : 236}
        breakpoint="lg"
        collapsedWidth={88}
        className="app-shell__sider"
      >
        <div className="app-shell__brand-panel">
          <Tag variant="filled" className="app-shell__brand-tag">
            Business Suite
          </Tag>
          <Title level={4} className="app-shell__brand-title" data-testid="shell-brand-title">
            企业商品后台
          </Title>
          <Text className="app-shell__brand-subtitle">商品中台控制台</Text>
          <div className="app-shell__brand-divider" />
          <Text className="app-shell__brand-footnote">
            目录、库存、订单与系统治理统一收口，面向企业运营团队提供稳定的日常作业环境。
          </Text>
        </div>

        <Menu
          mode="inline"
          theme="dark"
          items={menuItems}
          defaultOpenKeys={defaultOpenKeys}
          selectedKeys={[location.pathname]}
          className="app-shell__menu"
          onClick={({ key }) => navigate(String(key))}
        />
      </Sider>

      <Layout>
        <Header className="app-shell__header">
          <div className="app-shell__command">
            <Text className="app-shell__command-kicker">Operations Command</Text>
            <Title level={4} className="app-shell__command-title" data-testid="shell-command-title">
              企业商品运营中台
            </Title>
            <Text className="app-shell__command-subtitle">
              统一追踪商品状态、履约节奏、库存风险与治理动作。
            </Text>
          </div>

          <div className="app-shell__header-actions">
            <div className="app-shell__header-note">
              <span className="app-shell__header-note-dot" />
              <Text>今日重点：关注库存预警与商品上架节奏</Text>
            </div>
            <Dropdown
              menu={{
                items: [{ key: 'logout', label: '退出登录' }],
                onClick: ({ key }) => {
                  if (key === 'logout') {
                    onLogout?.();
                  }
                }
              }}
              trigger={['click']}
            >
              <Button type="default" className="app-shell__user">
                <Avatar size="small">{username.slice(0, 1)}</Avatar>
                <span>{username}</span>
              </Button>
            </Dropdown>
          </div>
        </Header>

        <Content className="app-shell__content">
          <div className="app-shell__frame">
            <div className="app-shell__breadcrumbs">
              <Breadcrumb
                items={breadcrumbs.map((item) => ({
                  title: <Link to={item.path}>{item.title}</Link>
                }))}
              />
            </div>
            <div className="app-shell__panel">{children}</div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
