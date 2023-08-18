<template>
  <ele-modal
    form
    :width="460"
    title="分配数据权限"
    :model-value="modelValue"
    @update:modelValue="updateModelValue"
  >
    <el-form label-width="80px">
      <el-form-item label="权限范围">
        <el-select
          v-model="dataScope"
          placeholder="请选择权限范围"
          class="ele-fluid"
        >
          <el-option value="1" label="全部数据权限" />
          <el-option value="2" label="自定数据权限" />
          <el-option value="3" label="本部门数据权限" />
          <el-option value="4" label="本部门及以下数据权限" />
          <el-option value="5" label="仅本人数据权限" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataScope == 2" label="数据权限">
        <ele-loading :loading="treeLoading" class="role-auth-tree">
          <div style="line-height: 1; padding: 0 6px 6px 6px">
            <el-space :size="6" :wrap="true">
              <el-button class="ele-btn-icon" size="small" @click="expandAll">
                展开全部
              </el-button>
              <el-button class="ele-btn-icon" size="small" @click="foldAll">
                折叠全部
              </el-button>
              <el-button class="ele-btn-icon" size="small" @click="checkAll">
                全选
              </el-button>
              <el-button class="ele-btn-icon" size="small" @click="checkOutAll">
                取消全选
              </el-button>
            </el-space>
          </div>
          <div style="height: 260px; overflow: auto">
            <el-tree
              ref="treeRef"
              show-checkbox
              node-key="id"
              :data="treeData"
              :default-expand-all="true"
              :default-checked-keys="checkedKeys"
            />
          </div>
        </ele-loading>
      </el-form-item>
    </el-form>
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
  import { EleMessage, eachTree } from 'ele-admin-plus/es';
  import { setDataScope, listDataScope } from '@/api/system/role';

  const emit = defineEmits(['done', 'update:modelValue']);

  const props = defineProps({
    // 弹窗是否打开
    modelValue: Boolean,
    // 修改回显的数据
    data: Object
  });

  // 树组件
  const treeRef = ref(null);

  // 树数据
  const treeData = ref([]);

  // 树数据请求状态
  const treeLoading = ref(false);

  // 菜单回显选中
  const checkedKeys = ref([]);

  // 权限范围
  const dataScope = ref('');

  // 提交状态
  const loading = ref(false);

  /* 获取选中节点id */
  const getCheckedIds = () => {
    if (dataScope.value != 2) {
      return [];
    }
    const ids = treeRef.value?.getCheckedKeys?.() ?? [];
    const ids2 = treeRef.value?.getHalfCheckedKeys?.() ?? [];
    return ids.concat(ids2);
  };

  /* 保存编辑 */
  const save = () => {
    loading.value = true;
    setDataScope({
      roleId: props.data?.roleId,
      dataScope: dataScope.value,
      deptIds: getCheckedIds()
    })
      .then(() => {
        loading.value = false;
        EleMessage.success('修改成功');
        updateModelValue(false);
        emit('done');
      })
      .catch((e) => {
        loading.value = false;
        EleMessage.error(e.message);
      });
  };

  /* 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  /* 展开全部 */
  const expandAll = () => {
    eachTree(treeData.value, (d) => {
      const node = treeRef.value?.getNode?.(d);
      node.expand(null, false);
    });
  };

  /* 折叠全部 */
  const foldAll = () => {
    eachTree(treeData.value, (d) => {
      const node = treeRef.value?.getNode?.(d);
      node.collapse();
    });
  };

  /* 全选 */
  const checkAll = () => {
    const keys = [];
    eachTree(treeData.value, (d) => {
      keys.push(d.id);
    });
    treeRef.value?.setCheckedKeys?.(keys);
  };

  /* 取消全选 */
  const checkOutAll = () => {
    treeRef.value?.setCheckedKeys?.([]);
  };

  /* 查询菜单数据 */
  const query = () => {
    treeData.value = [];
    checkedKeys.value = [];
    treeLoading.value = true;
    listDataScope(props.data?.roleId)
      .then((result) => {
        treeLoading.value = false;
        treeData.value = result.depts;
        const cks = [];
        eachTree(treeData.value, (d) => {
          if (!d.children?.length && result.checkedKeys?.includes?.(d.id)) {
            cks.push(d.id);
          }
        });
        checkedKeys.value = cks;
      })
      .catch((e) => {
        treeLoading.value = false;
        EleMessage.error(e.message);
      });
  };

  watch(
    () => props.modelValue,
    (modelValue) => {
      if (modelValue && props.data) {
        dataScope.value = props.data.dataScope;
        query();
      } else {
        dataScope.value = '';
      }
    }
  );
</script>

<style lang="scss" scoped>
  .role-auth-tree {
    width: 100%;
    padding: 6px 0;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);
    box-sizing: border-box;
    overflow: hidden;
  }
</style>
