<!-- 字段选择下拉框 -->
<template>
  <el-select
    clearable
    :model-value="modelValue"
    :placeholder="placeholder"
    class="ele-fluid"
    @update:modelValue="updateValue"
  >
    <el-option
      v-for="item in data"
      :key="item.columnName"
      :value="item.columnName"
      :label="`${item.columnName}: ${item.columnComment}`"
    />
  </el-select>
</template>

<script setup>
  const emit = defineEmits(['update:modelValue']);

  defineProps({
    // 选中的岗位
    modelValue: String,
    // 提示信息
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 下拉数据
    data: Array
  });

  /* 更新选中数据 */
  const updateValue = (value) => {
    emit('update:modelValue', value);
  };
</script>
