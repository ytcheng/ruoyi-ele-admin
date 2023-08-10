/**
 * 监听主体区尺寸改变封装
 */
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/store/modules/theme';

export function onSizeChange(hook) {
  if (!hook) {
    return;
  }
  const themeStore = useThemeStore();
  const { contentWidth } = storeToRefs(themeStore);

  watch(contentWidth, (value, oldValue) => {
    if (value != null && oldValue != null) {
      hook();
    }
  });
}
