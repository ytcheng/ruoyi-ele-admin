<!-- 编辑弹窗 -->
<template>
  <ele-modal
    form
    :width="460"
    :model-value="modelValue"
    :title="isUpdate ? '修改参数' : '添加参数'"
    @update:modelValue="updateModelValue"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="参数名称" prop="configName">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.configName"
          placeholder="请输入参数名称"
        />
      </el-form-item>
      <el-form-item label="参数键名" prop="configKey">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.configKey"
          placeholder="请输入参数键名"
        />
      </el-form-item>
      <el-form-item label="参数键值" prop="configValue">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.configValue"
          placeholder="请输入参数键值"
        />
      </el-form-item>
      <el-form-item label="系统内置" prop="configType">
        <dict-data code="sys_yes_no" type="radio" v-model="form.configType" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          :rows="4"
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
  import { EleMessage } from 'ele-admin-plus/es';
  import { useFormData } from '@/utils/use-form-data';
  import { addConfig, updateConfig } from '@/api/system/config';

  const emit = defineEmits(['done', 'update:modelValue']);

  const props = defineProps({
    // 弹窗是否打开
    modelValue: Boolean,
    // 修改回显的数据
    data: Object
  });

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 表单实例
  const formRef = ref(null);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData({
    configId: void 0,
    configName: '',
    configKey: '',
    configValue: '',
    configType: 'Y',
    remark: ''
  });

  // 表单验证规则
  const rules = reactive({
    configName: [
      {
        required: true,
        message: '请输入参数名称',
        type: 'string',
        trigger: 'blur'
      }
    ],
    configKey: [
      {
        required: true,
        message: '请输入参数键名',
        type: 'string',
        trigger: 'blur'
      }
    ],
    configValue: [
      {
        required: true,
        message: '请输入参数键值',
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
      const saveOrUpdate = isUpdate.value ? updateConfig : addConfig;
      saveOrUpdate(form)
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
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        resetFields();
        formRef.value?.clearValidate?.();
      }
    }
  );
</script>
