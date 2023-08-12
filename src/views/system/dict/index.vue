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
        <el-space style="display: flex; margin-bottom: 12px">
          <el-button
            type="primary"
            class="ele-btn-icon"
            :icon="Plus"
            @click="openEdit()"
          >
            新建
          </el-button>
          <el-button
            type="warning"
            :disabled="!current"
            class="ele-btn-icon"
            :icon="EditPen"
            @click="openEdit(current)"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            :disabled="!current"
            class="ele-btn-icon"
            :icon="Delete"
            @click="remove"
          >
            删除
          </el-button>
        </el-space>
        <div class="dict-tree">
          <el-tree
            ref="treeRef"
            :data="data"
            highlight-current
            node-key="dictId"
            :expand-on-click-node="false"
            :default-expand-all="true"
            @node-click="onNodeClick"
          >
            <template #default="{ data: d }">
              <span>
                <span>{{ d.dictName }}</span>
                <span
                  style="font-size: 12px; opacity: 0.8; vertical-align: 1.5px"
                >
                  ({{ d.dictType }})
                </span>
              </span>
            </template>
          </el-tree>
        </div>
        <template #body>
          <dict-data-list
            v-if="current && current.dictType"
            :dict-type="current.dictType"
          />
        </template>
      </ele-split-panel>
    </ele-card>
    <!-- 编辑弹窗 -->
    <dict-edit v-model="showEdit" :data="editData" @done="query" />
  </ele-page>
</template>

<script setup>
  import { ref, nextTick } from 'vue';
  import { Plus, Delete, EditPen } from '@element-plus/icons-vue';
  import { ElMessageBox } from 'element-plus';
  import { EleMessage } from 'ele-admin-plus/es';
  import DictDataList from './components/dict-data-list.vue';
  import DictEdit from './components/dict-edit.vue';
  import { listDicts, removeDict } from '@/api/system/dict';

  // 树组件
  const treeRef = ref(null);

  // 加载状态
  const loading = ref(true);

  // 树形数据
  const data = ref([]);

  // 选中数据
  const current = ref(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 编辑回显数据
  const editData = ref(null);

  /* 查询 */
  const query = () => {
    loading.value = true;
    listDicts()
      .then((list) => {
        loading.value = false;
        data.value = list ?? [];
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
    if (row && row.dictId) {
      current.value = row;
      treeRef.value?.setCurrentKey?.(row.dictId);
    } else {
      current.value = null;
    }
  };

  /* 打开编辑弹窗 */
  const openEdit = (row) => {
    editData.value = row ?? null;
    showEdit.value = true;
  };

  /* 删除 */
  const remove = () => {
    const id = current.value?.dictId;
    ElMessageBox.confirm(
      `是否确认删除字典编号为"${id}"的数据项？`,
      '系统提示',
      { type: 'warning', draggable: true }
    )
      .then(() => {
        const loading = EleMessage.loading('请求中..');
        removeDict(id)
          .then(() => {
            loading.close();
            EleMessage.success('删除成功');
            query();
          })
          .catch((e) => {
            loading.close();
            EleMessage.error(e.message);
          });
      })
      .catch(() => {});
  };

  query();
</script>

<script>
  export default {
    name: 'SystemDict'
  };
</script>

<style lang="scss" scoped>
  .dict-tree {
    flex: 1;
    padding-right: 16px;
    overflow: auto;

    :deep(.el-tree-node__content) {
      height: 36px;
      line-height: 36px;
      border-radius: calc((var(--el-border-radius-small) - 2px) * 3);
      transition: all 0.2s;

      & > .el-tree-node__expand-icon {
        padding: 2px;
      }
    }

    :deep(.el-tree-node.is-current > .el-tree-node__content) {
      color: var(--el-color-primary);
      font-weight: bold;
    }
  }
</style>
