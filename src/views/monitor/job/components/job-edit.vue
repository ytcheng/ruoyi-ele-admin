<!-- 编辑弹窗 -->
<template>
  <ele-modal
    form
    :width="640"
    :model-value="modelValue"
    :body-style="{ paddingLeft: '8px' }"
    :title="isUpdate ? '修改定时任务' : '添加定时任务'"
    @update:modelValue="updateModelValue"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-row :gutter="16">
        <el-col :sm="12" :xs="24">
          <el-form-item label="任务名称" prop="jobName">
            <el-input
              clearable
              :maxlength="20"
              v-model="form.jobName"
              placeholder="请输入任务名称"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="任务分组" prop="jobGroup">
            <dict-data
              code="sys_job_group"
              v-model="form.jobGroup"
              placeholder="请选择任务分组"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="invokeTarget">
        <template #label>
          <ele-tooltip>
            <el-icon
              :size="16"
              style="align-self: center; margin-right: 2px; cursor: help"
            >
              <warning style="opacity: 0.6" />
            </el-icon>
            <template #content>
              <div>Bean调用示例: ryTask.ryParams('ry')</div>
              <div>
                Class类调用示例: com.ruoyi.quartz.task.RyTask.ryParams('ry')
              </div>
              <div>参数说明: 支持字符串，布尔类型，长整型，浮点型，整型</div>
            </template>
          </ele-tooltip>
          <span>调用方法</span>
        </template>
        <el-input
          clearable
          :maxlength="200"
          v-model="form.invokeTarget"
          placeholder="请输入调用目标字符串"
        />
      </el-form-item>
      <el-form-item label="cron表达式" prop="cronExpression">
        <el-input
          clearable
          :maxlength="200"
          v-model="form.cronExpression"
          placeholder="请输入cron执行表达式"
        >
          <template #append>
            <el-button class="ele-btn-icon" @click="openCron">
              <span>生成表达式</span>
              <el-icon style="margin: 0 -3px 0 4px">
                <Clock />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="执行策略" prop="misfirePolicy">
        <el-radio-group v-model="form.misfirePolicy">
          <el-radio-button label="1">立即执行</el-radio-button>
          <el-radio-button label="2">执行一次</el-radio-button>
          <el-radio-button label="3">放弃执行</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否并发" prop="concurrent">
        <el-radio-group v-model="form.concurrent">
          <el-radio-button label="0">允许</el-radio-button>
          <el-radio-button label="1">禁止</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态">
        <dict-data code="sys_job_status" type="radio" v-model="form.status" />
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
  import { Warning, Clock } from '@element-plus/icons-vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { useFormData } from '@/utils/use-form-data';
  import { addJob, updateJob } from '@/api/monitor/job';

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
    jobId: void 0,
    jobName: '',
    jobGroup: void 0,
    invokeTarget: '',
    cronExpression: '',
    misfirePolicy: '1',
    concurrent: '0',
    status: '0'
  });

  // 表单验证规则
  const rules = reactive({
    jobName: [
      {
        required: true,
        message: '请输入任务名称',
        type: 'string',
        trigger: 'blur'
      }
    ],
    invokeTarget: [
      {
        required: true,
        message: '请输入调用目标字符串',
        type: 'string',
        trigger: 'blur'
      }
    ],
    cronExpression: [
      {
        required: true,
        message: '请输入cron执行表达式',
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
      const saveOrUpdate = isUpdate.value ? updateJob : addJob;
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

  /* 打开cron表达式生成 */
  const openCron = () => {
    window.open('https://www.matools.com/app/cron?embed');
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
