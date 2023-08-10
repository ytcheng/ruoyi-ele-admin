<template>
  <el-config-provider :locale="zh_CN">
    <ele-config-provider :license="LICENSE_CODE" :table="tableConfig">
      <ele-app>
        <router-view />
      </ele-app>
    </ele-config-provider>
  </el-config-provider>
</template>

<script setup>
  import { ref } from 'vue';
  import { LICENSE_CODE } from '@/config/setting';
  import zh_CN from 'element-plus/es/locale/lang/zh-cn';
  import dayjs from 'dayjs';
  import 'dayjs/locale/zh-cn';

  dayjs.locale('zh-cn');

  // 高级表格全局配置
  const tableConfig = ref({
    response: {
      dataName: 'rows',
      countName: 'total'
    }
  });
</script>
