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
        ref="splitRef"
        flex-table
        size="249px"
        allow-collapse
        :custom-style="{ borderWidth: '0 1px 0 0', padding: '16px 0' }"
        :body-style="{ padding: '16px 16px 16px 0', overflow: 'hidden' }"
        :style="{ height: '100%', overflow: 'visible' }"
      >
        <div style="padding: 0 16px 12px 0">
          <el-input
            clearable
            :maxlength="20"
            v-model="keywords"
            placeholder="输入部门名称搜索"
            :prefix-icon="Search"
          />
        </div>
        <ele-loading :loading="loading" class="org-tree">
          <el-tree
            ref="treeRef"
            :data="data"
            highlight-current
            node-key="deptId"
            :props="{ label: 'deptName' }"
            :expand-on-click-node="false"
            :default-expand-all="true"
            :filter-node-method="filterNode"
            @node-click="onNodeClick"
          />
        </ele-loading>
        <template #body>
          <user-list v-if="current" :dept-id="current.deptId" />
        </template>
      </ele-split-panel>
    </ele-card>
  </ele-page>
</template>

<script setup>
  import { ref, nextTick, watch } from 'vue';
  import { Search } from '@element-plus/icons-vue';
  import { EleMessage, toTree } from 'ele-admin-plus/es';
  import { useMobile } from '@/utils/use-mobile';
  import UserList from './components/user-list.vue';
  import { listDepts } from '@/api/system/dept';

  // 是否是移动端
  const { mobile } = useMobile();

  // 分割面板组件
  const splitRef = ref(null);

  // 树组件
  const treeRef = ref(null);

  // 加载状态
  const loading = ref(true);

  // 树形数据
  const data = ref([]);

  // 选中数据
  const current = ref(null);

  // 部门搜索关键字
  const keywords = ref('');

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
    // 移动端自动收起左侧
    if (current.value != null && mobile.value) {
      splitRef.value?.toggleCollapse?.(true);
    }
    if (row && row.deptId) {
      current.value = row;
      treeRef.value?.setCurrentKey?.(row.deptId);
    } else {
      current.value = null;
    }
  };

  /* 树过滤方法 */
  const filterNode = (value, data) => {
    if (value) {
      return data.deptName && data.deptName.includes(value);
    }
    return true;
  };

  /* 树过滤 */
  watch(keywords, (value) => {
    treeRef.value?.filter?.(value);
  });

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
      line-height: 36px;
      border-radius: calc((var(--el-border-radius-small) - 2px) * 3);
      transition: all 0.2s;

      & > .el-tree-node__expand-icon {
        padding: 12px;
      }
    }

    :deep(.el-tree-node.is-current > .el-tree-node__content) {
      color: var(--el-color-primary);
      font-weight: bold;
    }
  }
</style>
