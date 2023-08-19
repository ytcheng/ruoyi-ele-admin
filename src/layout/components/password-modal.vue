<!-- 修改密码弹窗 -->
<template>
  <ele-modal
    form
    :width="420"
    title="修改密码"
    :append-to-body="true"
    :model-value="modelValue"
    @update:modelValue="updateModelValue"
    @closed="onCancel"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          show-password
          type="password"
          :maxlength="20"
          v-model="form.oldPassword"
          placeholder="请输入旧密码"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          show-password
          type="password"
          :maxlength="20"
          v-model="form.newPassword"
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          show-password
          type="password"
          :maxlength="20"
          v-model="form.confirmPassword"
          placeholder="请再次输入新密码"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="updateModelValue(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onOk">
        保存
      </el-button>
    </template>
  </ele-modal>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { useFormData } from '@/utils/use-form-data';
  import { updatePassword } from '@/api/layout';

  const emit = defineEmits(['update:modelValue']);

  defineProps({
    modelValue: Boolean
  });

  // 提交loading
  const loading = ref(false);

  // 表单实例
  const formRef = ref(null);

  // 表单数据
  const { form, resetFields } = useFormData({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 表单验证规则
  const rules = reactive({
    oldPassword: [
      {
        required: true,
        message: '请输入旧密码',
        type: 'string',
        trigger: 'blur'
      }
    ],
    newPassword: [
      {
        required: true,
        message: '请输入新密码',
        type: 'string',
        trigger: 'blur'
      },
      {
        type: 'string',
        trigger: 'blur',
        pattern: /^[\S]{5,18}$/,
        message: '密码必须为5-18位非空白字符'
      }
    ],
    confirmPassword: [
      {
        required: true,
        message: '请再次输入新密码',
        type: 'string',
        trigger: 'blur'
      },
      {
        type: 'string',
        trigger: 'blur',
        validator: (_rule, value, callback) => {
          if (value && value !== form.newPassword) {
            return callback(new Error('两次输入密码不一致'));
          }
          callback();
        }
      }
    ]
  });

  /* 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  /* 保存修改 */
  const onOk = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      loading.value = true;
      updatePassword(form)
        .then(() => {
          loading.value = false;
          EleMessage.success('修改成功');
          updateModelValue(false);
        })
        .catch((e) => {
          loading.value = false;
          EleMessage.error(e.message);
        });
    });
  };

  /* 关闭回调 */
  const onCancel = () => {
    resetFields();
    formRef.value?.clearValidate?.();
    loading.value = false;
  };
</script>
