<!-- 编辑弹窗 -->
<template>
  <ele-modal
    form
    :width="680"
    position="center"
    :model-value="modelValue"
    :body-style="{ paddingLeft: '0px' }"
    :title="isUpdate ? '修改角色' : '添加角色'"
    @update:modelValue="updateModelValue"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="108px">
      <el-row>
        <el-col :sm="12" :xs="24">
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              clearable
              :maxlength="20"
              v-model="form.roleName"
              placeholder="请输入角色名称"
            />
          </el-form-item>
          <el-form-item label="显示顺序" prop="roleSort">
            <el-input-number
              :min="0"
              :max="99999"
              v-model="form.roleSort"
              placeholder="请输入显示顺序"
              controls-position="right"
              class="ele-fluid"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item prop="roleKey">
            <template #label>
              <ele-tooltip
                content="控制器中定义的权限字符, 如: @PreAuthorize(`@ss.hasRole('admin')`)"
                :bodyStyle="{ maxWidth: '268px' }"
              >
                <el-icon
                  :size="16"
                  style="align-self: center; margin-right: 2px; cursor: help"
                >
                  <warning style="opacity: 0.6" />
                </el-icon>
              </ele-tooltip>
              <span>权限字符</span>
            </template>
            <el-input
              clearable
              :maxlength="20"
              v-model="form.roleKey"
              placeholder="请输入权限字符"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <dict-data
              code="sys_normal_disable"
              type="radio"
              v-model="form.status"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="菜单权限">
        <ele-loading :loading="menuLoading" class="role-menu-tree">
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
              :data="menuData"
              :default-checked-keys="checkedKeys"
            />
          </div>
        </ele-loading>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          :rows="3"
          type="textarea"
          v-model="form.remark"
          placeholder="请输入备注"
        />
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
  import { ref, reactive, watch } from 'vue';
  import { Warning } from '@element-plus/icons-vue';
  import { EleMessage, eachTree } from 'ele-admin-plus/es';
  import { useFormData } from '@/utils/use-form-data';
  import { addRole, updateRole, listRoleMenus } from '@/api/system/role';

  const emit = defineEmits(['done', 'update:modelValue']);

  const props = defineProps({
    // 弹窗是否打开
    modelValue: Boolean,
    // 修改回显的数据
    data: Object
  });

  // 菜单树组件
  const treeRef = ref(null);

  // 菜单数据
  const menuData = ref([]);

  // 菜单数据请求状态
  const menuLoading = ref(false);

  // 菜单回显选中
  const checkedKeys = ref([]);

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 表单实例
  const formRef = ref(null);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData({
    roleId: void 0,
    roleName: '',
    roleKey: '',
    roleSort: 0,
    status: '0',
    remark: ''
  });

  // 表单验证规则
  const rules = reactive({
    roleName: [
      {
        required: true,
        message: '请输入角色名称',
        type: 'string',
        trigger: 'blur'
      }
    ],
    roleKey: [
      {
        required: true,
        message: '请输入权限字符',
        type: 'string',
        trigger: 'blur'
      }
    ],
    roleSort: [
      {
        required: true,
        message: '请输入显示顺序',
        type: 'number',
        trigger: 'blur'
      }
    ]
  });

  /* 保存编辑 */
  const save = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      const menuIds =
        (treeRef.value?.getCheckedKeys?.() ?? []).concat(
          treeRef.value?.getHalfCheckedKeys?.() ?? []
        ) ?? [];
      loading.value = true;
      const saveOrUpdate = isUpdate.value ? updateRole : addRole;
      saveOrUpdate({ ...form, menuIds })
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
    });
  };

  /* 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  /* 展开全部 */
  const expandAll = () => {
    eachTree(menuData.value, (d) => {
      const node = treeRef.value?.getNode?.(d);
      node.expand(null, false);
    });
  };

  /* 折叠全部 */
  const foldAll = () => {
    eachTree(menuData.value, (d) => {
      const node = treeRef.value?.getNode?.(d);
      node.collapse();
    });
  };

  /* 全选 */
  const checkAll = () => {
    const keys = [];
    eachTree(menuData.value, (d) => {
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
    menuData.value = [];
    checkedKeys.value = [];
    menuLoading.value = true;
    listRoleMenus(props.data?.roleId)
      .then((result) => {
        menuLoading.value = false;
        menuData.value = result.menus;
        checkedKeys.value = result.checkedKeys;
      })
      .catch((e) => {
        menuLoading.value = false;
        EleMessage.error(e.message);
      });
  };

  watch(
    () => props.modelValue,
    (modelValue) => {
      if (modelValue) {
        if (props.data) {
          assignFields(props.data);
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
        query();
      } else {
        resetFields();
        formRef.value?.clearValidate?.();
      }
    }
  );
</script>

<style lang="scss" scoped>
  .role-menu-tree {
    width: 100%;
    padding: 6px 0;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);
    box-sizing: border-box;
    overflow: hidden;
  }
</style>
