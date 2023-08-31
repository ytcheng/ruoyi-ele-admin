<template>
  <ele-page>
    <!-- 搜索表单 -->
    <dept-search @search="reload" />
    <ele-card :body-style="{ paddingTop: '8px' }">
      <!-- 表格 -->
      <ele-pro-table
        sticky
        ref="tableRef"
        row-key="deptId"
        :columns="columns"
        :datasource="datasource"
        :default-expand-all="true"
        :pagination="false"
        :bottom-line="false"
        cache-key="systemDeptTable"
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
              class="ele-btn-icon"
              :icon="ColumnHeightOutlined"
              @click="expandAll"
            >
              展开全部
            </el-button>
            <el-button
              class="ele-btn-icon"
              :icon="VerticalAlignMiddleOutlined"
              @click="foldAll"
            >
              折叠全部
            </el-button>
          </el-space>
        </template>
        <template #status="{ row }">
          <dict-data
            :model-value="row.status"
            type="tag"
            code="sys_normal_disable"
          />
        </template>
        <template #action="{ row }">
          <el-space>
            <el-link
              type="primary"
              :underline="false"
              @click="openEdit(null, row.deptId)"
            >
              添加
            </el-link>
            <el-divider direction="vertical" style="margin: 0" />
            <el-link type="primary" :underline="false" @click="openEdit(row)">
              修改
            </el-link>
            <el-divider direction="vertical" style="margin: 0" />
            <ele-popconfirm
              :width="226"
              placement="top-end"
              :title="'是否确认删除名称为“' + row.deptName + '”的数据项？'"
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
    <dept-edit
      v-model="showEdit"
      :data="current"
      :parent-id="parentId"
      @done="reload"
    />
  </ele-page>
</template>

<script setup>
  import { ref } from 'vue';
  import { Plus } from '@element-plus/icons-vue';
  import { EleMessage, toTree } from 'ele-admin-plus/es';
  import {
    ColumnHeightOutlined,
    VerticalAlignMiddleOutlined
  } from '@/components/icons';
  import DeptSearch from './components/dept-search.vue';
  import DeptEdit from './components/dept-edit.vue';
  import { listDepts, removeDept } from '@/api/system/dept';

  // 表格实例
  const tableRef = ref(null);

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
      prop: 'deptName',
      label: '部门名称',
      minWidth: 160,
      showOverflowTooltip: true
    },
    {
      prop: 'orderNum',
      label: '排序',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 90
    },
    {
      prop: 'status',
      label: '状态',
      align: 'center',
      showOverflowTooltip: true,
      slot: 'status',
      minWidth: 90
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
      width: 180,
      align: 'center',
      slot: 'action'
    }
  ]);

  // 当前编辑数据
  const current = ref(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 上级菜单id
  const parentId = ref();

  // 表格数据源
  const datasource = async ({ where }) => {
    const data = await listDepts({ ...where });
    return toTree({
      data,
      idField: 'deptId',
      parentIdField: 'parentId'
    });
  };

  /* 刷新表格 */
  const reload = (where) => {
    tableRef.value?.reload?.({ where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row, id) => {
    current.value = row ?? null;
    parentId.value = id;
    showEdit.value = true;
  };

  /* 删除单个 */
  const remove = (row) => {
    const loading = EleMessage.loading('请求中..');
    removeDept(row.deptId)
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

  /* 展开全部 */
  const expandAll = () => {
    tableRef.value?.toggleRowExpansionAll?.(true);
  };

  /* 折叠全部 */
  const foldAll = () => {
    tableRef.value?.toggleRowExpansionAll?.(false);
  };
</script>

<script>
  export default {
    name: 'SystemDept'
  };
</script>
