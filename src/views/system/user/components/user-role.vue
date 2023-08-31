<template>
  <ele-modal
    :width="640"
    title="分配角色"
    :body-style="{ padding: '4px 16px 8px 16px' }"
    :destroy-on-close="true"
    :model-value="modelValue"
    @update:modelValue="updateModelValue"
  >
    <ele-pro-table
      ref="tableRef"
      row-key="roleId"
      :columns="columns"
      :datasource="datasource"
      v-model:selections="selections"
      highlight-current-row
      :pagination="false"
      :toolbar="false"
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
  import { ref, watch, nextTick } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { getUserRole, setUserRole } from '@/api/system/user';

  const emit = defineEmits(['update:modelValue']);

  const props = defineProps({
    // 是否显示
    modelValue: Boolean,
    // 用户
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
      prop: 'roleName',
      label: '角色名称',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'roleKey',
      label: '权限字符',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'createTime',
      label: '创建时间',
      align: 'center',
      showOverflowTooltip: true,
      width: 180
    }
  ]);

  // 表格选中数据
  const selections = ref([]);

  // 表格数据源
  const datasource = ref([]);

  // 提交状态
  const loading = ref(false);

  /* 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  /* 保存编辑 */
  const save = () => {
    loading.value = true;
    const roleIds = selections.value.map((d) => d.roleId).join();
    setUserRole({ userId: props.data?.userId, roleIds })
      .then(() => {
        loading.value = false;
        EleMessage.success('授权成功');
        updateModelValue(false);
      })
      .catch((e) => {
        loading.value = false;
        EleMessage.error(e.message);
      });
  };

  /* 查询 */
  const query = () => {
    getUserRole(props.data.userId)
      .then((result) => {
        datasource.value = result.roles;
        nextTick(() => {
          tableRef.value?.setSelectedRows?.(result.roles.filter((d) => d.flag));
        });
      })
      .catch((e) => {
        EleMessage.error(e.message);
      });
  };

  watch(
    () => props.modelValue,
    (modelValue) => {
      if (modelValue && props.data) {
        query();
      } else {
        selections.value = [];
      }
    }
  );
</script>
