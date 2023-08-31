<template>
  <dict-data-search
    ref="searchRef"
    style="margin-bottom: -14px"
    @search="reload"
  />
  <!-- 表格 -->
  <ele-pro-table
    ref="tableRef"
    row-key="dictCode"
    :columns="columns"
    :datasource="datasource"
    v-model:selections="selections"
    highlight-current-row
    cache-key="systemDictDataTable"
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
        <el-button class="ele-btn-icon" :icon="Download" @click="exportData">
          导出
        </el-button>
      </el-space>
    </template>
    <template #status="{ row }">
      <dict-data
        code="sys_normal_disable"
        type="tag"
        :model-value="row.status"
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
          :title="'是否确认删除数据标签为“' + row.dictLabel + '”的数据项？'"
          :popper-options="{
            modifiers: [{ name: 'offset', options: { offset: [20, 6] } }]
          }"
          @confirm="remove(row)"
        >
          <template #reference>
            <el-link type="danger" :underline="false">删除</el-link>
          </template>
        </ele-popconfirm>
      </el-space>
    </template>
  </ele-pro-table>
  <!-- 编辑弹窗 -->
  <dict-data-edit
    v-model="showEdit"
    :data="current"
    :dict-type="dictType"
    @done="reload"
  />
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { Plus, Delete, Download } from '@element-plus/icons-vue';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from 'ele-admin-plus/es';
  import DictDataSearch from './dict-data-search.vue';
  import DictDataEdit from './dict-data-edit.vue';
  import {
    pageDictDatas,
    removeDictData,
    removeDictDataBatch,
    exportDictDatas
  } from '@/api/system/dict-data';

  const props = defineProps({
    // 字典类型
    dictType: String
  });

  // 搜索栏实例
  const searchRef = ref(null);

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
      prop: 'dictLabel',
      label: '数据标签',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'dictValue',
      label: '数据键值',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'dictSort',
      label: '显示排序',
      width: 110,
      align: 'center'
    },
    {
      prop: 'status',
      label: '状态',
      width: 90,
      align: 'center',
      showOverflowTooltip: true,
      slot: 'status'
    },
    {
      prop: 'remark',
      label: '备注',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'createTime',
      label: '创建时间',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      columnKey: 'action',
      label: '操作',
      width: 130,
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

  // 表格数据源
  const datasource = ({ page, limit, where, orders }) => {
    return pageDictDatas({
      ...where,
      ...orders,
      pageNum: page,
      pageSize: limit,
      dictType: props.dictType
    });
  };

  /* 刷新表格 */
  const reload = (where) => {
    tableRef.value?.reload?.({ page: 1, where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 删除单个 */
  const remove = (row) => {
    const loading = EleMessage.loading('请求中..');
    removeDictData(row.dictCode)
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
    const ids = selections.value.map((d) => d.dictCode);
    const names = selections.value.map((d) => d.dictLabel).join();
    ElMessageBox.confirm(
      `是否确认删除数据标签为"${names}"的数据项?`,
      '系统提示',
      {
        type: 'warning',
        draggable: true
      }
    )
      .then(() => {
        const loading = EleMessage.loading('请求中..');
        removeDictDataBatch(ids)
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
    tableRef.value?.fetch?.(({ where, orders }) => {
      exportDictDatas({ ...where, ...orders })
        .then(() => {
          loading.close();
        })
        .catch((e) => {
          loading.close();
          EleMessage.error(e.message);
        });
    });
  };

  // 监听字典id变化
  watch(
    () => props.dictType,
    () => {
      searchRef.value?.resetFields?.();
      reload({});
    }
  );
</script>
