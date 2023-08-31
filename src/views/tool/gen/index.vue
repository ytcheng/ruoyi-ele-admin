<template>
  <ele-page>
    <!-- 搜索表单 -->
    <gen-search @search="reload" />
    <ele-card :body-style="{ paddingTop: '8px' }">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="tableId"
        :columns="columns"
        :datasource="datasource"
        v-model:selections="selections"
        highlight-current-row
        :bottom-line="false"
        cache-key="toolGenTable"
      >
        <template #toolbar>
          <el-space>
            <el-button
              type="primary"
              class="ele-btn-icon"
              :icon="Download"
              @click="generate()"
            >
              生成
            </el-button>
            <el-button
              type="danger"
              class="ele-btn-icon"
              :icon="Delete"
              @click="removeBatch"
            >
              删除
            </el-button>
            <el-button class="ele-btn-icon" :icon="Upload" @click="openImport">
              导入
            </el-button>
          </el-space>
        </template>
        <template #action="{ row }">
          <el-space>
            <el-link
              type="primary"
              :underline="false"
              @click="openPreview(row)"
            >
              预览
            </el-link>
            <el-divider direction="vertical" style="margin: 0" />
            <el-link type="primary" :underline="false" @click="generate(row)">
              生成
            </el-link>
            <el-divider direction="vertical" style="margin: 0" />
            <ele-popconfirm
              :width="226"
              placement="top"
              :title="'确认要强制同步“' + row.tableName + '”的表结构吗？'"
              :popper-options="{
                modifiers: [{ name: 'offset', options: { offset: [0, 6] } }]
              }"
              @confirm="sync(row)"
            >
              <template #reference>
                <el-link type="primary" :underline="false">同步</el-link>
              </template>
            </ele-popconfirm>
            <el-divider direction="vertical" style="margin: 0" />
            <el-link type="primary" :underline="false" @click="openEdit(row)">
              修改
            </el-link>
            <el-divider direction="vertical" style="margin: 0" />
            <ele-popconfirm
              :width="226"
              placement="top-end"
              :title="'是否确认删除表名称为“' + row.tableName + '”的数据项？'"
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
    </ele-card>
    <!-- 编辑弹窗 -->
    <gen-edit v-model="showEdit" :data="current" @done="reload" />
    <!-- 导入弹窗 -->
    <gen-import v-model="showImport" @done="reload" />
    <!-- 预览弹窗 -->
    <gen-preview :id="current?.tableId" v-model="showPreview" />
  </ele-page>
</template>

<script setup>
  import { ref } from 'vue';
  import { Delete, Download, Upload } from '@element-plus/icons-vue';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from 'ele-admin-plus/es';
  import GenSearch from './components/gen-search.vue';
  import GenEdit from './components/gen-edit.vue';
  import GenImport from './components/gen-import.vue';
  import GenPreview from './components/gen-preview.vue';
  import {
    pageGens,
    removeGen,
    removeGens,
    synchDb,
    genCode,
    genCodeZip
  } from '@/api/tool/gen';

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
      prop: 'className',
      label: '实体',
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
    },
    {
      columnKey: 'action',
      label: '操作',
      width: 248,
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

  // 是否显示导入弹窗
  const showImport = ref(false);

  // 是否显示预览弹窗
  const showPreview = ref(false);

  // 表格数据源
  const datasource = ({ page, limit, where }) => {
    return pageGens({ ...where, pageNum: page, pageSize: limit });
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

  /* 打开导入弹窗 */
  const openImport = () => {
    showImport.value = true;
  };

  /* 打开预览弹窗 */
  const openPreview = (row) => {
    current.value = row ?? null;
    showPreview.value = true;
  };

  /* 删除单个 */
  const remove = (row) => {
    const loading = EleMessage.loading('请求中..');
    removeGen(row.tableId)
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
    const ids = selections.value.map((d) => d.tableId);
    const names = selections.value.map((d) => d.tableName).join();
    ElMessageBox.confirm(
      `是否确认删除表名称为"${names}"的数据项?`,
      '系统提示',
      { type: 'warning', draggable: true }
    )
      .then(() => {
        const loading = EleMessage.loading('请求中..');
        removeGens(ids)
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

  /* 同步 */
  const sync = (row) => {
    const loading = EleMessage.loading('请求中..');
    synchDb(row.tableName)
      .then(() => {
        loading.close();
        EleMessage.success('同步成功');
        reload();
      })
      .catch((e) => {
        loading.close();
        EleMessage.error(e.message);
      });
  };

  /* 生成 */
  const generate = (row) => {
    if (!row && !selections.value.length) {
      EleMessage.error('请选择要生成的数据');
      return;
    }
    const loading = EleMessage.loading('请求中..');
    if (row && row.genType == '1') {
      genCode(row.tableName)
        .then(() => {
          loading.close();
          EleMessage.success('成功生成到自定义路径:' + row.genPath);
        })
        .catch((e) => {
          loading.close();
          EleMessage.error(e.message);
        });
    } else {
      const names = selections.value.map((d) => d.tableName).join();
      genCodeZip({ tables: row ? row.tableName : names })
        .then(() => {
          loading.close();
        })
        .catch((e) => {
          loading.close();
          EleMessage.error(e.message);
        });
    }
  };
</script>

<script>
  export default {
    name: 'ToolGen'
  };
</script>
