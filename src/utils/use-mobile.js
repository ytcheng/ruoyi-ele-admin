import { ref, onBeforeUnmount } from 'vue';

/**
 * 获取是否是移动端小屏幕hook
 * @param onChange 值改变回调
 */
export function useMobile(onChange) {
  const media = window.matchMedia('(max-width: 768px)');
  const mobile = ref(media.matches);

  const onMediaChangeListener = () => {
    mobile.value = media.matches;
    onChange && onChange(mobile.value);
  };
  media.addEventListener('change', onMediaChangeListener);

  onBeforeUnmount(() => {
    media.removeEventListener('change', onMediaChangeListener);
  });

  return { mobile };
}

/**
 * 获取是否是移动端触摸设备hook
 * @param onChange 值改变回调
 */
export function useMobileDevice(onChange) {
  const media = window.matchMedia('(pointer: coarse)');
  const mobileDevice = ref(media.matches);

  const onMediaChangeListener = () => {
    mobileDevice.value = media.matches;
    onChange && onChange(mobileDevice.value);
  };
  media.addEventListener('change', onMediaChangeListener);

  onBeforeUnmount(() => {
    media.removeEventListener('change', onMediaChangeListener);
  });

  return { mobileDevice };
}
