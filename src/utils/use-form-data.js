import { reactive } from 'vue';

/**
 * 表单数据hook
 * @param initValue 默认值
 */
export function useFormData(initValue) {
  const form = reactive({ ...initValue });

  // 重置为初始值
  const resetFields = () => {
    Object.keys(form).forEach((key) => {
      form[key] = initValue ? initValue[key] : void 0;
    });
  };

  // 赋值不改变字段
  const assignFields = (data, excludes) => {
    Object.keys(form).forEach((key) => {
      if (!excludes?.includes?.(key)) {
        form[key] = data[key];
      }
    });
  };

  return {
    form,
    resetFields,
    assignFields
  };
}
