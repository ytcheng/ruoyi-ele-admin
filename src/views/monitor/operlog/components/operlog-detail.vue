<template>
  <ele-modal
    title="详情"
    :width="720"
    :body-style="{ paddingTop: '6px' }"
    :model-value="modelValue"
    @update:modelValue="updateModelValue"
  >
    <el-descriptions
      :border="true"
      :column="mobile ? 1 : 2"
      class="detail-table"
    >
      <el-descriptions-item label="操作模块">
        <div>
          <span>{{ data.title }} / </span>
          <dict-data
            code="sys_oper_type"
            type="text"
            :model-value="data.businessType"
          />
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="请求地址">
        <div>{{ data.operUrl }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="请求方式">
        <div>{{ data.requestMethod }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="操作时间">
        <div>{{ data.operTime }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="登录信息" :span="2">
        <div style="word-break: break-all">
          {{ data.operName }} / {{ data.operIp }} / {{ data.operLocation }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="操作方法" :span="2">
        <div style="word-break: break-all">{{ data.method }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="请求参数" :span="2">
        <ele-ellipsis :max-line="4">{{ data.operParam }}</ele-ellipsis>
      </el-descriptions-item>
      <el-descriptions-item label="返回参数" :span="2">
        <ele-ellipsis :max-line="4">
          {{ data.jsonResult }}
        </ele-ellipsis>
      </el-descriptions-item>
      <el-descriptions-item label="操作状态">
        <dict-data
          code="sys_common_status"
          type="tag"
          :model-value="data.status"
        />
      </el-descriptions-item>
      <el-descriptions-item label="消耗时间">
        <div>{{ data.costTime }}毫秒</div>
      </el-descriptions-item>
      <el-descriptions-item v-if="data.status === 1" label="异常信息" :span="2">
        <ele-ellipsis
          :max-line="4"
          :tooltip="{
            popperStyle: {
              width: 'max-content',
              maxWidth: '580px',
              wordBreak: 'break-all'
            },
            offset: 4,
            placement: 'top'
          }"
        >
          {{ data.errorMsg }}
        </ele-ellipsis>
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
