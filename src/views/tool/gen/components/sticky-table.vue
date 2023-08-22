<!-- 编辑表格粘性表头 -->
<template>
  <div>
    <div
      ref="headerRef"
      style="position: sticky; top: 0; z-index: 999; overflow: hidden"
    >
      <ele-table :class="tableClass" :style="tableStyle">
        <colgroup>
          <slot name="colgroup"></slot>
        </colgroup>
        <thead>
          <slot name="thead"></slot>
        </thead>
      </ele-table>
    </div>
    <div style="overflow-x: auto" @scroll="onScroll">
      <ele-table :class="tableClass" :style="tableStyle">
        <colgroup>
          <slot name="colgroup"></slot>
        </colgroup>
        <tbody>
          <slot name="tbody"></slot>
        </tbody>
      </ele-table>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  defineProps({
    // 自定义表格样式
    tableStyle: Object,
    // 自定义表格类名
    tableClass: String
  });

  // 表头
  const headerRef = ref(null);

  /* 滚动事件, 同步滚动表头 */
  const onScroll = (e) => {
    const el = headerRef.value;
    const scrollLeft = e.currentTarget.scrollLeft;
    if (el.scrollLeft != scrollLeft) {
      el.scrollLeft = scrollLeft;
    }
  };
</script>
