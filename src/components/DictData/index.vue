<template>
  <el-radio-group
    v-if="type === 'radio'"
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
  import { ref } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
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

  // 字典数据
  const data = ref([]);

  /* 更新选中数据 */
  const updateValue = (value) => {
    emit('update:modelValue', value);
  };

  /* 获取字典数据 */
  listDictDatas(props.code)
    .then((list) => {
      data.value = list;
    })
    .catch((e) => {
      EleMessage.error(e.message);
    });
</script>
