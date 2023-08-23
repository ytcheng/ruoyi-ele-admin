import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/store/modules/theme';

/**
 * 主体区尺寸改变hook
 * @param hook 改变回调
 */
export function useBodyResize(hook) {
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
