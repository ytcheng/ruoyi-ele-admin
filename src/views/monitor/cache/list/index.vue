<template>
  <ele-page
    flex-table
    hide-footer
    :multi-card="false"
    style="min-height: 246px"
  >
    <el-row :gutter="16" style="height: 100%">
      <el-col :md="8" :sm="24" :xs="24" style="height: 100%">
        <ele-card flex-table style="height: 100%">
          <template #header>
            <el-icon :size="17" style="vertical-align: -2px; margin-right: 8px">
              <Coin />
            </el-icon>
            <span>缓存列表</span>
          </template>
          <template #extra>
            <ele-popconfirm
              :width="208"
              placement="bottom-end"
              :title="'是否确认清空全部缓存？'"
              :popper-options="{
                modifiers: [{ name: 'offset', options: { offset: [20, 6] } }]
              }"
              @confirm="clearAll"
            >
              <template #reference>
                <div>
                  <ele-tooltip content="清空" placement="top" :offset="4">
                    <ele-text
                      type="danger"
                      :icon="Delete"
                      :icon-props="{ size: 16 }"
                      style="cursor: pointer"
                    />
                  </ele-tooltip>
                </div>
              </template>
            </ele-popconfirm>
          </template>
          <ele-pro-table
            ref="tableRef"
            row-key="cacheName"
            :columns="columns"
            :datasource="datasource"
            v-model:current="current"
            highlight-current-row
            :row-style="{ cursor: 'pointer' }"
            :pagination="false"
            :toolbar="false"
            :bottom-line="false"
          >
            <template #action="{ row }">
              <div @click.stop="">
                <ele-popconfirm
                  :width="208"
                  placement="top-end"
                  :title="'是否确认清空“' + row.cacheName + '”？'"
                  :popper-options="{
                    modifiers: [
                      { name: 'offset', options: { offset: [20, 6] } }
                    ]
                  }"
                  @confirm="clear(row)"
                >
                  <template #reference>
                    <el-link type="danger" :underline="false">清空</el-link>
                  </template>
                </ele-popconfirm>
              </div>
            </template>
          </ele-pro-table>
        </ele-card>
      </el-col>
      <el-col :md="8" :sm="24" :xs="24" style="height: 100%">
        <ele-card flex-table style="height: 100%">
          <template #header>
            <el-icon :size="17" style="vertical-align: -3px; margin-right: 8px">
              <Key />
            </el-icon>
            <span>键名列表</span>
          </template>
          <template #extra>
            <ele-tooltip content="刷新" placement="top" :offset="4">
              <ele-text
                type="primary"
                :icon="RefreshRight"
                :icon-props="{ size: 17 }"
                style="cursor: pointer"
                @click="queryKeys"
              />
            </ele-tooltip>
          </template>
          <ele-pro-table
            row-key="cacheKey"
            :columns="columns2"
            :datasource="datasource2"
            :loading="keyLoading"
            :load-on-created="false"
            v-model:current="current2"
            highlight-current-row
            :row-style="{ cursor: 'pointer' }"
            :pagination="{
              layout: 'total, prev, pager, next',
              hideOnSinglePage: true
            }"
            :toolbar="false"
            :bottom-line="false"
          >
            <template #action="{ row }">
              <div @click.stop="">
                <ele-popconfirm
                  :width="208"
                  placement="top-end"
                  :title="'是否确认删除“' + row.cacheKey + '”？'"
                  :popper-options="{
                    modifiers: [
                      { name: 'offset', options: { offset: [20, 6] } }
                    ]
                  }"
                  @confirm="remove(row)"
                >
                  <template #reference>
                    <el-link type="danger" :underline="false">删除</el-link>
                  </template>
                </ele-popconfirm>
              </div>
            </template>
          </ele-pro-table>
        </ele-card>
      </el-col>
      <el-col :md="8" :sm="24" :xs="24" style="height: 100%">
        <ele-card flex-table style="height: 100%">
          <template #header>
            <el-icon
              :size="17"
              style="vertical-align: -2.5px; margin-right: 8px"
            >
              <Document />
            </el-icon>
            <span>缓存内容</span>
          </template>
          <template #extra>
            <ele-tooltip content="刷新" placement="top" :offset="4">
              <ele-text
                type="primary"
                :icon="RefreshRight"
                :icon-props="{ size: 17 }"
                style="cursor: pointer"
                @click="query"
              />
            </ele-tooltip>
          </template>
          <ele-loading :loading="loading">
            <el-descriptions :border="true" :column="1" class="detail-table">
              <el-descriptions-item label="缓存名称">
                <div>{{ data.cacheName }}</div>
              </el-descriptions-item>
              <el-descriptions-item label="缓存键名">
                <div style="word-break: break-all">{{ data.cacheKey }}</div>
              </el-descriptions-item>
              <el-descriptions-item label="缓存内容">
                <div style="word-break: break-all">{{ data.cacheValue }}</div>
              </el-descriptions-item>
            </el-descriptions>
          </ele-loading>
        </ele-card>
      </el-col>
    </el-row>
  </ele-page>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import {
    Coin,
    Key,
    Document,
    Delete,
    RefreshRight
  } from '@element-plus/icons-vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import {
    getCacheNames,
    getCacheKeys,
    getCacheValue,
    clearCacheName,
    clearCacheKey,
    clearCacheAll
  } from '@/api/monitor/cache';

  // 表格实例
  const tableRef = ref(null);

  // 表格列配置
  const columns = ref([
    {
      type: 'index',
      columnKey: 'index',
      width: 48,
      align: 'center',
      showOverflowTooltip: true
    },
    {
      prop: 'cacheName',
      label: '缓存名称',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 80,
      formatter: (row) => row.cacheName.replace(':', '')
    },
    {
      prop: 'remark',
      label: '备注',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 80
    },
    {
      columnKey: 'action',
      label: '操作',
      width: 80,
      align: 'center',
      slot: 'action'
    }
  ]);

  // 表格列配置
  const columns2 = ref([
    {
      type: 'index',
      columnKey: 'index',
      width: 48,
      align: 'center',
      showOverflowTooltip: true
    },
    {
      prop: 'cacheKey',
      label: '缓存键名',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 80,
      formatter: (row) => row.cacheKey.replace(row.cacheName, '')
    },
    {
      columnKey: 'action',
      label: '操作',
      width: 80,
      align: 'center',
      slot: 'action'
    }
  ]);

  // 表格选中数据
  const current = ref(null);

  // 表格选中数据
  const current2 = ref(null);

  // 表格数据源
  const datasource = () => {
    return getCacheNames();
  };

  // 键名列表
  const datasource2 = ref([]);

  // 键名列表请求状态
  const keyLoading = ref(false);

  // 选中数据
  const data = ref({});

  // 请求状态
  const loading = ref(false);

  /* 清空 */
  const clear = (row) => {
    const loading = EleMessage.loading('请求中..');
    clearCacheName(row.cacheName)
      .then(() => {
        loading.close();
        EleMessage.success('清空成功');
        tableRef.value?.reload?.();
      })
      .catch((e) => {
        loading.close();
        EleMessage.error(e.message);
      });
  };

  /* 删除 */
  const remove = (row) => {
    const loading = EleMessage.loading('请求中..');
    clearCacheKey(row.cacheKey)
      .then(() => {
        loading.close();
        EleMessage.success('删除成功');
        queryKeys();
      })
      .catch((e) => {
        loading.close();
        EleMessage.error(e.message);
      });
  };

  /* 清空全部 */
  const clearAll = () => {
    const loading = EleMessage.loading('请求中..');
    clearCacheAll()
      .then(() => {
        loading.close();
        EleMessage.success('清空成功');
        tableRef.value?.reload?.();
      })
      .catch((e) => {
        loading.close();
        EleMessage.error(e.message);
      });
  };

  /* 查询键名列表 */
  const queryKeys = () => {
    if (!current.value) {
      datasource2.value = [];
      return;
    }
    keyLoading.value = true;
    getCacheKeys(current.value?.cacheName)
      .then((result) => {
        keyLoading.value = false;
        datasource2.value = result.map((d) => {
          return { cacheKey: d, cacheName: current.value.cacheName };
        });
      })
      .catch((e) => {
        keyLoading.value = false;
        EleMessage.error(e.message);
      });
  };

  /* 刷新 */
  const query = () => {
    if (current.value && current2.value) {
      loading.value = true;
      getCacheValue(current.value?.cacheName, current2.value?.cacheKey)
        .then((result) => {
          loading.value = false;
          data.value = result;
        })
        .catch((e) => {
          loading.value = false;
          EleMessage.error(e.message);
        });
    } else {
      data.value = {};
    }
  };

  /* 查询键名列表 */
  watch(current, () => {
    queryKeys();
  });

  /* 查询缓存内容 */
  watch(current2, () => {
    query();
  });
</script>

<script>
  export default {
    name: 'MonitorCacheList'
  };
</script>

<style lang="scss" scoped>
  .detail-table :deep(.el-descriptions__label) {
    width: 88px;
    text-align: right;
    font-weight: normal;
  }

  @media screen and (max-width: 992px) {
    .ele-card {
      height: calc(100% - 16px) !important;
    }
  }
</style>
