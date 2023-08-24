import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';

/**
 * 权限判断hook
 */
export function usePermission() {
  const userStore = useUserStore();
  const { authorities, roles } = storeToRefs(userStore);

  /**
   * 是否有某些权限
   * @param value 权限字符或字符数组
   */
  const hasPermission = (value) => {
    if (authorities.value && authorities.value.includes('*:*:*')) {
      return true;
    }
    return arrayHas(authorities.value, value);
  };

  /**
   * 是否有任意权限
   * @param value 权限字符或字符数组
   */
  const hasAnyPermission = (value) => {
    if (authorities.value && authorities.value.includes('*:*:*')) {
      return true;
    }
    return arrayHasAny(authorities.value, value);
  };

  /**
   * 是否有某些角色
   * @param value 角色字符或字符数组
   */
  const hasRole = (value) => {
    return arrayHas(roles.value, value);
  };

  /**
   * 是否有任意角色
   * @param value 角色字符或字符数组
   */
  const hasAnyRole = (value) => {
    return arrayHasAny(roles.value, value);
  };

  return { hasPermission, hasAnyPermission, hasRole, hasAnyRole };
}

/**
 * 判断数组是否有某些值
 * @param array 数组
 * @param value 单个值或数组
 */
function arrayHas(array, value) {
  if (!value) {
    return true;
  }
  if (!array) {
    return false;
  }
  if (Array.isArray(value)) {
    return !array.some((d) => !value.includes(d));
  }
  return array.includes(value);
}

/**
 * 判断数组是否有任意值
 * @param array 数组
 * @param value 单个值或数组
 */
function arrayHasAny(array, value) {
  if (!value) {
    return true;
  }
  if (!array) {
    return false;
  }
  if (Array.isArray(value)) {
    return array.some((d) => value.includes(d));
  }
  return array.includes(value);
}
