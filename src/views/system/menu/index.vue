<template>
  <ele-page>
    <!-- 搜索表单 -->
    <menu-search @search="reload" />
    <ele-card :body-style="{ paddingTop: '8px' }">
      <!-- 表格 -->
      <ele-pro-table
        sticky
        ref="tableRef"
        row-key="menuId"
        :columns="columns"
        :datasource="datasource"
        :default-expand-all="false"
        :pagination="false"
        :bottom-line="false"
        cache-key="systemMenuTable"
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
        <template #menuName="{ row }">
          <el-icon
            v-if="row.icon && row.icon != '#'"
            :size="16"
            style="margin-right: 8px; vertical-align: -2px"
          >
            <component :is="row.icon" />
          </el-icon>
          <span>{{ row.menuName }}</span>
        </template>
        <template #menuType="{ row }">
          <el-tag
            v-if="row.isFrame == '0'"
            size="small"
            type="danger"
            :disable-transitions="true"
          >
            外链
          </el-tag>
          <el-tag
            v-else-if="row.menuType === 'M'"
            size="small"
            :disable-transitions="true"
          >
            目录
          </el-tag>
          <el-tag
            v-else-if="row.menuType === 'C'"
            size="small"
            type="success"
            :disable-transitions="true"
          >
            菜单
          </el-tag>
          <el-tag
            v-else-if="row.menuType === 'F'"
            size="small"
            type="info"
            :disable-transitions="true"
          >
            按钮
          </el-tag>
        </template>
        <template #visible="{ row }">
          <dict-data
            code="sys_show_hide"
            type="tag"
            :model-value="row.visible"
          />
        </template>
        <template #action="{ row }">
          <el-space>
            <el-link
              type="primary"
              :underline="false"
              @click="openEdit(null, row.menuId)"
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
              :title="'是否确认删除名称为“' + row.menuName + '”的数据项？'"
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
    <menu-edit
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
  import MenuSearch from './components/menu-search.vue';
  import MenuEdit from './components/menu-edit.vue';
  import { listMenus, removeMenu } from '@/api/system/menu';

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
      prop: 'menuName',
      label: '菜单名称',
      slot: 'menuName',
      showOverflowTooltip: true,
      minWidth: 160
    },
    {
      prop: 'path',
      label: '路由地址',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'component',
      label: '组件路径',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'perms',
      label: '权限标识',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'orderNum',
      label: '排序',
      align: 'center',
      width: 90
    },
    {
      prop: 'visible',
      label: '状态',
      align: 'center',
      slot: 'visible',
      width: 90
    },
    {
      prop: 'menuType',
      label: '类型',
      align: 'center',
      slot: 'menuType',
      width: 90
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
    const data = await listMenus({ ...where });
    return toTree({
      data,
      idField: 'menuId',
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
    removeMenu(row.menuId)
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
  import * as MenuIcons from '@/layout/menu-icons';

  export default {
    name: 'SystemMenu',
    components: MenuIcons
  };
</script>
