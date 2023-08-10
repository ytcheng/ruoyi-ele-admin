<!-- 用户信息 -->
<template>
  <ele-card :body-style="{ padding: '20px' }">
    <div class="profile-wrapper">
      <div class="profile-main">
        <el-avatar :size="68" :src="loginUser.avatar" class="profile-avatar" />
        <div class="profile-body">
          <ele-text size="xl" type="heading" style="font-weight: normal">
            早安, {{ loginUser.nickname }}, 开始您一天的工作吧!
          </ele-text>
          <ele-text type="placeholder" :icon="PartlyCloudy">
            今日多云转阴, 18℃ ~ 22℃, 出门记得穿外套哦~
          </ele-text>
        </div>
      </div>
      <div class="profile-count">
        <div class="profile-count-item">
          <div class="profile-count-header">
            <el-tag size="large" :disable-transitions="true">
              <el-icon>
                <briefcase />
              </el-icon>
            </el-tag>
            <span class="profile-count-name">项目数</span>
          </div>
          <ele-text size="xl" type="heading" style="font-weight: normal">
            3
          </ele-text>
        </div>
        <div class="profile-count-item">
          <div class="profile-count-header">
            <el-tag size="large" type="warning" :disable-transitions="true">
              <el-icon>
                <checked />
              </el-icon>
            </el-tag>
            <span class="profile-count-name">待办项</span>
          </div>
          <ele-text size="xl" type="heading" style="font-weight: normal">
            6 / 24
          </ele-text>
        </div>
        <div class="profile-count-item">
          <div class="profile-count-header">
            <el-tag size="large" type="success" :disable-transitions="true">
              <el-icon>
                <bell-filled />
              </el-icon>
            </el-tag>
            <span class="profile-count-name">消息</span>
          </div>
          <ele-text size="xl" type="heading" style="font-weight: normal">
            1,689
          </ele-text>
        </div>
      </div>
    </div>
  </ele-card>
</template>

<script setup>
  import { computed } from 'vue';
  import {
    PartlyCloudy,
    Briefcase,
    Checked,
    BellFilled
  } from '@element-plus/icons-vue';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();

  // 当前登录用户信息
  const loginUser = computed(() => userStore.info ?? {});
</script>

<style lang="scss" scoped>
  .profile-wrapper {
    display: flex;
    align-items: center;

    .profile-main {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;

      .profile-avatar {
        flex-shrink: 0;
      }

      .profile-body {
        flex: 1;
        padding-left: 12px;
        box-sizing: border-box;
      }

      h4 {
        margin-bottom: 6px;
      }
    }
  }

  .profile-count {
    flex-shrink: 0;
    text-align: right;
    white-space: nowrap;

    .profile-count-item {
      display: inline-block;
      margin: 0 4px 0 24px;

      .el-tag {
        width: 26px;
        height: 26px;
        border-radius: 50%;

        :deep(.el-icon) {
          cursor: default;
          border-radius: 0;
        }
      }

      .profile-count-name {
        margin-left: 8px;
      }

      .profile-count-header {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
      }
    }
  }

  @media screen and (max-width: 992px) {
    .profile-count .profile-count-item {
      margin: 0 2px 0 12px;
    }
  }

  @media screen and (max-width: 768px) {
    .profile-wrapper {
      display: block;

      .profile-count {
        margin-top: 14px;
      }
    }
  }
</style>
