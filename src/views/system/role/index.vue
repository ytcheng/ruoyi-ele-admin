<template>
  <ele-page>
    <!-- 搜索表单 -->
    <role-search @search="reload" />
    <ele-card :body-style="{ paddingTop: '8px' }">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="roleId"
        :columns="columns"
        :datasource="datasource"
        v-model:selections="selections"
        highlight-current-row
        :bottom-line="false"
        cache-key="systemRoleTable"
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
              :title="'是否确认删除角色名称为“' + row.roleName + '”的数据项？'"
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
                { title: '数据权限', command: 'auth' },
                { title: '分配用户', command: 'user' }
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
    <role-edit v-model="showEdit" :data="current" @done="reload" />
    <!-- 分配数据权限弹窗 -->
    <role-auth v-model="showAuth" :data="current" @done="reload" />
    <!-- 分配用户弹窗 -->
    <role-user v-model="showUser" :data="current" />
  </ele-page>
</template>

<script setup>
  import { ref } from 'vue';
  import { Plus, Delete, Download, ArrowDown } from '@element-plus/icons-vue';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from 'ele-admin-plus/es';
  import RoleSearch from './components/role-search.vue';
  import RoleEdit from './components/role-edit.vue';
  import RoleAuth from './components/role-auth.vue';
  import RoleUser from './components/role-user.vue';
  import {
    pageRoles,
    removeRole,
    removeRoles,
    exportRoles
  } from '@/api/system/role';

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
      prop: 'roleName',
      label: '角色名称',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'roleKey',
      label: '权限字符',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'roleSort',
      label: '显示顺序',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
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

  // 表格选中数据
  const selections = ref([]);

  // 当前编辑数据
  const current = ref(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 是否显示分配数据权限弹窗
  const showAuth = ref(false);

  // 是否显示分配用户弹窗
  const showUser = ref(false);

  // 表格数据源
  const datasource = ({ page, limit, where }) => {
    return pageRoles({ ...where, pageNum: page, pageSize: limit });
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

  /* 删除单个 */
  const remove = (row) => {
    const loading = EleMessage.loading('请求中..');
    removeRole(row.roleId)
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
    const ids = selections.value.map((d) => d.roleId);
    const names = selections.value.map((d) => d.roleName).join();
    ElMessageBox.confirm(
      `是否确认删除角色名称为"${names}"的数据项?`,
      '系统提示',
      { type: 'warning', draggable: true }
    )
      .then(() => {
        const loading = EleMessage.loading('请求中..');
        removeRoles(ids)
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
    tableRef.value?.fetch?.(({ where }) => {
      exportRoles(where)
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
    if (key === 'auth') {
      current.value = row ?? null;
      showAuth.value = true;
    } else if (key === 'user') {
      current.value = row ?? null;
      showUser.value = true;
    }
  };
</script>

<script>
  export default {
    name: 'SystemRole'
  };
</script>
