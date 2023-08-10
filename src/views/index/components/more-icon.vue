<template>
  <ele-dropdown
    :items="[
      { title: '编辑', command: 'edit', icon: EditPen },
      { title: '删除', command: 'remove', icon: Delete, danger: true }
    ]"
    placement="bottom-end"
    style="cursor: pointer"
    :popper-options="{
      modifiers: [{ name: 'offset', options: { offset: [12, 12] } }]
    }"
    @command="onCommand"
  >
    <ele-text
      type="placeholder"
      :icon="MoreFilled"
      style="transform: rotate(90deg); outline: none"
    />
  </ele-dropdown>
</template>

<script setup>
  import { MoreFilled, EditPen, Delete } from '@element-plus/icons-vue';

  const emit = defineEmits(['command']);

  const onCommand = (command) => {
    emit('command', command);
  };
</script>
