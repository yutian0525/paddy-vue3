<template>
  <div class="box">
    <div ref="vantaRef" style="width: 100%; height: 93vh"></div>

    <div class="banner">
      <div class="box">
        <h2 class="banner-in-box">用户登录</h2>
        <div class="username">
          <el-input class="el-input" v-model="username" placeholder="用户名" >
          </el-input>
        </div>
        <div class="password">
          <el-input class="el-input" v-model="password" placeholder="密码" show-password>
          </el-input>
          </div>
        <div>
          <el-button type="primary" class="button" @click="handlelogin">登录</el-button>
          <el-button type="primary" class="button" @click="jumptoregister">注册</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import WAVES from "vanta/src/vanta.waves";
import { login } from "@/request/HttpApi";

export default {
  
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async handlelogin() {
      try {
        const res = await login(this.username, this.password);
        if (res === 200) {
          this.$message.success("登录成功");
          
          // 等待一小段时间确保localStorage和cookie都已设置
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // 登录成功后跳转到原来要访问的页面，或首页
          const redirect = this.$route.query.redirect || '/';
          
          // 使用replace而不是push，避免在历史记录中留下登录页
          await this.$router.replace(redirect);
        } else {
          this.$message.error("登录失败，请检查用户名和密码");
        }
      } catch (error) {
        console.error('Login error:', error);
        this.$message.error("登录出现错误，请稍后重试");
      }
    },
    async jumptoregister(){
      await this.$router.push("/register")
    }
  },
  async mounted() {
    // 检查是否已经登录（通过cookie自动登录）
    const user = localStorage.getItem('user');
    if (user) {
      // 如果本地存储有用户信息，可以直接跳转或验证token有效性
      try {
        // 这里可以添加一个验证token的接口调用
        // const isValid = await checkAuthStatus();
        // if (isValid) {
        //   this.$router.push("/");
        //   return;
        // }
      } catch (error) {
        // token无效，清除本地存储
        localStorage.removeItem('user');
      }
    }
    this.vantaEffect = WAVES({
      el: this.$refs.vantaRef,
      THREE: THREE,
    });
    WAVES({
      el: this.$refs.vantaRef,
      /*以下为样式配置*/
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x001f3f,
      shininess: 76.0,
      waveHeight: 12.0,
      waveSpeed: 0.95,
      zoom: 0.89,
    });
  },
  beforeDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  },
};
</script>

<style scoped>
.box {
  position: relative;

  .banner {
    z-index: 999;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 93vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .box {
      width: 400px;
      height: 500px;
      background-color: rgba(255, 255, 255, 0.25);
      border: #007157 solid 2px;
      box-shadow: 0px 0px 10px #007157;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;  
      padding-top: 20px;
    }
     .banner-in-box {
      position: absolute;
      top: 20px; /* 调整顶部距离 */
      left: 50%;
      transform: translateX(-50%); /* 水平居中 */
      font-size: 24px;
      margin: 0; /* 移除默认的 margin */
    }

    .username {
      margin-top: 150px; /* 调整这个值以控制输入框与“用户登录”文本之间的间距 */
      width: 300px;
      height: 40px;
      position: relative;
      z-index: 1000; /* 确保在最上层 */
    }
  }
  .password {
    margin-top: 50px; /* 调整这个值以控制输入框与“用户登录”文本之间的间距 */
      width: 300px;
      height: 40px;
      position: relative;
      z-index: 1000; /* 确保在最上层 */
  }
}
.el-input {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  z-index: 1001;
  margin: 0;
}
.button {
  margin-top: 50px; /* 调整这个值以控制输入框与“用户登录”文本之间的间距 */
  position: relative;
  z-index: 1000; /* 确保在最上层 */
  background-color: #007157;
}
h1 {
  font-size: 66px;
}

p {
  margin-top: 60px;
  font-size: 18px;
}

</style>
