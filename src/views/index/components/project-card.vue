<!-- 项目进度 -->
<template>
  <ele-card :header="title" :body-style="{ padding: '12px', height: '370px' }">
    <template #extra>
      <more-icon @command="onCommand" />
    </template>
    <ele-pro-table
      :height="350"
      row-key="id"
      :columns="columns"
      :datasource="projectList"
      :pagination="false"
      :toolbar="false"
      size="large"
      class="project-table"
    >
      <template #projectName="{ row }">
        <ele-ellipsis :tooltip="false">
          <el-link type="primary" :underline="false">
            {{ row.projectName }}
          </el-link>
        </ele-ellipsis>
      </template>
      <template #status="{ row }">
        <ele-text v-if="row.status === 0" type="success">进行中</ele-text>
        <ele-text v-else-if="row.status === 1" type="danger">已延期</ele-text>
        <ele-text v-else-if="row.status === 2" type="warning">
          未开始
        </ele-text>
        <ele-text v-else-if="row.status === 3" type="info">已结束</ele-text>
      </template>
      <template #progress="{ row }">
        <el-progress :percentage="row.progress" />
      </template>
    </ele-pro-table>
  </ele-card>
</template>

<script setup>
  import { ref } from 'vue';
  import MoreIcon from './more-icon.vue';

  defineProps({
    title: String
  });

  const emit = defineEmits(['command']);

  // 表格列配置
  const columns = ref([
    {
      type: 'index',
      columnKey: 'index',
      width: 48,
      align: 'center',
      showOverflowTooltip: true,
      fixed: 'left'
    },
    {
      prop: 'projectName',
      label: '项目名称',
      slot: 'projectName',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'startDate',
      label: '开始时间',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'endDate',
      label: '结束时间',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'status',
      label: '状态',
      slot: 'status',
      align: 'center',
      width: 90
    },
    {
      prop: 'progress',
      label: '进度',
      width: 180,
      align: 'center',
      slot: 'progress'
    }
  ]);

  // 项目进度数据
  const projectList = ref([]);

  /* 查询项目进度 */
  const queryProjectList = () => {
    projectList.value = [
      {
        id: 1,
        projectName: '项目000000001',
        status: 0,
        startDate: '2020-03-01',
        endDate: '2020-06-01',
        progress: 30
      },
      {
        id: 2,
        projectName: '项目000000002',
        status: 0,
        startDate: '2020-03-01',
        endDate: '2020-08-01',
        progress: 10
      },
      {
        id: 3,
        projectName: '项目000000003',
        status: 1,
        startDate: '2020-01-01',
        endDate: '2020-05-01',
        progress: 60
      },
      {
        id: 4,
        projectName: '项目000000004',
        status: 1,
        startDate: '2020-06-01',
        endDate: '2020-10-01',
        progress: 0
      },
      {
        id: 5,
        projectName: '项目000000005',
        status: 2,
        startDate: '2020-03-01',
        endDate: '2020-07-01',
        progress: 100
      },
      {
        id: 6,
        projectName: '项目000000006',
        status: 3,
        startDate: '2020-02-01',
        endDate: '2020-06-01',
        progress: 100
      }
    ];
  };

  const onCommand = (command) => {
    emit('command', command);
  };

  queryProjectList();
</script>

<style lang="scss" scoped>
  .project-table {
    :deep(.el-table__inner-wrapper::before) {
      background-color: transparent;
    }

    :deep(.el-progress__text) {
      font-size: 12px !important;
    }
  }
</style>
