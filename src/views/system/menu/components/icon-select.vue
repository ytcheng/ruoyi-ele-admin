<!-- 图标选择下拉框 -->
<template>
  <ele-icon-select
    clearable
    :data="iconData"
    :model-value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :popper-width="420"
    :popper-height="280"
    :grid-style="{ gridTemplateColumns: 'repeat(6, 1fr)' }"
    :item-style="{ height: '52px' }"
    @update:modelValue="updateValue"
  >
    <template #icon="{ icon }">
      <el-icon>
        <component :is="icon" />
      </el-icon>
    </template>
  </ele-icon-select>
</template>

<script setup>
  const emit = defineEmits(['update:modelValue']);

  defineProps({
    // 选中的图标
    modelValue: String,
    // 是否禁用
    disabled: Boolean,
    // 提示信息
    placeholder: {
      type: String,
      default: '请选择菜单图标'
    }
  });

  /* 更新选中数据 */
  const updateValue = (value) => {
    emit('update:modelValue', value);
  };
</script>

<script>
  import * as MenuIcons from '@/layout/menu-icons';

  export default {
    components: MenuIcons,
    data() {
      return {
        iconData: Object.keys(MenuIcons)
      };
    }
  };
</script>
