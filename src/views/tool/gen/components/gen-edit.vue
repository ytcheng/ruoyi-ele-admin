<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="460"
    :model-value="modelValue"
    :title="`修改${data?.tableName}生成配置`"
    @update:modelValue="updateModelValue"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="表名称" prop="tableName">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.tableName"
          placeholder="请输入表名称"
        />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input
          clearable
          :maxlength="100"
          v-model="form.tableComment"
          placeholder="请输入表描述"
        />
      </el-form-item>
      <el-form-item label="实体类名称" prop="className">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.className"
          placeholder="请输入实体类名称"
        />
      </el-form-item>
      <el-form-item label="作者" prop="functionAuthor">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.functionAuthor"
          placeholder="请输入作者"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          :rows="4"
          type="textarea"
          :maxlength="200"
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
  import { EleMessage } from 'ele-admin-plus/es';
  import { useFormData } from '@/utils/use-form-data';
  import { updateGen } from '@/api/tool/gen';

  const emit = defineEmits(['done', 'update:modelValue']);

  const props = defineProps({
    // 弹窗是否打开
    modelValue: Boolean,
    // 修改回显的数据
    data: Object
  });

  // 提交状态
  const loading = ref(false);

  // 表单实例
  const formRef = ref(null);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData({
    tableId: void 0,
    tableName: '',
    tableComment: '',
    className: '',
    functionAuthor: '',
    remark: ''
  });

  // 表单验证规则
  const rules = reactive({
    tableName: [
      {
        required: true,
        message: '请输入表名称',
        type: 'string',
        trigger: 'blur'
      }
    ],
    tableComment: [
      {
        required: true,
        message: '请输入表描述',
        type: 'string',
        trigger: 'blur'
      }
    ],
    className: [
      {
        required: true,
        message: '请输入实体类名称',
        type: 'string',
        trigger: 'blur'
      }
    ],
    functionAuthor: [
      {
        required: true,
        message: '请输入作者',
        type: 'string',
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
      loading.value = true;
      updateGen(form)
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

  watch(
    () => props.modelValue,
    (modelValue) => {
      if (modelValue) {
        if (props.data) {
          assignFields(props.data);
        }
      } else {
        resetFields();
        formRef.value?.clearValidate?.();
      }
    }
  );
</script>
