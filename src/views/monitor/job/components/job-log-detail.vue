<template>
  <ele-modal
    title="调度日志详情"
    :width="720"
    :body-style="{ paddingTop: '6px' }"
    :model-value="modelValue"
    @update:modelValue="updateModelValue"
  >
    <el-descriptions
      v-if="data"
      :border="true"
      :column="mobile ? 1 : 2"
      class="detail-table"
    >
      <el-descriptions-item label="日志序号">
        <div>{{ data.jobLogId }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="任务分组">
        <div>{{ data.jobGroup }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="任务名称">
        <div>{{ data.jobName }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="执行状态">
        <dict-data
          code="sys_common_status"
          type="tag"
          :model-value="data.status"
        />
      </el-descriptions-item>
      <el-descriptions-item label="调用方法" :span="2">
        <div>{{ data.invokeTarget }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="日志信息" :span="2">
        <div>{{ data.jobMessage }}</div>
      </el-descriptions-item>
      <el-descriptions-item v-if="data.status == 1" label="异常信息" :span="2">
        <div>{{ data.exceptionInfo }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="执行时间" :span="2">
        <div>{{ data.createTime }}</div>
      </el-descriptions-item>
    </el-descriptions>
  </ele-modal>
</template>

<script setup>
  import { useMobile } from '@/utils/use-mobile';

  const emit = defineEmits(['update:modelValue']);

  defineProps({
    // 弹窗是否打开
    modelValue: Boolean,
    // 修改回显的数据
    data: Object
  });

  /* 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  const { mobile } = useMobile();
</script>

<style lang="scss" scoped>
  .detail-table :deep(.el-descriptions__label) {
    width: 88px;
    text-align: right;
    font-weight: normal;
  }
</style>
