<!-- 路由出口 -->
<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName" mode="out-in" appear>
      <keep-alive :include="keepAliveInclude">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';

  const themeStore = useThemeStore();
  const { keepAliveInclude, transitionName } = storeToRefs(themeStore);
</script>

<script>
  export default {
    name: 'RouterLayout'
  };
</script>
