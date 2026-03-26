import { render, screen } from '@testing-library/react';
import type { MenuTreeNode } from '@enterprise/shared';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AppShell } from '../layouts/app-shell';

function renderMenuItems(items: Array<{ key: string; label: ReactNode; children?: Array<{ key: string; label: ReactNode }> }> = []) {
  return items.map((item) => (
    <li key={item.key}>
      <div>{item.label}</div>
      {item.children?.length ? <ul>{renderMenuItems(item.children)}</ul> : null}
    </li>
  ));
}

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return {
    ...actual,
    Grid: {
      useBreakpoint: () => ({ lg: true, md: true, sm: true, xs: false })
    },
    Dropdown: ({ children }: { children: ReactNode }) => <>{children}</>,
    Avatar: ({ children }: { children: ReactNode }) => <span>{children}</span>,
    Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
      <button type="button" {...props}>
        {children}
      </button>
    ),
    Menu: ({ items }: { items?: Array<{ key: string; label: ReactNode; children?: Array<{ key: string; label: ReactNode }> }> }) => (
      <ul>{renderMenuItems(items)}</ul>
    )
  };
});

const menus: MenuTreeNode[] = [
  {
    id: 'goods',
    parentId: null,
    name: 'goods',
    title: '商品中心',
    path: '/goods',
    type: 'catalog',
    children: [
      {
        id: 'goods-products',
        parentId: 'goods',
        name: 'goods-products',
        title: '商品管理',
        path: '/goods/products',
        type: 'menu'
      }
    ]
  }
];

describe('AppShell', () => {
  it('根据菜单树渲染侧边导航与品牌头部', () => {
    render(
      <MemoryRouter initialEntries={['/goods/products']}>
        <AppShell menus={menus} username="系统管理员">
          <div>content</div>
        </AppShell>
      </MemoryRouter>
    );

    expect(screen.getAllByText('商品中心').length).toBeGreaterThan(0);
    expect(screen.getByText('商品管理')).toBeInTheDocument();
    expect(screen.getByText('系统管理员')).toBeInTheDocument();
    expect(screen.getByTestId('shell-brand-title')).toBeInTheDocument();
    expect(screen.getByTestId('shell-command-title')).toBeInTheDocument();
  });
});
