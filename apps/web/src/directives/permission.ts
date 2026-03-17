import type { Directive } from 'vue';
import type { PermissionCode } from '@enterprise/shared';
import { usePermissionStore } from '../stores/permission';

function ensurePermission(el: HTMLElement, permission?: PermissionCode) {
  const store = usePermissionStore();
  if (!store.can(permission)) {
    el.remove();
  }
}

export const permissionDirective: Directive<HTMLElement, PermissionCode> = {
  beforeMount(el, binding) {
    ensurePermission(el, binding.value);
  },
  updated(el, binding) {
    ensurePermission(el, binding.value);
  }
};
