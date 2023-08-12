<template>
  <template v-if="type === 'tag'">
    <template v-for="item in data">
      <el-tag
        v-if="modelValue === item.dictValue"
        :key="item.dictCode"
        size="small"
        :type="item.listClass == 'primary' ? '' : item.listClass"
        :disable-transitions="true"
      >
        {{ item.dictLabel }}
      </el-tag>
    </template>
  </template>
  <el-radio-group
    v-else-if="type === 'radio'"
    :model-value="modelValue"
    @update:modelValue="updateValue"
  >
    <el-radio v-for="item in data" :key="item.dictCode" :label="item.dictValue">
      {{ item.dictLabel }}
    </el-radio>
  </el-radio-group>
  <el-select
    v-else
    clearable
    :model-value="modelValue"
    :placeholder="placeholder"
    class="ele-fluid"
    @update:modelValue="updateValue"
  >
    <el-option
      v-for="item in data"
      :key="item.dictCode"
      :value="item.dictValue"
      :label="item.dictLabel"
    />
  </el-select>
</template>

<script setup>
  import { computed } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/store/modules/user';
  import { listDictDatas } from '@/api/system/dict-data';

  const emit = defineEmits(['update:modelValue']);

  const props = defineProps({
    // 值
    modelValue: String,
    // 提示文本
    placeholder: String,
    // 类型
    type: String,
    // 字典类型
    code: String
  });

  const userStore = useUserStore();
  const { dicts } = storeToRefs(userStore);

  // 字典数据
  const data = computed(() => dicts.value[props.code] || []);

  /* 更新选中数据 */
  const updateValue = (value) => {
    emit('update:modelValue', value);
  };

  /* 获取字典数据 */
  if (dicts.value[props.code] == null) {
    userStore.setDicts([], props.code);
    listDictDatas(props.code)
      .then((list) => {
        userStore.setDicts(list, props.code);
      })
      .catch((e) => {
        EleMessage.error(e.message);
      });
  }
</script>
