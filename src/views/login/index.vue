<template>
  <div class="login-wrapper">
    <ele-card shadow="always" class="login-card">
      <div class="login-cover">
        <h1 class="login-title">RuoYi EleAdmin</h1>
        <h4 class="login-subtitle">界面美观组件丰富的中后台前端解决方案</h4>
      </div>
      <div class="login-body">
        <ele-text type="heading" style="font-size: 24px; margin-bottom: 18px">
          用户登录
        </ele-text>
        <ele-segmented
          v-model="tabActive"
          :items="[
            { label: '密码登录', value: 1 },
            { label: '扫码登录', value: 2 }
          ]"
          style="margin-bottom: 18px"
          @change="onTabChange"
        />
        <el-form
          v-if="tabActive == 1"
          ref="formRef"
          size="large"
          :model="form"
          :rules="rules"
          @keyup.enter="submit"
        >
          <el-form-item prop="username">
            <el-input
              clearable
              v-model="form.username"
              placeholder="请输入登录账号"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              show-password
              v-model="form.password"
              placeholder="请输入登录密码"
              :prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item prop="code">
            <div class="login-captcha-group">
              <el-input
                clearable
                v-model="form.code"
                placeholder="请输入验证码"
                :prefix-icon="ProtectOutlined"
              />
              <div class="login-captcha" @click="changeCaptcha">
                <img v-if="captcha" :src="captcha" />
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.remember">记住密码</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              size="large"
              type="primary"
              :loading="loading"
              style="width: 100%"
              @click="submit"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <div v-else class="login-qrcode-group">
          <ele-qr-code-svg
            :size="180"
            :margin="2"
            :value="qrcode"
            class="login-qrcode"
          />
          <div style="margin-top: 16px; cursor: pointer" @click="refreshQrCode">
            <el-icon :size="17" style="vertical-align: -3px; margin-right: 6px">
              <refresh-right />
            </el-icon>
            <span>刷新二维码</span>
          </div>
        </div>
      </div>
    </ele-card>
  </div>
</template>

