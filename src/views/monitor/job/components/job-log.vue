<template>
  <ele-drawer
    :size="1200"
    style="max-width: 100%"
    title="调度日志"
    :append-to-body="true"
    :destroy-on-close="true"
    :model-value="modelValue"
    @update:modelValue="updateModelValue"
  >
    <job-log-search :data="data" style="margin-bottom: -8px" @search="reload" />
    <ele-pro-table
      ref="tableRef"
      row-key="jobLogId"
      :columns="columns"
      :datasource="datasource"
      v-model:selections="selections"
      highlight-current-row
      :bottom-line="false"
      cache-key="monitorJobLogTable"
    >
      <template #toolbar>
        <el-space>
          <el-button
            type="danger"
            class="ele-btn-icon"
            :icon="Delete"
            @click="removeBatch"
          >
            删除
          </el-button>
          <el-button
            plain
            type="danger"
            class="ele-btn-icon"
            :icon="Delete"
            @click="removeAll"
          >
            清空
          </el-button>
          <el-button class="ele-btn-icon" :icon="Download" @click="exportData">
            导出
          </el-button>
        </el-space>
      </template>
      <template #jobGroup="{ row }">
        <dict-data
          code="sys_job_group"
          type="tag"
          :model-value="row.jobGroup"
        />
      </template>
      <template #status="{ row }">
        <dict-data
          code="sys_common_status"
          type="tag"
          :model-value="row.status"
        />
      </template>
      <template #action="{ row }">
        <el-link type="primary" :underline="false" @click="openDetail(row)">
          详情
        </el-link>
      </template>
    </ele-pro-table>
  </ele-drawer>
  <!-- 详情弹窗 -->
  <job-log-detail v-model="showInfo" :data="current" />
</template>

<script setup>
  import { ref, watch, computed } from 'vue';
  import { Delete, Download } from '@element-plus/icons-vue';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from 'ele-admin-plus/es';
  import { useDictData } from '@/utils/use-dict-data';
  import JobLogSearch from './job-log-search.vue';
  import JobLogDetail from './job-log-detail.vue';
  import {
    pageJobLogs,
    removeJobLogs,
    exportJobLogs,
    clearJoblogs
  } from '@/api/monitor/job-log';

  const emit = defineEmits(['update:modelValue']);

  const props = defineProps({
    // 是否显示
    modelValue: Boolean,
    // 定时任务
    data: Object
  });

  // 字典数据
  const [statusDicts] = useDictData(['sys_common_status']);

  // 表格实例
  const tableRef = ref(null);

  // 表格列配置
  const columns = computed(() => {
    return [
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
        minWidth: 110,
        slot: 'jobGroup'
      },
      {
        prop: 'invokeTarget',
        label: '调用目标字符串',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 140
      },
      {
        prop: 'jobMessage',
        label: '日志信息',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 110
      },
      {
        columnKey: 'status',
        prop: 'status',
        label: '执行状态',
        width: 110,
        align: 'center',
        showOverflowTooltip: true,
        slot: 'status',
        filters: statusDicts.value.map((d) => {
          return { text: d.dictLabel, value: d.dictValue };
        }),
        filterMultiple: false
      },
      {
        prop: 'createTime',
        label: '执行时间',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 110
      },
      {
        columnKey: 'action',
        label: '操作',
        width: 80,
        align: 'center',
        slot: 'action',
        fixed: 'right'
      }
    ];
  });

  // 表格选中数据
  const selections = ref([]);

  // 当前选中数据
  const current = ref({});

  // 是否显示查看弹窗
  const showInfo = ref(false);

  // 表格数据源
  const datasource = ({ page, limit, where, filters }) => {
    const params = { ...where, ...filters, pageNum: page, pageSize: limit };
    if (props.data) {
      params.jobName = props.data?.jobName;
      params.jobGroup = props.data?.jobGroup;
    }
    return pageJobLogs(params);
  };

  /* 搜索 */
  const reload = (where) => {
    tableRef.value?.reload?.({ where });
  };

  /* 批量删除 */
  const removeBatch = () => {
    if (!selections.value.length) {
      EleMessage.error('请至少选择一条数据');
      return;
    }
    const ids = selections.value.map((d) => d.jobLogId);
    ElMessageBox.confirm(
      `是否确认删除调度日志编号为"${ids.join()}"的数据项?`,
      '系统提示',
      { type: 'warning', draggable: true }
    )
      .then(() => {
        const loading = EleMessage.loading('请求中..');
        removeJobLogs(ids)
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

  /* 导出数据 */
  const exportData = () => {
    const loading = EleMessage.loading('请求中..');
    tableRef.value?.fetch?.(({ where, filters }) => {
      const params = { ...where, ...filters };
      if (props.data) {
        params.jobName = props.data?.jobName;
        params.jobGroup = props.data?.jobGroup;
      }
      exportJobLogs(params)
        .then(() => {
          loading.close();
        })
        .catch((e) => {
          loading.close();
          EleMessage.error(e.message);
        });
    });
  };

  /* 清空 */
  const removeAll = () => {
    ElMessageBox.confirm('是否确认清空所有调度日志数据项？', '系统提示', {
      type: 'warning',
      draggable: true
    })
      .then(() => {
        const loading = EleMessage.loading('请求中..');
        clearJoblogs()
          .then(() => {
            loading.close();
            EleMessage.success('清空成功');
            reload();
          })
          .catch((e) => {
            loading.close();
            EleMessage.error(e.message);
          });
      })
      .catch(() => {});
  };

  /* 详情 */
  const openDetail = (row) => {
    current.value = row;
    showInfo.value = true;
  };

  /* 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  watch(
    () => props.modelValue,
    (modelValue) => {
      if (modelValue) {
        reload();
      } else {
        selections.value = [];
      }
    }
  );
</script>
