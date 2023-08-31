<template>
  <ele-drawer
    :size="980"
    style="max-width: 100%"
    title="分配用户"
    :append-to-body="true"
    :destroy-on-close="true"
    :model-value="modelValue"
    @update:modelValue="updateModelValue"
  >
    <role-user-search style="margin-bottom: -8px" @search="reload" />
    <ele-pro-table
      ref="tableRef"
      row-key="userId"
      :columns="columns"
      :datasource="datasource"
      v-model:selections="selections"
      highlight-current-row
      :bottom-line="false"
    >
      <template #toolbar>
        <el-space>
          <el-button
            type="primary"
            class="ele-btn-icon"
            :icon="Plus"
            @click="openEdit()"
          >
            添加用户
          </el-button>
          <el-button
            type="danger"
            class="ele-btn-icon"
            :icon="Delete"
            @click="removeBatch"
          >
            批量取消
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
      <template #action="{ row }">
        <ele-popconfirm
          :width="226"
          placement="top-end"
          :title="'确认要取消该用户“' + row.userName + '”的角色吗？'"
          :popper-options="{
            modifiers: [{ name: 'offset', options: { offset: [20, 6] } }]
          }"
          @confirm="remove(row)"
        >
          <template #reference>
            <el-link type="danger" :underline="false">取消授权</el-link>
          </template>
        </ele-popconfirm>
      </template>
    </ele-pro-table>
  </ele-drawer>
  <!-- 选择用户弹窗 -->
  <role-user-select v-model="showEdit" :role-id="data?.roleId" @done="reload" />
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { Plus, Delete } from '@element-plus/icons-vue';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from 'ele-admin-plus/es';
  import RoleUserSearch from './role-user-search.vue';
  import RoleUserSelect from './role-user-select.vue';
  import {
    listRoleUsers,
    removeRoleUser,
    removeRoleUsers
  } from '@/api/system/role';

  const emit = defineEmits(['update:modelValue']);

  const props = defineProps({
    // 是否显示
    modelValue: Boolean,
    // 角色
    data: Object
  });

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
      prop: 'userName',
      label: '用户名称',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'nickName',
      label: '用户昵称',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'email',
      label: '邮箱',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'phonenumber',
      label: '手机号码',
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
      width: 168
    },
    {
      columnKey: 'action',
      label: '操作',
      width: 88,
      align: 'center',
      slot: 'action',
      fixed: 'right'
    }
  ]);

  // 表格选中数据
  const selections = ref([]);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 表格数据源
  const datasource = ({ page, limit, where }) => {
    return listRoleUsers({
      ...where,
      pageNum: page,
      pageSize: limit,
      roleId: props.data?.roleId
    });
  };

  /* 搜索 */
  const reload = (where) => {
    tableRef.value?.reload?.({ where });
  };

  /* 添加用户 */
  const openEdit = () => {
    showEdit.value = true;
  };

  /* 取消用户 */
  const remove = (row) => {
    const loading = EleMessage.loading('请求中..');
    removeRoleUser({ roleId: props.data?.roleId, userId: row.userId })
      .then(() => {
        loading.close();
        EleMessage.success('取消授权成功');
        reload();
      })
      .catch((e) => {
        loading.close();
        EleMessage.error(e.message);
      });
  };

  /* 批量取消 */
  const removeBatch = () => {
    if (!selections.value.length) {
      EleMessage.error('请至少选择一条数据');
      return;
    }
    const userIds = selections.value.map((d) => d.userId).join();
    const names = selections.value.map((d) => d.userName).join();
    ElMessageBox.confirm(`确认要取消该用户“${names}”的角色吗?`, '系统提示', {
      type: 'warning',
      draggable: true
    })
      .then(() => {
        const loading = EleMessage.loading('请求中..');
        removeRoleUsers({ roleId: props.data?.roleId, userIds })
          .then(() => {
            loading.close();
            EleMessage.success('取消授权成功');
            reload();
          })
          .catch((e) => {
            loading.close();
            EleMessage.error(e.message);
          });
      })
      .catch(() => {});
  };

  /* 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  watch(
    () => props.modelValue,
    (modelValue) => {
      if (modelValue && props.data) {
        reload();
      } else {
        selections.value = [];
      }
    }
  );
</script>
