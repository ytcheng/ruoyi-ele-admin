<!-- 最新动态 -->
<template>
  <ele-card :header="title" :body-style="{ padding: '6px 0', height: '370px' }">
    <template #extra>
      <more-icon @command="onCommand" />
    </template>
    <el-scrollbar :view-style="{ padding: '20px 20px 0 20px' }">
      <el-timeline :reverse="false" class="demo-timeline">
        <el-timeline-item
          v-for="item in activities"
          :key="item.id"
          :timestamp="item.time"
          :type="item.type"
          :hollow="true"
        >
          {{ item.title }}
        </el-timeline-item>
      </el-timeline>
    </el-scrollbar>
  </ele-card>
</template>

<script setup>
  import { ref } from 'vue';
  import MoreIcon from './more-icon.vue';

  defineProps({
    title: String
  });

  const emit = defineEmits(['command']);

  // 最新动态数据
  const activities = ref([]);

  /* 查询最新动态 */
  const queryActivities = () => {
    activities.value = [
      {
        id: 1,
        title: 'SunSmile 解决了bug 登录提示操作失败',
        time: '20:30'
      },
      {
        id: 2,
        title: 'Jasmine 解决了bug 按钮颜色与设计不符',
        time: '19:30'
      },
      {
        id: 3,
        title: '项目经理 指派了任务 解决项目一的bug',
        time: '18:30',
        type: 'primary'
      },
      {
        id: 4,
        title: '项目经理 指派了任务 解决项目二的bug',
        time: '17:30',
        type: 'primary'
      },
      {
        id: 5,
        title: '项目经理 指派了任务 解决项目三的bug',
        time: '16:30',
        type: 'primary'
      },
      {
        id: 6,
        title: '项目经理 指派了任务 解决项目四的bug',
        time: '15:30'
      },
      {
        id: 7,
        title: '项目经理 指派了任务 解决项目五的bug',
        time: '14:30'
      },
      {
        id: 8,
        title: '项目经理 指派了任务 解决项目六的bug',
        time: '12:30'
      },
      {
        id: 9,
        title: '项目经理 指派了任务 解决项目七的bug',
        time: '11:30',
        type: 'primary'
      },
      {
        id: 10,
        title: '项目经理 指派了任务 解决项目八的bug',
        time: '10:30'
      },
      {
        id: 11,
        title: '项目经理 指派了任务 解决项目九的bug',
        time: '09:30',
        type: 'success'
      },
      {
        id: 12,
        title: '项目经理 指派了任务 解决项目十的bug',
        time: '08:30',
        type: 'danger'
      }
    ];
  };

  const onCommand = (command) => {
    emit('command', command);
  };

  queryActivities();
</script>

<style lang="scss" scoped>
  /* 时间轴 */
  .demo-timeline {
    padding-left: 0;

    :deep(.el-timeline-item__wrapper) {
      display: flex;

      .el-timeline-item__timestamp {
        order: 0;
        flex-shrink: 0;
        margin: 0 16px 0 0;
        height: 22px;
        line-height: 22px;
        font-size: 14px;
      }

      .el-timeline-item__content {
        order: 1;
        flex: 1;
      }
    }

    :deep(.el-timeline-item__node) {
      top: 3px;
      --el-color-white: var(--el-bg-color-overlay);
    }

    :deep(.el-timeline-item__tail) {
      top: 3px;
    }
  }
</style>
