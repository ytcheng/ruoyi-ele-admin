<template>
  <ele-page>
    <ele-card>
      <template #header>
        <el-icon :size="17" style="vertical-align: -2.5px; margin-right: 8px">
          <Monitor />
        </el-icon>
        <span>基本信息</span>
      </template>
      <ele-loading :loading="loading">
        <el-descriptions
          :border="true"
          :column="mobile ? 1 : 3"
          class="detail-table"
        >
          <el-descriptions-item label="Redis版本">
            <div>{{ data.info?.redis_version }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="运行模式">
            <div>{{ data.info?.redis_mode }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="端口">
            <div>{{ data.info?.tcp_port }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="客户端数">
            <div>{{ data.info?.connected_clients }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="运行时间(天)">
            <div>{{ data.info?.uptime_in_days }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="使用内存">
            <div>{{ data.info?.used_memory_human }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="使用CPU">
            <div>{{ data.info?.used_cpu_user_children }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="内存配置">
            <div>{{ data.info?.maxmemory_human }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="AOF是否开启">
            <div>{{ data.info?.aof_enabled }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="RDB是否成功">
            <div>{{ data.info?.rdb_last_bgsave_status }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="Key数量">
            <div>{{ data.dbSize }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="网络入口/出口">
            <div>{{ data.info?.instantaneous_input_kbps }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </ele-loading>
    </ele-card>
    <el-row :gutter="16">
      <el-col :md="12" :sm="24" :xs="24">
        <ele-card>
          <template #header>
            <el-icon :size="17" style="vertical-align: -2px; margin-right: 8px">
              <PieChart />
            </el-icon>
            <span>命令统计</span>
          </template>
          <v-chart
            ref="commandChartRef"
            :option="commandChartOption"
            style="height: 420px"
          />
        </ele-card>
      </el-col>
      <el-col :md="12" :sm="24" :xs="24">
        <ele-card>
          <template #header>
            <el-icon :size="17" style="vertical-align: -3px; margin-right: 8px">
              <Odometer />
            </el-icon>
            <span>内存信息</span>
          </template>
          <v-chart
            ref="memoryChartRef"
            :option="memoryChartOption"
            style="height: 420px"
          />
        </ele-card>
      </el-col>
    </el-row>
  </ele-page>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import { Odometer, Monitor, PieChart } from '@element-plus/icons-vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { PieChart as PieCharts, GaugeChart } from 'echarts/charts';
  import { TooltipComponent } from 'echarts/components';
  import VChart from 'vue-echarts';
  import { useMobile } from '@/utils/use-mobile';
  import { useEcharts } from '@/utils/use-echarts';
  import { getCache } from '@/api/monitor/cache';

  use([CanvasRenderer, PieCharts, GaugeChart, TooltipComponent]);

  const { mobile } = useMobile();

  const data = ref({});

  // 请求状态
  const loading = ref(true);

  // 命令统计图表
  const commandChartRef = ref(null);

  // 内存信息图表
  const memoryChartRef = ref(null);

  useEcharts([commandChartRef, memoryChartRef]);

  // 命令统计图表配置
  const commandChartOption = reactive({});

  // 内存信息图表配置
  const memoryChartOption = reactive({});

  /* 请求数据 */
  getCache()
    .then((res) => {
      loading.value = false;
      data.value = res;
      const commandStats = res.commandStats || [];
      //
      Object.assign(commandChartOption, {
        tooltip: {
          trigger: 'item',
          confine: true,
          borderWidth: 1
        },
        series: [
          {
            name: '命令',
            type: 'pie',
            radius: ['25%', '70%'],
            center: ['50%', '50%'],
            itemStyle: {
              borderRadius: 8
            },
            label: {
              formatter: '{b}({d}%)'
            },
            data: commandStats.sort((a, b) => a.name.localeCompare(b.name))
          }
        ]
      });
      //
      Object.assign(memoryChartOption, {
        tooltip: {
          trigger: 'item',
          confine: true,
          borderWidth: 1,
          formatter: '{b} <br/>{a} : {c}K'
        },
        series: [
          {
            name: '峰值',
            type: 'gauge',
            min: 0,
            max: 1000,
            progress: {
              show: true,
              roundCap: true
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}K'
            },
            data: [
              {
                value: parseFloat(res.info?.used_memory_human || 0),
                name: '内存消耗'
              }
            ]
          }
        ]
      });
    })
    .catch((e) => {
      loading.value = false;
      EleMessage.error(e.message);
    });
</script>

<script>
  export default {
    name: 'MonitorCache'
  };
</script>

<style lang="scss" scoped>
  .detail-table :deep(.el-descriptions__label) {
    width: 124px;
    text-align: right;
    font-weight: normal;
  }
</style>
