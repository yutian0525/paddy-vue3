<template>
  <div id="app">
    <el-header>
      <topBar>
        <template v-slot:middle>
          <div></div>
        </template>
      </topBar>
    </el-header>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <router-view></router-view>
  </div>
</template>

<script>

import TopBar from "./components/topBar/topBar.vue";

export default {
  name: 'App',
  components: {
    TopBar
    // DataV
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
</style>
