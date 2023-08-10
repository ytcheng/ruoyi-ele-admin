import { ref, onBeforeUnmount } from 'vue';

/**
 * 获取是否是移动端hook
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
