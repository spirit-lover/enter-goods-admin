import { createPinia, setActivePinia } from 'pinia';
import { describe, expect, it } from 'vitest';
import { PERMISSION_CODES } from '@enterprise/shared';
import { permissionDirective } from '../directives/permission';
import { usePermissionStore } from '../stores/permission';
describe('permission directive', () => {
    it('缺少权限时移除按钮节点', () => {
        setActivePinia(createPinia());
        const store = usePermissionStore();
        store.permissions = [PERMISSION_CODES.productRead];
        const parent = document.createElement('div');
        const button = document.createElement('button');
        parent.appendChild(button);
        const directive = permissionDirective;
        directive.beforeMount?.(button, {
            value: PERMISSION_CODES.productWrite
        });
        expect(parent.contains(button)).toBe(false);
    });
});
