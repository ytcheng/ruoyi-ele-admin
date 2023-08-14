<!-- 字典数据编辑弹窗 -->
<template>
  <ele-modal
    form
    :width="460"
    :model-value="modelValue"
    :title="isUpdate ? '修改字典数据' : '添加字典数据'"
    @update:modelValue="updateModelValue"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="数据标签" prop="dictLabel">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.dictLabel"
          placeholder="请输入数据标签"
        />
      </el-form-item>
      <el-form-item label="数据键值" prop="dictValue">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.dictValue"
          placeholder="请输入数据键值"
        />
      </el-form-item>
      <el-form-item label="样式属性" prop="cssClass">
        <el-input
          clearable
          :maxlength="200"
          v-model="form.cssClass"
          placeholder="请输入样式属性"
        />
      </el-form-item>
      <el-form-item label="显示排序" prop="dictSort">
        <el-input-number
          :min="0"
          :max="9999"
          v-model="form.dictSort"
          placeholder="请输入显示排序"
          controls-position="right"
          class="ele-fluid"
        />
      </el-form-item>
      <el-form-item label="回显样式" prop="listClass">
        <el-select
          clearable
          v-model="form.listClass"
          placeholder="请选择回显样式"
          class="ele-fluid"
        >
          <el-option value="default" label="默认" />
          <el-option value="primary" label="主要" />
          <el-option value="success" label="成功" />
          <el-option value="info" label="信息" />
          <el-option value="warning" label="警告" />
          <el-option value="danger" label="危险" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-data
          code="sys_normal_disable"
          type="radio"
          v-model="form.status"
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
  import { addDictData, updateDictData } from '@/api/system/dict-data';

  const emit = defineEmits(['done', 'update:modelValue']);

  const props = defineProps({
    // 弹窗是否打开
    modelValue: Boolean,
    // 修改回显的数据
    data: Object,
    // 字典类型
    dictType: String
  });

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 表单实例
  const formRef = ref(null);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData({
    dictCode: void 0,
    dictLabel: '',
    dictValue: '',
    cssClass: '',
    dictSort: void 0,
    listClass: '',
    status: '0',
    remark: ''
  });

  // 表单验证规则
  const rules = reactive({
    dictLabel: [
      {
        required: true,
        message: '请输入数据标签',
        type: 'string',
        trigger: 'blur'
      }
    ],
    dictValue: [
      {
        required: true,
        message: '请输入数据键值',
        type: 'string',
        trigger: 'blur'
      }
    ],
    dictSort: [
      {
        required: true,
        message: '请输入显示排序',
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
      loading.value = true;
      const saveOrUpdate = isUpdate.value ? updateDictData : addDictData;
      saveOrUpdate({
        ...form,
        dictType: props.dictType
      })
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
