<template>
  <ele-modal
    :width="460"
    title="用户导入"
    :body-style="{ paddingTop: '8px' }"
    :model-value="modelValue"
    @update:modelValue="updateModelValue"
  >
    <div v-loading="loading">
      <el-upload
        drag
        action=""
        accept=".xls,.xlsx"
        :show-upload-list="false"
        :before-upload="doUpload"
      >
        <ele-text
          type="placeholder"
          :icon="UploadFilled"
          :icon-props="{ size: 68, style: { opacity: 0.6 } }"
        />
        <ele-text type="placeholder">将文件拖到此处, 或点击上传</ele-text>
      </el-upload>
    </div>
    <div style="display: flex; align-items: center">
      <ele-text size="xs" type="secondary" style="line-height: 17px; flex: 1">
        <span style="padding-right: 8px">只能上传 xls、xlsx 文件,</span>
        <el-link
          type="primary"
          :underline="false"
          style="font-size: inherit; line-height: inherit; vertical-align: 0"
          @click="onDownload"
        >
          下载模板
        </el-link>
      </ele-text>
      <el-checkbox v-model="isUpdate" style="height: 18px; flex-shrink: 0">
        更新已存在用户
      </el-checkbox>
    </div>
  </ele-modal>
</template>

<script setup>
  import { ref, h } from 'vue';
  import { UploadFilled } from '@element-plus/icons-vue';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from 'ele-admin-plus/es';
  import { importUsers, downloadTemplate } from '@/api/system/user';

  const emit = defineEmits(['done', 'update:modelValue']);

  defineProps({
    // 是否打开弹窗
    modelValue: Boolean
  });

  // 导入请求状态
  const loading = ref(false);

  // 是否更新已存在数据
  const isUpdate = ref(false);

  /* 上传 */
  const doUpload = (file) => {
    if (
      ![
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ].includes(file.type)
    ) {
      EleMessage.error('只能选择 excel 文件');
      return false;
    }
    if (file.size / 1024 / 1024 > 10) {
      EleMessage.error('大小不能超过 10MB');
      return false;
    }
    loading.value = true;
    importUsers(file, isUpdate.value)
      .then((msg) => {
        loading.value = false;
        ElMessageBox({
          type: 'success',
          title: '导入结果',
          message: h('div', { innerHTML: msg }),
          customStyle: { maxWidth: '442px' }
        });
        updateModelValue(false);
        emit('done');
      })
      .catch((e) => {
        loading.value = false;
        ElMessageBox({
          type: 'error',
          title: '导入结果',
          message: h('div', { innerHTML: e.message }),
          customStyle: { maxWidth: '442px' }
        });
      });
    return false;
  };

  /* 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  /* 下载模板 */
  const onDownload = () => {
    const loading = EleMessage.loading('请求中..');
    downloadTemplate()
      .then(() => {
        loading.close();
      })
      .catch((e) => {
        loading.close();
        EleMessage.error(e.message);
      });
  };
</script>
