<!-- eslint-disable vue/no-v-html -->
<template>
  <ele-modal
    :width="1000"
    title="代码预览"
    position="center"
    :body-style="{ padding: '0 16px 16px 16px', height: 'calc(100vh - 86px)' }"
    :model-value="modelValue"
    @update:modelValue="updateModelValue"
    @opened="onOpened"
  >
    <ele-loading :loading="loading" class="code-wrapper">
      <ele-tabs
        v-if="data.length"
        :items="data"
        v-model="active"
        :mousewheel="true"
      >
        <template v-for="d in data" :key="d.name" #[d.name]="{ item }">
          <pre v-html="item.meta?.code" class="code-view"></pre>
        </template>
      </ele-tabs>
    </ele-loading>
  </ele-modal>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { previewCode } from '@/api/tool/gen';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';
  import java from 'highlight.js/lib/languages/java';
  import xml from 'highlight.js/lib/languages/xml';
  import sql from 'highlight.js/lib/languages/sql';

  hljs.registerLanguage('java', java);
  hljs.registerLanguage('xml', xml);
  hljs.registerLanguage('sql', sql);
  hljs.registerLanguage('vue', xml);

  const emit = defineEmits(['update:modelValue']);

  const props = defineProps({
    // 是否显示
    modelValue: Boolean,
    // 代码生成id
    id: Number
  });

  // 请求状态
  const loading = ref(true);

  // 数据
  const data = ref([]);

  // 页签选中
  const active = ref();

  /* 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };

  /* 查询 */
  const query = () => {
    loading.value = true;
    previewCode(props.id)
      .then((result) => {
        loading.value = false;
        const temp = [];
        Object.keys(result).forEach((k) => {
          const name = k.substring(k.lastIndexOf('/') + 1, k.indexOf('.vm'));
          const language = name.substring(name.indexOf('.') + 1, name.length);
          temp.push({
            name,
            label: name,
            meta: {
              language,
              code: hljs.highlight(result[k], { language }).value
            }
          });
        });
        active.value = temp[0]?.name;
        data.value = temp;
      })
      .catch((e) => {
        loading.value = false;
        EleMessage.error(e.message);
      });
  };

  /* 查询数据 */
  const onOpened = () => {
    if (props.id) {
      query();
    }
  };

  watch(
    () => props.modelValue,
    (modelValue) => {
      if (!modelValue) {
        data.value = [];
      }
    }
  );
</script>

<style lang="scss" scoped>
  .code-view {
    color: #e6edf3;
    background: #161b22;
    padding: 16px;
    border-radius: 8px;
    box-sizing: border-box;
    margin: 0;
    height: 100%;
    overflow: auto;
  }

  .code-wrapper {
    height: 100%;

    :deep(.ele-tabs) {
      height: 100%;
      display: flex;
      flex-direction: column;

      .el-tabs__header {
        flex-shrink: 0;
      }

      .el-tabs__content {
        flex: 1;
        padding-top: 10px;
      }

      .el-tab-pane {
        height: 100%;
      }
    }
  }
</style>
