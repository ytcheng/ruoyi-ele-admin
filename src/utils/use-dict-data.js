import { computed } from 'vue';
import { EleMessage } from 'ele-admin-plus/es';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import { listDictDatas } from '@/api/system/dict-data';

/**
 * 获取字典数据hook
 * @param codes 字典类型
 */
export function useDictData(codes) {
  const result = [];

  // 已缓存的字典
  const userStore = useUserStore();
  const { dicts } = storeToRefs(userStore);

  codes.forEach((code) => {
    result.push(computed(() => dicts.value[code] || []));
    // 若还未缓存过则获取字典数据
    if (dicts.value[code] != null) {
      return;
    }
    userStore.setDicts([], code);
    listDictDatas(code)
      .then((list) => {
        userStore.setDicts(list, code);
      })
      .catch((e) => {
        EleMessage.error(e.message);
      });
  });

  return result;
}
