<template>
  <ele-pro-layout
    :menus="menus"
    :tabs="tabs"
    :collapse="collapse"
    :compact="compact"
    :maximized="maximized"
    :tab-bar="tabBar"
    :breadcrumb="layout === 'side'"
    :layout="layout"
    :sidebar-layout="sidebarLayout"
    :header-style="headerStyle"
    :sidebar-style="sidebarStyle"
    :tab-style="tabStyle"
    :fixed-header="fixedHeader"
    :fixed-sidebar="fixedSidebar"
    :fixed-body="fixedBody"
    :fluid="fluid"
    :logo-in-header="logoInHeader"
    :colorful-icon="colorfulIcon"
    :unique-opened="uniqueOpened"
    :fixed-home="fixedHome"
    :home-path="HOME_PATH"
    :redirectPath="REDIRECT_PATH"
    :tab-sortable="!mobileDevice"
    :tab-context-menu="!mobileDevice"
    :tab-context-menus="tabContext"
    :keep-alive="TAB_KEEP_ALIVE"
    :transition-name="transitionName"
    @update:collapse="updateCollapse"
    @update:maximized="updateMaximized"
    @tabAdd="addPageTab"
    @tabClick="onTabClick"
    @tabRemove="removePageTab"
    @tabContextMenu="onTabContextMenu"
    @tabSortChange="setPageTabs"
    @bodySizeChange="onBodySizeChange"
  >
    <router-layout />
    <!-- logo -->
    <template #logo>
      <img src="/src/assets/logo.png" style="width: 42px; height: 42px" />
      <h1 style="font-size: 17px; letter-spacing: 1px">{{ PROJECT_NAME }}</h1>
    </template>
    <!-- 顶栏左侧按钮 -->
    <template #left="{ sidebar }">
      <!-- 折叠侧栏 -->
      <header-tool v-if="sidebar" @click="updateCollapse(!collapse)">
        <el-icon style="transform: scale(1.15)">
          <menu-unfold-outlined v-if="collapse" />
          <menu-fold-outlined v-else />
        </el-icon>
      </header-tool>
      <!-- 刷新 -->
      <header-tool
        v-if="layout === 'side'"
        class="hidden-sm-and-down"
        @click="reloadPageTab()"
      >
        <el-icon style="transform: scale(1.25)">
          <refresh-right />
        </el-icon>
      </header-tool>
    </template>
    <!-- 顶栏右侧按钮 -->
    <template #right>
      <!-- 全屏切换 -->
      <header-tool class="hidden-sm-and-down" @click="toggleFullscreen">
        <el-icon style="transform: scale(1.02)">
          <compress-outlined v-if="isFullscreen" />
          <expand-outlined v-else />
        </el-icon>
      </header-tool>
      <!-- 消息通知 -->
      <header-tool>
        <header-notice />
      </header-tool>
      <!-- 用户信息 -->
      <header-tool>
        <header-user />
      </header-tool>
      <!-- 夜间模式 -->
      <header-tool class="dark-switch">
        <el-switch
          :active-action-icon="MoonOutlined"
          :inactive-action-icon="SunOutlined"
          :model-value="darkMode"
          @update:modelValue="updateDarkMode"
        />
      </header-tool>
    </template>
    <!-- 页签栏右侧下拉菜单 -->
    <template #tabExtra="{ active }">
      <tab-dropdown
        :items="tabExtra"
        @menuClick="(key) => onTabDropdownMenu(key, active)"
      />
    </template>
    <!-- 折叠双侧栏一级 -->
    <template #boxBottom>
      <div :style="{ flexShrink: 0, padding: roundedTheme ? '4px 8px' : 0 }">
        <sidebar-tool @click="updateCompact(!compact)">
          <el-icon style="transform: scale(1.15)">
            <menu-unfold-outlined v-if="compact" />
            <menu-fold-outlined v-else />
          </el-icon>
        </sidebar-tool>
      </div>
    </template>
    <!-- 全局页脚 -->
    <template #footer>
      <page-footer />
    </template>
    <!-- 菜单图标 -->
    <template #icon="{ icon, item }">
      <el-icon v-if="icon" v-bind="item.meta?.props?.iconProps || {}">
        <component :is="icon" :style="item.meta?.props?.iconStyle" />
      </el-icon>
    </template>
  </ele-pro-layout>
</template>

