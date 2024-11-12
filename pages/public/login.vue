<template>
  <view class="container">
    <view class="left-bottom-sign"></view>
    <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
    <view class="right-top-sign"></view>
    <!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
    <view class="wrapper">
      <view class="left-top-sign">LOGIN</view>
      <view class="welcome">
        欢迎回来！
      </view>
      <button class="confirm-btn" @click="toLogin" :disabled="logining">授权手机号登录</button>
    </view>
  </view>
</template>

<script>
import {
  mapMutations
} from 'vuex';
import {
  memberLogin, memberInfo
} from '@/api/member.js';
import {
  weixinLogin,
} from '@/api/weixin.js';

export default {
  data() {
    return {
      username: '',
      password: '',
      logining: false
    }
  },
  onLoad() {
  },
  methods: {
    ...mapMutations(['login']),
    navBack() {
      uni.navigateBack();
    },
    toRegist() {
      uni.navigateTo({ url: '/pages/public/register' });
    },
    async toLogin() {
      this.logining = true;
      try {
        const code = await this.getWeixinLoginCode();
        const token = await this.getWeixinToken(code);
        this.storeUserCredentials(token);
        const userInfo = await this.getMemberInfo();
        this.login(userInfo);
        uni.navigateBack();
      } catch (err) {
        console.error("登录授权失败", err);
        uni.showToast({
          title: err.message || '登录授权失败',
          icon: 'none'
        });
        this.logining = false;
      }
    },
    async getWeixinLoginCode() {
      const res = await uni.login({
        provider: "weixin",
        onlyAuthorize: true // 微信登录仅请求授权认证
      });
      if (res[1].errMsg !== "login:ok") {
        throw new Error('微信登录失败');
      }
      return res[1].code;
    },
    async getWeixinToken(code) {
      const response = await weixinLogin({ jsCode: code });
      if (response.code !== 200) {
        throw new Error('获取微信 Token 失败');
      }
      return response.data.tokenHead + response.data.token;
    },
    storeUserCredentials(token) {
      uni.setStorageSync('token', token);
      uni.setStorageSync('username', this.username);
      uni.setStorageSync('password', this.password);
    },
    async getMemberInfo() {
      const response = await memberInfo();
      if (response.code !== 200) {
        throw new Error('获取用户信息失败');
      }
      return response.data;
    }
  }
}
</script>

<style lang='scss'>
page {
  background: #fff;
}

.container {
  padding-top: 115px;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}

.wrapper {
  position: relative;
  z-index: 90;
  background: #fff;
  padding-bottom: 40upx;
}

.back-btn {
  position: absolute;
  left: 40upx;
  z-index: 9999;
  padding-top: var(--status-bar-height);
  top: 40upx;
  font-size: 40upx;
  color: $font-color-dark;
}

.left-top-sign {
  font-size: 120upx;
  color: $page-color-base;
  position: relative;
  left: -16upx;
}

.right-top-sign {
  position: absolute;
  top: 80upx;
  right: -30upx;
  z-index: 95;

  &:before,
  &:after {
    display: block;
    content: "";
    width: 400upx;
    height: 80upx;
    background: #b4f3e2;
  }

  &:before {
    transform: rotate(50deg);
    border-radius: 0 50px 0 0;
  }

  &:after {
    position: absolute;
    right: -198upx;
    top: 0;
    transform: rotate(-50deg);
    border-radius: 50px 0 0 0;
    /* background: pink; */
  }
}

.left-bottom-sign {
  position: absolute;
  left: -270upx;
  bottom: -320upx;
  border: 100upx solid #d0d1fd;
  border-radius: 50%;
  padding: 180upx;
}

.welcome {
  position: relative;
  left: 50upx;
  top: -90upx;
  font-size: 46upx;
  color: #555;
  text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
}

.input-content {
  padding: 0 60upx;
}

.input-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 30upx;
  background: $page-color-light;
  height: 120upx;
  border-radius: 4px;
  margin-bottom: 50upx;

  &:last-child {
    margin-bottom: 0;
  }

  .tit {
    height: 50upx;
    line-height: 56upx;
    font-size: $font-sm+2upx;
    color: $font-color-base;
  }

  input {
    height: 60upx;
    font-size: $font-base + 2upx;
    color: $font-color-dark;
    width: 100%;
  }
}

.confirm-btn {
  width: 630upx;
  height: 76upx;
  line-height: 76upx;
  border-radius: 50px;
  margin-top: 70upx;
  background: $uni-color-primary;
  color: #fff;
  font-size: $font-lg;

  &:after {
    border-radius: 100px;
  }
}

.confirm-btn2 {
  width: 630upx;
  height: 76upx;
  line-height: 76upx;
  border-radius: 50px;
  margin-top: 40upx;
  background: $uni-color-primary;
  color: #fff;
  font-size: $font-lg;

  &:after {
    border-radius: 100px;
  }
}

.forget-section {
  font-size: $font-sm+2upx;
  color: $font-color-spec;
  text-align: center;
  margin-top: 40upx;
}

.register-section {
  position: absolute;
  left: 0;
  bottom: 50upx;
  width: 100%;
  font-size: $font-sm+2upx;
  color: $font-color-base;
  text-align: center;

  text {
    color: $font-color-spec;
    margin-left: 10upx;
  }
}
</style>
