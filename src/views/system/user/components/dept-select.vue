<!-- 部门选择下拉框 -->
<template>
  <el-tree-select
    clearable
    check-strictly
    default-expand-all
    :data="data"
    node-key="deptId"
    :props="{ label: 'deptName' }"
    :model-value="modelValue"
    :placeholder="placeholder"
    class="ele-fluid"
    @update:modelValue="updateValue"
  />
</template>

<script setup>
  import { ref } from 'vue';
  import { EleMessage, toTree } from 'ele-admin-plus/es';
  import { listDepts } from '@/api/system/dept';

  const emit = defineEmits(['update:modelValue']);

  defineProps({
    // 选中的部门
    modelValue: Number,
    // 提示信息
    placeholder: {
      type: String,
      default: '请选择归属部门'
    }
  });

  // 部门数据
  const data = ref([]);

  /* 更新选中数据 */
  const updateValue = (value) => {
    emit('update:modelValue', value);
  };

  /* 获取部门数据 */
  listDepts()
    .then((list) => {
      data.value = toTree({
        data: list,
        idField: 'deptId',
        parentIdField: 'parentId'
      });
    })
    .catch((e) => {
      EleMessage.error(e.message);
    });
</script>
