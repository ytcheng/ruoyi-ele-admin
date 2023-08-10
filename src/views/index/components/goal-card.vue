<!-- 本月目标 -->
<template>
  <ele-card :header="title" :body-style="{ height: '370px' }">
    <template #extra>
      <more-icon @command="onCommand" />
    </template>
    <div class="workplace-goal">
      <el-progress
        :width="180"
        :percentage="80"
        type="dashboard"
        :format="() => ''"
      />
      <div class="workplace-goal-body">
        <el-tag
          size="large"
          :disable-transitions="true"
          style="width: 36px; height: 36px; border-radius: 50%"
        >
          <el-icon style="cursor: default; border-radius: 0">
            <trophy-base />
          </el-icon>
        </el-tag>
        <div style="font-size: 40px">285</div>
      </div>
      <div>恭喜, 本月目标已达标!</div>
    </div>
  </ele-card>
</template>

<script setup>
  import { TrophyBase } from '@element-plus/icons-vue';
  import MoreIcon from './more-icon.vue';

  defineProps({
    title: String
  });

  const emit = defineEmits(['command']);

  const onCommand = (command) => {
    emit('command', command);
  };
</script>

<style lang="scss" scoped>
  .workplace-goal {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    .workplace-goal-body {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 180px;
      margin: -48px 0 0 -90px;
      text-align: center;
    }
  }
</style>
