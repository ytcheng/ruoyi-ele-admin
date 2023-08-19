<template>
  <ele-page :multi-card="false">
    <div class="user-wrapper">
      <user-card :data="loginUser" @done="updateLoginUser" class="user-side" />
      <user-form :data="loginUser" @done="updateLoginUser" class="user-body" />
    </div>
  </ele-page>
</template>

<script setup>
  import { computed } from 'vue';
  import { EleMessage } from 'ele-admin-plus/es';
  import { useUserStore } from '@/store/modules/user';
  import UserCard from './components/user-card.vue';
  import UserForm from './components/user-form.vue';
  import { getUserProfile } from '@/api/profile';

  const userStore = useUserStore();

  // 登录用户信息
  const loginUser = computed(() => userStore.info ?? {});

  /* 更新登录用户信息 */
  const updateLoginUser = (data) => {
    userStore.setInfo({ ...loginUser.value, ...data });
  };

  // 查询数据
  getUserProfile()
    .then((res) => {
      const info = res.data || {};
      updateLoginUser({
        ...info,
        postGroup: res.postGroup,
        roleGroup: res.roleGroup
      });
    })
    .catch((e) => {
      EleMessage.error(e.message);
    });
</script>

<script>
  export default {
    name: 'Profile'
  };
</script>

<style lang="scss" scoped>
  .user-wrapper {
    display: flex;

    .user-side {
      width: 320px;
      margin: 0 16px 0 0;
      flex-shrink: 0;
    }

    .user-body {
      flex: 1;
    }
  }

  @media screen and (max-width: 928px) {
    .user-wrapper .user-side {
      width: 240px;
    }
  }

  @media screen and (max-width: 768px) {
    .user-wrapper {
      display: block;

      .user-side {
        width: auto;
        margin: 0 0 16px 0;
      }
    }
  }
</style>
