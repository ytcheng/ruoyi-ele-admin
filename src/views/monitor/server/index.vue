<template>
  <ele-page>
    <el-row :gutter="16">
      <el-col :md="12" :sm="24" :xs="24">
        <ele-card>
          <template #header>
            <el-icon :size="17" style="vertical-align: -2px; margin-right: 8px">
              <Cpu />
            </el-icon>
            <span>CPU</span>
          </template>
          <ele-loading :loading="loading">
            <ele-table>
              <colgroup>
                <col width="120px" />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>属性</th>
                  <th style="text-align: center">值</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>核心数</td>
                  <td style="text-align: center">{{ data.cpu?.cpuNum }}</td>
                </tr>
                <tr>
                  <td>用户使用率</td>
                  <td style="text-align: center">{{ data.cpu?.used }}%</td>
                </tr>
                <tr>
                  <td>系统使用率</td>
                  <td style="text-align: center">{{ data.cpu?.sys }}%</td>
                </tr>
                <tr>
                  <td>当前空闲率</td>
                  <td style="text-align: center">{{ data.cpu?.free }}%</td>
                </tr>
              </tbody>
            </ele-table>
          </ele-loading>
        </ele-card>
      </el-col>
      <el-col :md="12" :sm="24" :xs="24">
        <ele-card>
          <template #header>
            <el-icon :size="17" style="vertical-align: -3px; margin-right: 8px">
              <Odometer />
            </el-icon>
            <span>内存</span>
          </template>
          <ele-loading :loading="loading">
            <ele-table>
              <colgroup>
                <col width="120px" />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>属性</th>
                  <th style="text-align: center">内存</th>
                  <th style="text-align: center">JVM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>总内存</td>
                  <td style="text-align: center">{{ data.mem?.total }}G</td>
                  <td style="text-align: center">{{ data.jvm?.total }}M</td>
                </tr>
                <tr>
                  <td>已用内存</td>
                  <td style="text-align: center">{{ data.mem?.used }}G</td>
                  <td style="text-align: center">{{ data.jvm?.used }}M</td>
                </tr>
                <tr>
                  <td>剩余内存</td>
                  <td style="text-align: center">{{ data.mem?.free }}G</td>
                  <td style="text-align: center">{{ data.jvm?.free }}M</td>
                </tr>
                <tr>
                  <td>使用率</td>
                  <td style="text-align: center">
                    <ele-text :type="data.mem?.usage > 80 ? 'danger' : void 0">
                      {{ data.mem?.usage }}%
                    </ele-text>
                  </td>
                  <td style="text-align: center">
                    <ele-text :type="data.jvm?.usage > 80 ? 'danger' : void 0">
                      {{ data.jvm?.usage }}%
                    </ele-text>
                  </td>
                </tr>
              </tbody>
            </ele-table>
          </ele-loading>
        </ele-card>
      </el-col>
    </el-row>
    <ele-card>
      <template #header>
        <el-icon :size="17" style="vertical-align: -2.5px; margin-right: 8px">
          <Monitor />
        </el-icon>
        <span>服务器信息</span>
      </template>
      <ele-loading :loading="loading">
        <el-descriptions
          :border="true"
          :column="mobile ? 1 : 2"
          class="detail-table"
        >
          <el-descriptions-item label="服务器名称">
            <div style="word-break: break-all">
              {{ data.sys?.computerName }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="操作系统">
            <div>{{ data.sys?.osName }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="服务器IP">
            <div>{{ data.sys?.computerIp }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="系统架构">
            <div>{{ data.sys?.osArch }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </ele-loading>
    </ele-card>
    <ele-card>
      <template #header>
        <el-icon :size="17" style="vertical-align: -2.5px; margin-right: 8px">
          <CoffeeCup />
        </el-icon>
        <span>Java虚拟机信息</span>
      </template>
      <ele-loading :loading="loading">
        <el-descriptions
          :border="true"
          :column="mobile ? 1 : 2"
          class="detail-table"
        >
          <el-descriptions-item label="Java名称">
            <div style="word-break: break-all">{{ data.jvm?.name }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="Java版本">
            <div style="word-break: break-all">{{ data.jvm?.version }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="启动时间">
            <div style="word-break: break-all">{{ data.jvm?.startTime }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="运行时长">
            <div style="word-break: break-all">{{ data.jvm?.runTime }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="安装路径" :span="2">
            <div style="word-break: break-all">{{ data.jvm?.home }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="项目路径" :span="2">
            <div style="word-break: break-all">{{ data.sys?.userDir }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="运行参数" :span="2">
            <div style="word-break: break-all">{{ data.jvm?.inputArgs }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </ele-loading>
    </ele-card>
    <ele-card>
      <template #header>
        <el-icon :size="17" style="vertical-align: -3px; margin-right: 8px">
          <PieChart />
        </el-icon>
        <span>磁盘状态</span>
      </template>
      <ele-loading :loading="loading">
        <ele-pro-table
          row-key="dirName"
          :columns="columns"
          :datasource="data.sysFiles || []"
          :pagination="false"
          :toolbar="false"
          :bottom-line="false"
        />
      </ele-loading>
    </ele-card>
  </ele-page>
</template>

<script setup>
  import { ref } from 'vue';
  import {
    Cpu,
    Odometer,
    Monitor,
    CoffeeCup,
    PieChart
  } from '@element-plus/icons-vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { useMobile } from '@/utils/use-mobile';
  import { getServer } from '@/api/monitor/server';

  const { mobile } = useMobile();

  const data = ref({});

  const columns = ref([
    {
      prop: 'dirName',
      label: '盘符路径',
      align: 'center',
      showOverflowTooltip: true
    },
    {
      prop: 'sysTypeName',
      label: '文件系统',
      align: 'center',
      showOverflowTooltip: true
    },
    {
      prop: 'typeName',
      label: '盘符类型',
      align: 'center',
      showOverflowTooltip: true
    },
    {
      prop: 'total',
      label: '总大小',
      align: 'center',
      showOverflowTooltip: true
    },
    {
      prop: 'free',
      label: '可用大小',
      align: 'center',
      showOverflowTooltip: true
    },
    {
      prop: 'used',
      label: '已用大小',
      align: 'center',
      showOverflowTooltip: true
    },
    {
      prop: 'usage',
      label: '已用百分比',
      align: 'center',
      showOverflowTooltip: true
    }
  ]);

  // 请求状态
  const loading = ref(true);

  /* 请求数据 */
  getServer()
    .then((result) => {
      loading.value = false;
      data.value = result;
    })
    .catch((e) => {
      loading.value = false;
      EleMessage.error(e.message);
    });
</script>

<script>
  export default {
    name: 'MonitorServer'
  };
</script>

<style lang="scss" scoped>
  .detail-table :deep(.el-descriptions__label) {
    width: 120px;
    text-align: right;
    font-weight: normal;
  }
</style>
