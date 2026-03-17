import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it } from 'vitest';
import AppShell from '../layouts/AppShell.vue';
import type { MenuTreeNode } from '@enterprise/shared';

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
        id: 'goods-list',
        parentId: 'goods',
        name: 'goods-list',
        title: '商品管理',
        path: '/goods/products',
        type: 'menu'
      }
    ]
  }
];

describe('AppShell', () => {
  it('根据菜单树渲染侧边导航', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/goods/products', component: { template: '<div />' } }
      ]
    });

    router.push('/goods/products');
    await router.isReady();

    const wrapper = mount(AppShell, {
      props: {
        menus,
        username: '系统管理员'
      },
      global: {
        plugins: [router]
      },
      slots: {
        default: '<div>content</div>'
      }
    });

    expect(wrapper.text()).toContain('商品中心');
    expect(wrapper.text()).toContain('商品管理');
    expect(wrapper.find('.el-menu').exists()).toBe(true);
  });
});
