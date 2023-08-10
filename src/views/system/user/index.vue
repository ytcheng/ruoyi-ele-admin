<template>
  <ele-page
    flex-table
    :multi-card="false"
    hide-footer
    style="min-height: 420px"
  >
    <ele-card
      flex-table
      :body-style="{ padding: '0 0 0 16px', overflow: 'hidden' }"
    >
      <ele-split-panel
        flex-table
        size="266px"
        allow-collapse
        :custom-style="{ borderWidth: '0 1px 0 0', padding: '16px 0' }"
        :body-style="{ padding: '16px 16px 16px 0', overflow: 'hidden' }"
        :style="{ height: '100%', overflow: 'visible' }"
      >
        <div class="org-tree">
          <el-tree
            ref="treeRef"
            :data="data"
            highlight-current
            node-key="deptId"
            :props="{ label: 'deptName' }"
            :expand-on-click-node="false"
            :default-expand-all="true"
            @node-click="onNodeClick"
          />
        </div>
        <template #body>
          <user-list v-if="current" :dept-id="current.deptId" />
        </template>
      </ele-split-panel>
    </ele-card>
  </ele-page>
</template>

<script setup>
  import { ref, nextTick } from 'vue';
  import { EleMessage, toTree } from 'ele-admin-plus/es';
  import UserList from './components/user-list.vue';
  import { listDepts } from '@/api/system/dept';

  // 树组件
  const treeRef = ref(null);

  // 加载状态
  const loading = ref(true);

  // 树形数据
  const data = ref([]);

  // 选中数据
  const current = ref(null);

  /* 查询 */
  const query = () => {
    loading.value = true;
    listDepts()
      .then((list) => {
        loading.value = false;
        data.value = toTree({
          data: list,
          idField: 'deptId',
          parentIdField: 'parentId'
        });
        nextTick(() => {
          onNodeClick(data.value[0]);
        });
      })
      .catch((e) => {
        loading.value = false;
        EleMessage.error(e.message);
      });
  };

  /* 选择数据 */
  const onNodeClick = (row) => {
    if (row && row.deptId) {
      current.value = row;
      treeRef.value?.setCurrentKey?.(row.deptId);
    } else {
      current.value = null;
    }
  };

  query();
</script>

<script>
  export default {
    name: 'SystemUser'
  };
</script>

<style lang="scss" scoped>
  .org-tree {
    flex: 1;
    padding-right: 16px;
    overflow: auto;

    :deep(.el-tree-node__content) {
      height: 36px;
      border-radius: var(--el-border-radius-base);

      & > .el-tree-node__expand-icon {
        padding: 12px;
      }
    }
  }
</style>
