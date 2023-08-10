<!-- 角色选择下拉框 -->
<template>
  <el-select
    multiple
    clearable
    :model-value="modelValue"
    :placeholder="placeholder"
    class="ele-fluid"
    @update:modelValue="updateValue"
  >
    <el-option
      v-for="item in data"
      :key="item.roleId"
      :value="item.roleId"
      :label="item.roleName"
    />
  </el-select>
</template>

<script setup>
  import { ref } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { listRoles } from '@/api/system/role';

  const emit = defineEmits(['update:modelValue']);

  defineProps({
    // 选中的角色
    modelValue: Array,
    // 提示信息
    placeholder: {
      type: String,
      default: '请选择角色'
    }
  });

  // 角色数据
  const data = ref([]);

  /* 更新选中数据 */
  const updateValue = (value) => {
    emit('update:modelValue', value);
  };

  /* 获取角色数据 */
  listRoles()
    .then((list) => {
      data.value = list;
    })
    .catch((e) => {
      EleMessage.error(e.message);
    });
</script>
