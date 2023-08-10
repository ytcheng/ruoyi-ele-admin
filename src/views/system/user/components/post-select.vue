<!-- 岗位选择下拉框 -->
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
      :key="item.postId"
      :value="item.postId"
      :label="item.postName"
    />
  </el-select>
</template>

<script setup>
  import { ref } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { listPosts } from '@/api/system/post';

  const emit = defineEmits(['update:modelValue']);

  defineProps({
    // 选中的岗位
    modelValue: Array,
    // 提示信息
    placeholder: {
      type: String,
      default: '请选择岗位'
    }
  });

  // 角色数据
  const data = ref([]);

  /* 更新选中数据 */
  const updateValue = (value) => {
    emit('update:modelValue', value);
  };

  /* 获取角色数据 */
  listPosts()
    .then((list) => {
      data.value = list;
    })
    .catch((e) => {
      EleMessage.error(e.message);
    });
</script>
