<!-- 编辑弹窗 -->
<template>
  <ele-modal
    form
    :width="860"
    top="40px"
    :model-value="modelValue"
    :title="isUpdate ? '修改公告' : '添加公告'"
    @update:modelValue="updateModelValue"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input
          clearable
          :maxlength="100"
          v-model="form.noticeTitle"
          placeholder="请输入公告标题"
        />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :sm="12" :xs="24">
          <el-form-item label="公告类型" prop="noticeType">
            <dict-data
              code="sys_notice_type"
              v-model="form.noticeType"
              placeholder="请选择公告类型"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="状态" prop="status">
            <dict-data
              code="sys_notice_status"
              type="radio"
              v-model="form.status"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="内容">
        <tinymce-editor
          ref="editorRef"
          :init="config"
          v-model="form.noticeContent"
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
  import { addNotice, updateNotice } from '@/api/system/notice';
  import TinymceEditor from '@/components/TinymceEditor/index.vue';

  const emit = defineEmits(['done', 'update:modelValue']);

  const props = defineProps({
    // 弹窗是否打开
    modelValue: Boolean,
    // 修改回显的数据
    data: Object
  });

  //
  const editorRef = ref(null);

  // 编辑器配置
  const config = ref({
    height: 380
  });

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 表单实例
  const formRef = ref(null);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData({
    noticeId: void 0,
    noticeTitle: '',
    noticeType: void 0,
    status: '0',
    noticeContent: ''
  });

  // 表单验证规则
  const rules = reactive({
    noticeTitle: [
      {
        required: true,
        message: '请输入公告标题',
        type: 'string',
        trigger: 'blur'
      }
    ],
    noticeType: [
      {
        required: true,
        message: '请选择公告类型',
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
      const saveOrUpdate = isUpdate.value ? updateNotice : addNotice;
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
