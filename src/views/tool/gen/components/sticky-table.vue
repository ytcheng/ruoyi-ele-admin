<!-- 编辑表格粘性表头 -->
<template>
  <div>
    <div
      ref="headerRef"
      class="ele-scrollbar-hide"
      style="position: sticky; top: 0; z-index: 999; overflow-x: auto"
      @scroll="onScroll"
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
    <div ref="bodyRef" style="overflow-x: auto" @scroll="onScroll">
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

  // 主体
  const bodyRef = ref(null);

  /* 滚动事件 */
  const onScroll = (e) => {
    // 同步滚动
    const target = e.currentTarget;
    const scrollLeft = target.scrollLeft;
    [headerRef.value, bodyRef.value].forEach((el) => {
      if (target !== el) {
        el.scrollLeft = scrollLeft;
      }
    });
  };
</script>
