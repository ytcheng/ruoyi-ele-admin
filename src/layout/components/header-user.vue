<!-- 用户信息 -->
<template>
  <ele-dropdown
    :items="[
      { title: '个人中心', command: 'profile', icon: User },
      { title: '修改密码', command: 'password', icon: Key },
      {
        title: '退出登录',
        command: 'logout',
        icon: SwitchButton,
        divided: true
      }
    ]"
    :popper-options="{
      modifiers: [{ name: 'offset', options: { offset: [0, 5] } }]
    }"
    @command="onUserDropClick"
  >
    <div class="header-avatar">
      <el-avatar
        :size="28"
        :src="loginUser.avatar"
        :icon="loginUser.avatar ? void 0 : User"
      />
      <span class="hidden-sm-and-down" style="margin-left: 4px">
        {{ loginUser.nickName }}
      </span>
      <el-icon :size="14" style="margin-left: 2px">
        <arrow-down />
      </el-icon>
    </div>
  </ele-dropdown>
  <!-- 修改密码弹窗 -->
  <password-modal v-model="passwordVisible" />
</template>

<script setup>
  import { computed, ref, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessageBox } from 'element-plus/es';
  import { User, ArrowDown, Key, SwitchButton } from '@element-plus/icons-vue';
  import { useUserStore } from '@/store/modules/user';
  import { logout } from '@/utils/common';
  import PasswordModal from './password-modal.vue';

  const { push, currentRoute } = useRouter();
  const userStore = useUserStore();

  // 是否显示修改密码弹窗
  const passwordVisible = ref(false);

  // 当前用户信息
  const loginUser = computed(() => userStore.info ?? {});

  /* 用户信息下拉点击 */
  const onUserDropClick = (command) => {
    if (command === 'password') {
      passwordVisible.value = true;
    } else if (command === 'profile') {
      push('/profile');
    } else if (command === 'logout') {
      // 退出登录
      ElMessageBox.confirm('确定要退出登录吗?', '提示', {
        type: 'warning',
        draggable: true
      })
        .then(() => {
          logout(false, unref(currentRoute).fullPath);
        })
        .catch(() => {});
    }
  };
</script>

<style lang="scss" scoped>
  .header-avatar {
    display: flex;
    align-items: center;
    position: relative;
    height: 100%;
    outline: none;
  }
</style>
