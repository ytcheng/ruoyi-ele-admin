<!-- 小组成员 -->
<template>
  <ele-card
    :header="title"
    :body-style="{ padding: '8px 0px', height: '370px' }"
  >
    <template #extra>
      <more-icon @command="onCommand" />
    </template>
    <div v-for="item in userList" :key="item.id" class="user-list-item">
      <el-avatar :size="46" :src="item.avatar" style="flex-shrink: 0" />
      <div class="user-list-item-body">
        <div>{{ item.name }}</div>
        <ele-ellipsis type="placeholder" size="sm">
          {{ item.introduction }}
        </ele-ellipsis>
      </div>
      <div style="flex-shrink: 0">
        <el-tag
          v-if="item.status === 0"
          size="small"
          type="success"
          :disable-transitions="true"
        >
          在线
        </el-tag>
        <el-tag v-else size="small" type="danger" :disable-transitions="true">
          离线
        </el-tag>
      </div>
    </div>
  </ele-card>
</template>

<script setup>
  import { ref } from 'vue';
  import MoreIcon from './more-icon.vue';

  defineProps({
    title: String
  });

  const emit = defineEmits(['command']);

  // 小组成员数据
  const userList = ref([]);

  /* 查询小组成员 */
  const queryUserList = () => {
    userList.value = [
      {
        id: 1,
        name: 'SunSmile',
        introduction: 'UI设计师、交互专家',
        status: 0,
        avatar:
          'https://cdn.eleadmin.com/20200609/c184eef391ae48dba87e3057e70238fb.jpg'
      },
      {
        id: 2,
        name: '你的名字很好听',
        introduction: '前端工程师',
        status: 0,
        avatar:
          'https://cdn.eleadmin.com/20200609/b6a811873e704db49db994053a5019b2.jpg'
      },
      {
        id: 3,
        name: '全村人的希望',
        introduction: '前端工程师',
        status: 0,
        avatar:
          'https://cdn.eleadmin.com/20200609/948344a2a77c47a7a7b332fe12ff749a.jpg'
      },
      {
        id: 4,
        name: 'Jasmine',
        introduction: '产品经理、项目经理',
        status: 1,
        avatar:
          'https://cdn.eleadmin.com/20200609/f6bc05af944a4f738b54128717952107.jpg'
      },
      {
        id: 5,
        name: '酷酷的大叔',
        introduction: '组长、后端工程师',
        status: 1,
        avatar:
          'https://cdn.eleadmin.com/20200609/2d98970a51b34b6b859339c96b240dcd.jpg'
      }
    ];
  };

  const onCommand = (command) => {
    emit('command', command);
  };

  queryUserList();
</script>

<style lang="scss" scoped>
  .user-list-item {
    display: flex;
    align-items: center;
    padding: 12px 18px;
    transition: background-color 0.2s;
    cursor: pointer;

    .user-list-item-body {
      flex: 1;
      padding-left: 12px;
      box-sizing: border-box;
    }

    & + .user-list-item {
      border-top: 1px solid hsla(0, 0%, 60%, 0.2);
    }

    &:hover {
      background: hsla(0, 0%, 60%, 0.08);
    }
  }
</style>
