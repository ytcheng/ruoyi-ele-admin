<template>
  <ele-card header="修改资料">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="88px"
      style="max-width: 520px; padding-top: 20px"
    >
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.nickName"
          placeholder="请输入用户昵称"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
          clearable
          :maxlength="20"
          v-model="form.phonenumber"
          placeholder="请输入手机号码"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          clearable
          :maxlength="100"
          v-model="form.email"
          placeholder="请输入邮箱"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <dict-data code="sys_user_sex" type="radio" v-model="form.sex" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="save">
          {{ loading ? '保存中..' : '保存更改' }}
        </el-button>
      </el-form-item>
    </el-form>
  </ele-card>
</template>

<script setup>
  import { ref, reactive, watch } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { useFormData } from '@/utils/use-form-data';
  import { updateUserProfile } from '@/api/profile';

  const emit = defineEmits(['done']);

  const props = defineProps({
    data: Object
  });

  // 提交状态
  const loading = ref(false);

  // 表单实例
  const formRef = ref(null);

  // 表单数据
  const { form, assignFields, resetFields } = useFormData({
    nickName: '',
    phonenumber: '',
    email: '',
    sex: void 0,
    userId: void 0
  });

  // 表单验证规则
  const rules = reactive({
    nickName: [
      {
        required: true,
        message: '请输入用户昵称',
        type: 'string',
        trigger: 'blur'
      }
    ],
    phonenumber: [
      {
        required: true,
        message: '请输入手机号码',
        type: 'string',
        trigger: 'blur'
      }
    ],
    email: [
      {
        required: true,
        message: '请输入邮箱',
        type: 'string',
        trigger: 'blur'
      }
    ],
    sex: [
      {
        required: true,
        message: '请选择性别',
        type: 'string',
        trigger: 'change'
      }
    ]
  });

  /* 保存更改 */
  const save = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      loading.value = true;
      updateUserProfile(form)
        .then(() => {
          loading.value = false;
          EleMessage.success('修改成功');
          emit('done', form);
        })
        .catch((e) => {
          loading.value = false;
          EleMessage.error(e.message);
        });
    });
  };

  // 回显当前登录用户信息
  watch(
    () => props.data,
    (data) => {
      if (data) {
        assignFields(data);
      } else {
        resetFields();
      }
    },
    { immediate: true }
  );
</script>