<script setup>
  import { ref, computed, shallowRef } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import {
    HeaderTool,
    SidebarTool,
    TabDropdown,
    requestFullscreen,
    exitFullscreen,
    checkFullscreen,
    EleMessage
  } from 'ele-admin-plus/es';
  import {
    RefreshRight,
    Close,
    Back,
    Right,
    Remove,
    CircleClose
  } from '@element-plus/icons-vue';
  import {
    CompressOutlined,
    ExpandOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoonOutlined,
    SunOutlined
  } from '@/components/icons';
  import {
    PROJECT_NAME,
    HOME_PATH,
    REDIRECT_PATH,
    TAB_KEEP_ALIVE
  } from '@/config/setting';
  import { useUserStore } from '@/store/modules/user';
  import { useThemeStore } from '@/store/modules/theme';
  import { useMobileDevice } from '@/utils/use-mobile';
  import { usePageTab } from '@/utils/use-page-tab';
  import RouterLayout from '@/components/RouterLayout/index.vue';
  import HeaderUser from './components/header-user.vue';
  import HeaderNotice from './components/header-notice.vue';
  import PageFooter from './components/page-footer.vue';

  const { push } = useRouter();
  const {
    addPageTab,
    removePageTab,
    removeAllPageTab,
    removeLeftPageTab,
    removeRightPageTab,
    removeOtherPageTab,
    reloadPageTab,
    setPageTabs
  } = usePageTab();
  const { mobileDevice } = useMobileDevice();
  const userStore = useUserStore();
  const themeStore = useThemeStore();

  // 菜单数据
  const { menus } = storeToRefs(userStore);

  // 布局风格
  const {
    tabs,
    collapse,
    compact,
    maximized,
    tabBar,
    layout,
    sidebarLayout,
    headerStyle,
    sidebarStyle,
    tabStyle,
    fixedHeader,
    fixedSidebar,
    fixedBody,
    fluid,
    logoInHeader,
    colorfulIcon,
    transitionName,
    uniqueOpened,
    fixedHome,
    roundedTheme,
    darkMode
  } = storeToRefs(themeStore);

  // 是否全屏
  const isFullscreen = ref(false);

  // 页签右键菜单
  const tabContext = shallowRef([
    {
      title: '刷新当前',
      command: 'reload',
      icon: RefreshRight
    },
    {
      title: '关闭当前',
      command: 'close',
      icon: Close
    },
    {
      title: '关闭左侧',
      command: 'left',
      icon: Back,
      divided: true
    },
    {
      title: '关闭右侧',
      command: 'right',
      icon: Right
    },
    {
      title: '关闭其它',
      command: 'other',
      icon: Remove,
      divided: true
    },
    {
      title: '关闭全部',
      command: 'all',
      icon: CircleClose
    }
  ]);

  // 页签栏右侧下拉菜单
  const tabExtra = computed(() => {
    const isMax = maximized.value;
    return [
      {
        title: isMax ? '退出全屏' : '内容全屏',
        command: 'fullscreen',
        icon: isMax ? CompressOutlined : ExpandOutlined,
        iconStyle: { transform: 'scale(0.8)' }
      },
      ...tabContext.value
    ];
  });

  /* 侧栏折叠切换 */
  const updateCollapse = (value) => {
    themeStore.setCollapse(value);
  };

  /* 双侧栏一级折叠切换 */
  const updateCompact = (value) => {
    themeStore.setCompact(value);
  };

  /* 内容区全屏切换 */
  const updateMaximized = (value) => {
    themeStore.setMaximized(value);
  };

  /* 页签点击事件 */
  const onTabClick = (option) => {
    const { key, active, item } = option;
    const path = item?.fullPath || key;
    if (key !== active && path) {
      push(path);
    }
  };

  /* 内容区尺寸改变事件 */
  const onBodySizeChange = ({ width }) => {
    themeStore.setContentWidth(width ?? null);
    isFullscreen.value = checkFullscreen();
  };

  /* 全屏切换 */
  const toggleFullscreen = () => {
    if (isFullscreen.value) {
      exitFullscreen();
      isFullscreen.value = false;
      return;
    }
    try {
      requestFullscreen();
      isFullscreen.value = true;
    } catch (e) {
      console.error(e);
      EleMessage.error('您的浏览器不支持全屏模式');
    }
  };

  /* 页签右键菜单点击事件 */
  const onTabContextMenu = (option) => {
    const { command, key, item, active } = option;
    if (command === 'reload') {
      reloadPageTab({ fullPath: item?.fullPath || key });
    } else if (command === 'close') {
      removePageTab({ key, active });
    } else if (command === 'left') {
      removeLeftPageTab({ key, active });
    } else if (command === 'right') {
      removeRightPageTab({ key, active });
    } else if (command === 'other') {
      removeOtherPageTab({ key, active });
    } else if (command === 'all') {
      removeAllPageTab({ key, active });
    }
  };

  /* 页签栏右侧下拉菜单点击事件 */
  const onTabDropdownMenu = (command, active) => {
    if (command === 'reload') {
      reloadPageTab();
    } else if (command === 'fullscreen') {
      updateMaximized(!maximized.value);
    } else {
      onTabContextMenu({ command, key: active, active });
    }
  };

  /* 切换暗黑模式 */
  const updateDarkMode = (value) => {
    themeStore.setDarkMode(value);
  };
</script>

<script>
  import * as MenuIcons from './menu-icons';

  export default {
    name: 'Layout',
    components: MenuIcons
  };
</script>

<style lang="scss" scoped>
  .dark-switch {
    padding: 0 6px;
    position: relative;

    :deep(.el-switch) {
      height: 22px;
      line-height: 22px;
      position: static;

      .el-switch__core {
        --el-switch-off-color: var(--el-border-color-extra-light);
        --el-switch-on-color: var(--el-border-color-extra-light);
        height: 22px;
        border-radius: 11px;
        border: 1px solid var(--el-border-color);

        .el-switch__action {
          color: var(--el-text-color-regular);
          background: var(--el-bg-color);
          width: 18px;
          height: 18px;
          font-size: 12px;
        }
      }

      &.is-checked .el-switch__core .el-switch__action {
        left: calc(100% - 18px);
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  }
</style>
