<template>
  <ele-page>
    <!-- 搜索表单 -->
    <job-search @search="reload" />
    <ele-card :body-style="{ paddingTop: '8px' }">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="jobId"
        :columns="columns"
        :datasource="datasource"
        v-model:selections="selections"
        highlight-current-row
        :bottom-line="false"
        cache-key="monitorJobTable"
      >
        <template #toolbar>
          <el-space>
            <el-button
              type="primary"
              class="ele-btn-icon"
              :icon="Plus"
              @click="openEdit()"
            >
              新建
            </el-button>
            <el-button
              type="danger"
              class="ele-btn-icon"
              :icon="Delete"
              @click="removeBatch"
            >
              删除
            </el-button>
            <el-button
              class="ele-btn-icon"
              :icon="Download"
              @click="exportData"
            >
              导出
            </el-button>
            <el-button class="ele-btn-icon" :icon="Memo" @click="openLog()">
              日志
            </el-button>
          </el-space>
        </template>
        <template #status="{ row }">
          <el-switch
            size="small"
            :model-value="row.status == 0"
            @change="(checked) => editStatus(checked, row)"
          />
        </template>
        <template #action="{ row }">
          <el-space>
            <el-link type="primary" :underline="false" @click="openEdit(row)">
              修改
            </el-link>
            <el-divider direction="vertical" style="margin: 0" />
            <ele-popconfirm
              :width="226"
              placement="top-end"
              :title="'是否确认删除任务名称为“' + row.jobName + '”的数据项？'"
              :popper-options="{
                modifiers: [{ name: 'offset', options: { offset: [20, 6] } }]
              }"
              @confirm="remove(row)"
            >
              <template #reference>
                <el-link type="danger" :underline="false">删除</el-link>
              </template>
            </ele-popconfirm>
            <el-divider direction="vertical" style="margin: 0" />
            <ele-dropdown
              :items="[
                { title: '执行一次', command: 'execute' },
                { title: '查看详情', command: 'detail' },
                { title: '调度日志', command: 'log' }
              ]"
              @command="(key) => dropClick(key, row)"
            >
              <el-link type="primary" :underline="false">
                <span>更多</span>
                <el-icon
                  :size="12"
                  style="vertical-align: -1px; margin-left: 2px"
                >
                  <arrow-down />
                </el-icon>
              </el-link>
            </ele-dropdown>
          </el-space>
        </template>
      </ele-pro-table>
    </ele-card>
    <!-- 编辑弹窗 -->
    <job-edit v-model="showEdit" :data="current" @done="reload" />
    <!-- 详情弹窗 -->
    <job-detail v-model="showInfo" :data="current" />
    <!-- 调度日志弹窗 -->
    <job-log v-model="showLog" :data="current" />
  </ele-page>
</template>

<script setup>
  import { ref } from 'vue';
  import {
    Plus,
    Delete,
    Download,
    ArrowDown,
    Memo
  } from '@element-plus/icons-vue';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from 'ele-admin-plus/es';
  import JobSearch from './components/job-search.vue';
  import JobEdit from './components/job-edit.vue';
  import JobDetail from './components/job-detail.vue';
  import JobLog from './components/job-log.vue';
  import {
    pageJobs,
    removeJob,
    removeJobs,
    updateJobStatus,
    exportJobs,
    runJob
  } from '@/api/monitor/job';

  // 表格实例
  const tableRef = ref(null);

  // 表格列配置
  const columns = ref([
    {
      type: 'selection',
      columnKey: 'selection',
      width: 48,
      align: 'center',
      fixed: 'left'
    },
    {
      type: 'index',
      columnKey: 'index',
      width: 48,
      align: 'center',
      showOverflowTooltip: true,
      fixed: 'left'
    },
    {
      prop: 'jobName',
      label: '任务名称',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'jobGroup',
      label: '任务组名',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'invokeTarget',
      label: '调用目标字符串',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 140
    },
    {
      prop: 'cronExpression',
      label: 'cron执行表达式',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 140
    },
    {
      prop: 'status',
      label: '状态',
      width: 80,
      align: 'center',
      showOverflowTooltip: true,
      slot: 'status'
    },
    {
      columnKey: 'action',
      label: '操作',
      width: 180,
      align: 'center',
      slot: 'action'
    }
  ]);

  // 表格选中数据
  const selections = ref([]);

  // 当前编辑数据
  const current = ref(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 是否显示查看弹窗
  const showInfo = ref(false);

  // 是否显示调度日志弹窗
  const showLog = ref(false);

  // 表格数据源
  const datasource = ({ page, limit, where }) => {
    return pageJobs({ ...where, pageNum: page, pageSize: limit });
  };

  /* 搜索 */
  const reload = (where) => {
    tableRef.value?.reload?.({ page: 1, where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 详情 */
  const openDetail = (row) => {
    current.value = row;
    showInfo.value = true;
  };

  /* 打开调度日志弹窗 */
  const openLog = (row) => {
    current.value = row ?? null;
    showLog.value = true;
  };

  /* 删除单个 */
  const remove = (row) => {
    const loading = EleMessage.loading('请求中..');
    removeJob(row.jobId)
      .then(() => {
        loading.close();
        EleMessage.success('删除成功');
        reload();
      })
      .catch((e) => {
        loading.close();
        EleMessage.error(e.message);
      });
  };

  /* 批量删除 */
  const removeBatch = () => {
    if (!selections.value.length) {
      EleMessage.error('请至少选择一条数据');
      return;
    }
    const ids = selections.value.map((d) => d.jobId);
    const names = selections.value.map((d) => d.jobName).join();
    ElMessageBox.confirm(
      `是否确认删除任务名称为"${names}"的数据项?`,
      '系统提示',
      { type: 'warning', draggable: true }
    )
      .then(() => {
        const loading = EleMessage.loading('请求中..');
        removeJobs(ids)
          .then(() => {
            loading.close();
            EleMessage.success('删除成功');
            reload();
          })
          .catch((e) => {
            loading.close();
            EleMessage.error(e.message);
          });
      })
      .catch(() => {});
  };

  /* 修改状态 */
  const editStatus = (checked, row) => {
    const status = checked ? '0' : '1';
    updateJobStatus(row.jobId, status)
      .then((msg) => {
        row.status = status;
        EleMessage.success(msg);
      })
      .catch((e) => {
        EleMessage.error(e.message);
      });
  };

  /* 导出数据 */
  const exportData = () => {
    const loading = EleMessage.loading('请求中..');
    tableRef.value?.fetch?.(({ where, orders }) => {
      exportJobs({ ...where, ...orders })
        .then(() => {
          loading.close();
        })
        .catch((e) => {
          loading.close();
          EleMessage.error(e.message);
        });
    });
  };

  /* 下拉菜单点击事件 */
  const dropClick = (key, row) => {
    if (key === 'execute') {
      ElMessageBox.confirm(
        `确认要立即执行一次"${row.jobName}"任务吗?`,
        '系统提示',
        { type: 'warning', draggable: true }
      )
        .then(() => {
          const loading = EleMessage.loading('请求中..');
          runJob(row.jobId, row.jobGroup)
            .then(() => {
              loading.close();
              EleMessage.success('执行成功');
              reload();
            })
            .catch((e) => {
              loading.close();
              EleMessage.error(e.message);
            });
        })
        .catch(() => {});
    } else if (key === 'detail') {
      openDetail(row);
    } else if (key === 'log') {
      openLog(row);
    }
  };
</script>

<script>
  export default {
    name: 'MonitorJob'
  };
</script>
