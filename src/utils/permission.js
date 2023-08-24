/**
 * 按钮级权限控制指令
 */
import { usePermission } from './use-permission';

export default {
  install(app) {
    app.directive('role', {
      mounted: (el, binding) => {
        const { hasRole } = usePermission();
        if (!hasRole(binding.value)) {
          el.parentNode?.removeChild?.(el);
        }
      }
    });
    app.directive('any-role', {
      mounted: (el, binding) => {
        const { hasAnyRole } = usePermission();
        if (!hasAnyRole(binding.value)) {
          el.parentNode?.removeChild?.(el);
        }
      }
    });
    app.directive('permission', {
      mounted: (el, binding) => {
        const { hasPermission } = usePermission();
        if (!hasPermission(binding.value)) {
          el.parentNode?.removeChild?.(el);
        }
      }
    });
    app.directive('any-permission', {
      mounted: (el, binding) => {
        const { hasAnyPermission } = usePermission();
        if (!hasAnyPermission(binding.value)) {
          el.parentNode?.removeChild?.(el);
        }
      }
    });
  }
};
