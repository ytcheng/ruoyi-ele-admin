<template>
  <ele-modal
    :width="880"
    title="导入表"
    :body-style="{ padding: '4px 16px' }"
    :destroy-on-close="true"
    :model-value="modelValue"
    @update:modelValue="updateModelValue"
  >
    <gen-import-search @search="reload" />
    <ele-pro-table
      ref="tableRef"
      row-key="tableName"
      :columns="columns"
      :datasource="datasource"
      v-model:selections="selections"
      highlight-current-row
      :toolbar="false"
      :pagination="{ pageSize: 6, pageSizes: [6, 10, 20, 40, 100] }"
      :bottom-line="false"
    />
    <template #footer>
      <el-button @click="updateModelValue(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="save">
        保存
      </el-button>
    </template>
  </ele-modal>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import GenImportSearch from './gen-import-search.vue';
  import { pageGenDbs, importTables } from '@/api/tool/gen';

  const emit = defineEmits(['update:modelValue', 'done']);

  const props = defineProps({
    // 是否显示
    modelValue: Boolean
  });

  // 提交状态
  const loading = ref(false);

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
      prop: 'tableName',
      label: '表名称',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'tableComment',
      label: '表描述',
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
      prop: 'updateTime',
      label: '更新时间',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    }
  ]);

  // 表格选中数据
  const selections = ref([]);

  // 表格数据源
  const datasource = ({ page, limit, where }) => {
    return pageGenDbs({ ...where, pageNum: page, pageSize: limit });
  };

  /* 搜索 */
  const reload = (where) => {
    tableRef.value?.reload?.({ page: 1, where });
  };

  /* 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  /* 导入 */
  const save = () => {
    if (!selections.value.length) {
      EleMessage.error('请选择要导入的表');
      return;
    }
    loading.value = true;
    const tables = selections.value.map((d) => d.tableName).join();
    importTables({ tables })
      .then((msg) => {
        loading.value = false;
        EleMessage.success(msg);
        updateModelValue(false);
        emit('done');
      })
      .catch((e) => {
        loading.value = false;
        EleMessage.error(e.message);
      });
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
