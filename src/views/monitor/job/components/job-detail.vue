<template>
  <ele-modal
    title="任务详情"
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
      <el-descriptions-item label="任务编号">
        <div>{{ data.jobId }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="任务名称">
        <div>{{ data.jobName }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="任务分组">
        <div>{{ data.jobGroup }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        <div>{{ data.createTime }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="调用目标方法" :span="2">
        <div>{{ data.invokeTarget }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="cron表达式" :span="2">
        <div>{{ data.cronExpression }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="下次执行时间">
        <div>{{ data.nextValidTime }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="任务状态">
        <dict-data
          code="sys_job_status"
          type="tag"
          :model-value="data.status"
        />
      </el-descriptions-item>
      <el-descriptions-item label="是否并发">
        <div v-if="data.concurrent == 0">允许</div>
        <div v-else-if="data.concurrent == 1">禁止</div>
      </el-descriptions-item>
      <el-descriptions-item label="执行策略">
        <div v-if="data.misfirePolicy == 0">默认策略</div>
        <div v-else-if="data.misfirePolicy == 1">立即执行</div>
        <div v-else-if="data.misfirePolicy == 2">执行一次</div>
        <div v-else-if="data.misfirePolicy == 3">放弃执行</div>
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
    width: 120px;
    text-align: right;
    font-weight: normal;
  }
</style>
