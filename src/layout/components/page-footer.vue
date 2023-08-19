<!-- 全局页脚 -->
<template>
  <ele-text
    type="placeholder"
    class="ele-footer"
    style="padding: 16px 0; text-align: center"
  >
    <el-space
      :size="24"
      style="--el-text-color-regular: var(--el-text-color-placeholder)"
    >
      <el-link :underline="false" href="http://doc.ruoyi.vip/" target="_blank">
        RuoYi
      </el-link>
      <el-link
        :underline="false"
        href="https://eleadmin.com/doc/eleadminplus/"
        target="_blank"
      >
        EleAdmin
      </el-link>
    </el-space>
    <div style="margin-top: 8px">
      Copyright © 2023 RuoYi & EleAdmin All Rights Reserved.
    </div>
  </ele-text>
</template>
