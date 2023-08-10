<!-- 我的任务 -->
<template>
  <ele-card :header="title" :body-style="{ padding: '7px', height: '370px' }">
    <template #extra>
      <more-icon @command="onCommand" />
    </template>
    <el-scrollbar :view-style="{ position: 'relative', zIndex: 1 }">
      <ele-table class="task-table" size="large">
        <colgroup>
          <col width="38" />
          <col width="78" />
          <col />
          <col width="80" />
        </colgroup>
        <thead style="position: sticky; top: 0; z-index: 2">
          <tr>
            <th style="position: sticky; left: 0; z-index: 1"></th>
            <th style="text-align: center">优先级</th>
            <th>任务名称</th>
            <th style="text-align: center">状态</th>
          </tr>
        </thead>
        <vue-draggable
          tag="tbody"
          item-key="id"
          v-model="taskList"
          handle=".sort-handle"
          :animation="300"
          :set-data="() => void 0"
        >
          <template #item="{ element }">
            <tr>
              <td
                :style="{
                  textAlign: 'center',
                  paddingLeft: 0,
                  paddingRight: 0,
                  position: 'sticky',
                  left: 0,
                  zIndex: 1
                }"
              >
                <ele-text
                  :icon="Rank"
                  :icon-style="{ transform: 'scale(1.26)' }"
                  type="placeholder"
                  class="sort-handle"
                />
              </td>
              <td style="text-align: center">
                <el-tag
                  v-if="element.priority === 1"
                  type="danger"
                  :disable-transitions="true"
                >
                  {{ element.priority }}
                </el-tag>
                <el-tag
                  v-else-if="element.priority === 2"
                  type="warning"
                  :disable-transitions="true"
                >
                  {{ element.priority }}
                </el-tag>
                <el-tag v-else :disable-transitions="true">
                  {{ element.priority }}
                </el-tag>
              </td>
              <td>
                <ele-ellipsis style="line-height: 1">
                  <el-link type="primary" :underline="false">
                    {{ element.taskName }}
                  </el-link>
                </ele-ellipsis>
              </td>
              <td style="text-align: center">
                <ele-text v-if="element.status === 0" type="warning">
                  未开始
                </ele-text>
                <ele-text v-else-if="element.status === 1" type="success">
                  进行中
                </ele-text>
                <ele-text v-else-if="element.status === 2" type="info" deleted>
                  已完成
                </ele-text>
              </td>
            </tr>
          </template>
        </vue-draggable>
      </ele-table>
    </el-scrollbar>
  </ele-card>
</template>

<script setup>
  import { ref } from 'vue';
  import VueDraggable from 'vuedraggable';
  import { Rank } from '@element-plus/icons-vue';
  import MoreIcon from './more-icon.vue';

  defineProps({
    title: String
  });

  const emit = defineEmits(['command']);

  // 我的任务数据
  const taskList = ref([]);

  /* 查询我的任务 */
  const queryTaskList = () => {
    taskList.value = [
      {
        id: 1,
        priority: 1,
        taskName: '解决项目一的bug',
        status: 0
      },
      {
        id: 2,
        priority: 2,
        taskName: '解决项目二的bug',
        status: 0
      },
      {
        id: 3,
        priority: 2,
        taskName: '解决项目三的bug',
        status: 1
      },
      {
        id: 4,
        priority: 3,
        taskName: '解决项目四的bug',
        status: 1
      },
      {
        id: 5,
        priority: 3,
        taskName: '解决项目五的bug',
        status: 2
      },
      {
        id: 6,
        priority: 3,
        taskName: '解决项目六的bug',
        status: 2
      }
    ];
  };

  const onCommand = (command) => {
    emit('command', command);
  };

  queryTaskList();
</script>

<style lang="scss" scoped>
  .task-table {
    table-layout: fixed;
    min-width: 300px;

    .sort-handle {
      cursor: move;
    }

    .el-tag {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }

    tr.sortable-ghost {
      opacity: 0;
    }
  }
</style>
