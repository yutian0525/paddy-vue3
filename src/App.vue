<template>
  <div id="app">
    <el-header>
      <topBar>
        <template v-slot:middle>
          <div></div>
        </template>
      </topBar>
    </el-header>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import TopBar from "./components/topBar/topBar.vue";

export default {
  name: 'App',
  components: {
    TopBar
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
body {
  background: #060612;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #BCBCBF;
}

/* 定义过渡效果的 CSS 样式 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
