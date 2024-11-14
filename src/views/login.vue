<template>
  <div class="box">
    <div ref="vantaRef" style="width: 100%; height: 93vh"></div>

    <div class="banner">
      <div class="box">
        <h2>用户登录</h2>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import WAVES from "vanta/src/vanta.waves";

export default {
  data() {
    return {};
  },
  mounted() {
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
    .box{
      width: 400px;
      height: 500px;
      background-color: rgba(255, 255, 255, 0.25);
      border: #007157 solid 2px;
      //filter: blur(10px);
      box-shadow: 0px 0px 10px #007157;
      display: flex;
      justify-content: center;
    }
  }
}

h1 {
  font-size: 66px;
}

p {
  margin-top: 60px;
  font-size: 18px;
}
</style>
