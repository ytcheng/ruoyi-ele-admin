<template>
  <ele-modal
    :width="880"
    title="选择用户"
    :body-style="{ padding: '4px 16px' }"
    :destroy-on-close="true"
    :model-value="modelValue"
    @update:modelValue="updateModelValue"
  >
    <role-user-search @search="reload" />
    <ele-pro-table
      ref="tableRef"
      row-key="userId"
      :columns="columns"
      :datasource="datasource"
      v-model:selections="selections"
      highlight-current-row
      :toolbar="false"
      :bottom-line="false"
    >
      <template #status="{ row }">
        <dict-data
          code="sys_common_status"
          type="tag"
          :model-value="row.status"
        />
      </template>
    </ele-pro-table>
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
  import RoleUserSearch from './role-user-search.vue';
  import { listUnallocatedUsers, addRoleUsers } from '@/api/system/role';

  const emit = defineEmits(['update:modelValue', 'done']);

  const props = defineProps({
    // 是否显示
    modelValue: Boolean,
    // 角色id
    roleId: Number
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
    }
  ]);

  // 表格选中数据
  const selections = ref([]);

  // 表格数据源
  const datasource = ({ page, limit, where }) => {
    return listUnallocatedUsers({
      ...where,
      pageNum: page,
      pageSize: limit,
      roleId: props.roleId
    });
  };

  /* 搜索 */
  const reload = (where) => {
    tableRef.value?.reload?.({ page: 1, where });
  };

  /* 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  /* 保存编辑 */
  const save = () => {
    if (!selections.value.length) {
      EleMessage.error('请选择要分配的用户');
      return;
    }
    loading.value = true;
    const userIds = selections.value.map((d) => d.userId).join();
    addRoleUsers({ roleId: props.roleId, userIds })
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
      if (modelValue && props.data) {
        reload();
      } else {
        selections.value = [];
      }
    }
  );
</script>
