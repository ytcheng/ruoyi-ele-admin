<template>
  <ele-page>
    <!-- 搜索表单 -->
    <logininfor-search @search="reload" />
    <ele-card :body-style="{ paddingTop: '8px' }">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="infoId"
        :columns="columns"
        :datasource="datasource"
        v-model:selections="selections"
        highlight-current-row
        :bottom-line="false"
        cache-key="systemLogLogininforTable"
      >
        <template #toolbar>
          <el-space>
            <el-button
              type="primary"
              class="ele-btn-icon"
              :icon="Unlock"
              @click="unlock"
            >
              解锁
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
              plain
              type="danger"
              class="ele-btn-icon"
              :icon="Delete"
              @click="removeAll"
            >
              清空
            </el-button>
            <el-button
              class="ele-btn-icon"
              :icon="Download"
              @click="exportData"
            >
              导出
            </el-button>
          </el-space>
        </template>
        <template #status="{ row }">
          <dict-data
            code="sys_common_status"
            type="tag"
            :model-value="row.status"
          />
        </template>
      </ele-pro-table>
    </ele-card>
  </ele-page>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { Delete, Download, Unlock } from '@element-plus/icons-vue';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from 'ele-admin-plus/es';
  import { useDictData } from '@/utils/use-dict-data';
  import LogininforSearch from './components/logininfor-search.vue';
  import {
    pageLogininfors,
    exportLogininfors,
    removeLogininfors,
    clearLogininfors,
    unlockLogininfors
  } from '@/api/monitor/logininfor';

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
        prop: 'userName',
        label: '用户名称',
        sortable: 'custom',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 110
      },
      {
        prop: 'ipaddr',
        label: '登录地址',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 110
      },
      {
        prop: 'loginLocation',
        label: '登录地点',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 110
      },
      {
        prop: 'browser',
        label: '浏览器',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 110
      },
      {
        prop: 'os',
        label: '操作系统',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 110
      },
      {
        columnKey: 'status',
        prop: 'status',
        label: '登录状态',
        width: 110,
        slot: 'status',
        align: 'center',
        filters: statusDicts.value.map((d) => {
          return { text: d.dictLabel, value: d.dictValue };
        }),
        filterMultiple: false
      },
      {
        prop: 'msg',
        label: '操作信息',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 110
      },
      {
        prop: 'loginTime',
        label: '登录日期',
        sortable: 'custom',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 110
      }
    ];
  });

  // 表格选中数据
  const selections = ref([]);

  // 表格数据源
  const datasource = ({ page, limit, where, orders, filters }) => {
    return pageLogininfors({
      ...where,
      ...orders,
      ...filters,
      pageNum: page,
      pageSize: limit
    });
  };

  /* 刷新表格 */
  const reload = (where) => {
    tableRef.value?.reload?.({ page: 1, where });
  };

  /* 导出数据 */
  const exportData = () => {
    const loading = EleMessage.loading('请求中..');
    tableRef.value?.fetch?.(({ where, orders, filters }) => {
      exportLogininfors({ ...where, ...orders, ...filters })
        .then(() => {
          loading.close();
        })
        .catch((e) => {
          loading.close();
          EleMessage.error(e.message);
        });
    });
  };

  /* 批量删除 */
  const removeBatch = () => {
    if (!selections.value.length) {
      EleMessage.error('请至少选择一条数据');
      return;
    }
    const ids = selections.value.map((d) => d.infoId);
    ElMessageBox.confirm(
      `是否确认删除访问编号为"${ids.join()}"的数据项?`,
      '系统提示',
      { type: 'warning', draggable: true, customStyle: { maxWidth: '442px' } }
    )
      .then(() => {
        const loading = EleMessage.loading('请求中..');
        removeLogininfors(ids)
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

  /* 清空 */
  const removeAll = () => {
    ElMessageBox.confirm('是否确认清空所有登录日志数据项？', '系统提示', {
      type: 'warning',
      draggable: true
    })
      .then(() => {
        const loading = EleMessage.loading('请求中..');
        clearLogininfors()
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

  /* 解锁 */
  const unlock = () => {
    if (!selections.value.length) {
      EleMessage.error('请选择一条数据');
      return;
    }
    if (selections.value.length !== 1) {
      EleMessage.error('只能选择一条数据');
      return;
    }
    const userName = selections.value[0].userName;
    ElMessageBox.confirm(`是否确认解锁用户"${userName}"数据项?`, '系统提示', {
      type: 'warning',
      draggable: true
    })
      .then(() => {
        const loading = EleMessage.loading('请求中..');
        unlockLogininfors(userName)
          .then(() => {
            loading.close();
            EleMessage.success(`用户${userName}解锁成功`);
            reload();
          })
          .catch((e) => {
            loading.close();
            EleMessage.error(e.message);
          });
      })
      .catch(() => {});
  };
</script>

<script>
  export default {
    name: 'SystemLogLogininfor'
  };
</script>
