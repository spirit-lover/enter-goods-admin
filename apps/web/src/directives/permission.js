import { usePermissionStore } from '../stores/permission';
function ensurePermission(el, permission) {
    const store = usePermissionStore();
    if (!store.can(permission)) {
        el.remove();
    }
}
export const permissionDirective = {
    beforeMount(el, binding) {
        ensurePermission(el, binding.value);
    },
    updated(el, binding) {
        ensurePermission(el, binding.value);
    }
};