<script setup>
  import { ref, reactive, unref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { EleMessage } from 'ele-admin-plus/es';
  import { User, Lock, RefreshRight } from '@element-plus/icons-vue';
  import { ProtectOutlined } from '@/components/icons';
  import { getToken } from '@/utils/token-util';
  import { usePageTab } from '@/utils/use-page-tab';
  import { login, getCaptcha } from '@/api/login';

  const { currentRoute } = useRouter();
  const { goHomeRoute, cleanPageTabs } = usePageTab();

  // 页签选中
  const tabActive = ref(1);

  // 表单
  const formRef = ref();

  // 加载状态
  const loading = ref(false);

  // 表单数据
  const form = reactive({
    username: 'admin',
    password: 'admin123',
    code: '',
    uuid: '',
    remember: true
  });

  // 表单验证规则
  const rules = computed(() => {
    return {
      username: [
        {
          required: true,
          message: '请输入登录账号',
          type: 'string',
          trigger: 'blur'
        }
      ],
      password: [
        {
          required: true,
          message: '请输入登录密码',
          type: 'string',
          trigger: 'blur'
        }
      ],
      code: [
        {
          required: true,
          message: '请输入验证码',
          type: 'string',
          trigger: 'blur'
        }
      ]
    };
  });

  // 图形验证码
  const captcha = ref('');

  // 二维码
  const qrcode = ref('');

  /* 提交 */
  const submit = () => {
    formRef.value?.validate((valid) => {
      if (!valid) {
        return false;
      }
      loading.value = true;
      login(form)
        .then(() => {
          EleMessage.success('登录成功');
          cleanPageTabs();
          goHome();
        })
        .catch((e) => {
          loading.value = false;
          EleMessage.error(e.message);
          changeCaptcha();
        });
    });
  };

  /* 获取图形验证码 */
  const changeCaptcha = () => {
    getCaptcha()
      .then((data) => {
        captcha.value = `data:image/gif;base64,${data.img}`;
        form.uuid = data.uuid;
        formRef.value?.clearValidate();
      })
      .catch((e) => {
        EleMessage.error(e.message);
      });
  };

  /* 刷新二维码 */
  const refreshQrCode = () => {
    qrcode.value = `https://api.eleadmin.com/v2/auth/login?code=${new Date().getTime()}`;
  };

  /* 选项卡切换事件 */
  const onTabChange = (active) => {
    if (active === 2) {
      refreshQrCode();
    }
  };

  /* 跳转到首页 */
  const goHome = () => {
    const { query } = unref(currentRoute);
    goHomeRoute(query.from);
  };

  // 如果已登录直接进入首页
  if (getToken()) {
    goHome();
  } else {
    changeCaptcha();
  }
</script>

<style lang="scss" scoped>
  .login-wrapper {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url('/src/assets/login-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .login-card {
      width: 920px;
      max-width: 100%;
      overflow: hidden;

      :deep(.el-card__body) {
        display: flex;
        padding: 0;
        height: 462px;
      }
    }
  }

  .login-cover {
    flex: 1;
    padding: 36px 8px;
    box-sizing: border-box;
    background-color: #1681fd;
    background-image: url('/src/assets/login-img.png');
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: contain;
    text-align: center;
  }

  .login-body {
    width: 400px;
    flex-shrink: 0;
    padding: 32px 48px 0 48px;
    box-sizing: border-box;

    :deep(.el-checkbox) {
      height: auto;

      .el-checkbox__label {
        color: inherit;
      }
    }

    :deep(.el-input__prefix-inner > .el-icon) {
      margin-right: 12px;
      transform: scale(1.26) translateY(-1px);
    }
  }

  // 验证码
  .login-captcha-group {
    width: 100%;
    display: flex;
    align-items: center;

    :deep(.el-input) {
      flex: 1;
    }

    .login-captcha {
      width: 108px;
      height: 40px;
      margin-left: 8px;
      border-radius: 4px;
      border: 1px solid hsla(0, 0%, 60%, 0.46);
      transition: border 0.2s;
      box-sizing: border-box;
      background: #fff;
      overflow: hidden;
      cursor: pointer;

      img {
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        margin: -2px 0 0 -2px;
        display: block;
      }

      &:hover {
        border-color: hsla(0, 0%, 60%, 0.8);
      }
    }

    :deep(.el-input__prefix-inner > .el-icon) {
      transform: scale(1.16);
    }
  }

  // 标题
  .login-title {
    color: rgba(255, 255, 255, 0.98);
    font-size: 26px;
    margin: 0 0 6px 0;
    font-weight: normal;
    font-family: 'AliPuHui';
    letter-spacing: 1.2px;
  }

  .login-subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    margin: 0;
    font-weight: normal;
    font-family: 'AliPuHui';
    letter-spacing: 4px;
  }

  /* 阿里巴巴普惠体 */
  @font-face {
    font-family: 'AliPuHui';
    font-weight: 300;
    src: (
      url('//at.alicdn.com/wf/webfont/jWZHcEP2lzge/5AfKUTWZEo8W.woff2')
        format('woff2'),
      url('//at.alicdn.com/wf/webfont/jWZHcEP2lzge/Dvhs41TtRdYF.woff')
        format('woff')
    );
    font-display: swap;
  }

  // 二维码
  .login-qrcode-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
  }

  .login-qrcode {
    font-size: 0;
    display: inline-block;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }

  // 小屏幕适应
  @media screen and (max-width: 680px) {
    .login-wrapper {
      padding: 0;
      display: block;
      background: #fff;

      .login-card {
        width: 100%;
        background: none;
        box-shadow: none;
        border-radius: 0;

        :deep(.el-card__body) {
          display: block;
          height: auto;
        }
      }
    }

    .login-cover {
      padding: 24px 12px 100px 12px;
      background-size: auto 100px;
    }

    .login-body {
      width: 100%;
    }
  }
</style>

<style lang="scss">
  html.dark .login-wrapper {
    background: #000;
    filter: brightness(0.88);
  }
</style>
