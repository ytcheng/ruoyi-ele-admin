<!-- 搜索表单 -->
<template>
  <el-form label-width="72px" @keyup.enter="search">
    <el-row :gutter="8">
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <el-form-item label="用户名称">
          <el-input
            clearable
            v-model.trim="form.userName"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <el-form-item label="手机号码">
          <el-input
            clearable
            v-model.trim="form.phonenumber"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <el-form-item label="状态">
          <dict-data
            code="sys_normal_disable"
            v-model="form.status"
            placeholder="请选择"
          />
        </el-form-item>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <el-form-item label-width="16px">
          <el-space>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-space>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
  import { useFormData } from '@/utils/use-form-data';

  const emit = defineEmits(['search']);

  // 表单数据
  const { form, resetFields } = useFormData({
    userName: '',
    phonenumber: '',
    status: void 0
  });

  /* 搜索 */
  const search = () => {
    emit('search', form);
  };

  /*  重置 */
  const reset = () => {
    resetFields();
    search();
  };

  defineExpose({ resetFields });
</script>
