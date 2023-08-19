<template>
  <el-config-provider :locale="zh_CN">
    <ele-config-provider
      :locale="eleZh_CN"
      :map-key="MAP_KEY"
      :table="tableConfig"
      :license="LICENSE_CODE"
    >
      <ele-app>
        <router-view />
      </ele-app>
    </ele-config-provider>
  </el-config-provider>
</template>

<script setup>
  import { ref } from 'vue';
  import { useThemeStore } from '@/store/modules/theme';
  import { MAP_KEY, LICENSE_CODE } from '@/config/setting';
  import zh_CN from 'element-plus/es/locale/lang/zh-cn';
  import eleZh_CN from 'ele-admin-plus/es/lang/zh_CN';
  import dayjs from 'dayjs';
  import 'dayjs/locale/zh-cn';

  dayjs.locale('zh-cn');

  // 恢复主题
  const themeStore = useThemeStore();
  themeStore.recoverTheme();

  // 高级表格全局配置
  const tableConfig = ref({
    response: {
      dataName: 'rows',
      countName: 'total'
    },
    request: {
      sortName: 'orderByColumn',
      orderName: 'isAsc',
      ascValue: 'ascending',
      descValue: 'descending'
    }
  });
</script>
