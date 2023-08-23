import {
  ref,
  reactive,
  unref,
  provide,
  watch,
  onActivated,
  onDeactivated,
  nextTick
} from 'vue';
import { storeToRefs } from 'pinia';
import { THEME_KEY } from 'vue-echarts';
import { ChartTheme, ChartThemeDark } from 'ele-admin-plus/es';
import { useThemeStore } from '@/store/modules/theme';
import { useBodyResize } from './use-body-resize';

/**
 * echarts自动切换主题/重置尺寸hook
 * @param refs 图表ref
 */
export function useEcharts(refs) {
  // 是否是暗黑主题
  const themeStore = useThemeStore();
  const { darkMode } = storeToRefs(themeStore);
  // 是否为deactivated状态
  const deactivated = ref(false);
  // 当前图表是否是暗黑主题
  const isDark = ref(unref(darkMode));
  // 当前图表主题
  const chartsTheme = reactive({
    ...(unref(isDark) ? ChartThemeDark : ChartTheme)
  });

  // 设置图表主题
  provide(THEME_KEY, chartsTheme);

  /* 重置图表尺寸 */
  const resizeCharts = () => {
    refs.forEach((chartRef) => {
      unref(chartRef)?.resize?.();
    });
  };

  /* 屏幕尺寸变化监听 */
  useBodyResize(() => {
    resizeCharts();
  });

  /* 更改图表主题 */
  const changeTheme = (dark) => {
    isDark.value = dark;
    Object.assign(chartsTheme, dark ? ChartThemeDark : ChartTheme);
  };

  onActivated(() => {
    deactivated.value = false;
    nextTick(() => {
      if (unref(isDark) !== unref(darkMode)) {
        changeTheme(unref(darkMode));
      } else {
        resizeCharts();
      }
    });
  });

  onDeactivated(() => {
    deactivated.value = true;
  });

  watch(darkMode, (dark) => {
    if (!unref(deactivated)) {
      changeTheme(dark);
    }
  });
}
