<template>
  <div id="topBar">
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <div class="left">
<!--            <button class="btn btn&#45;&#45;stripe">数字大屏</button>-->
            <button :class="(path === '/') ?'choosed' : 'btn btn--stripe'" @click="goto('/')">首页</button>
            <button :class="(path === '/knowledge') ?'choosed' : 'btn btn--stripe'" @click="goto('/knowledge')">科普站</button>
            <button :class="(path === '/predict') ?'choosed' : 'btn btn--stripe'" @click="goto('/predict')">智慧农业</button>
          </div>
        </div>
      </el-col>
      <el-col :span="8">

            <div class="login-header">
              <!--              <img class="logo mr10" src="../assets/star.svg" alt="" />-->
              <div class="login-title">全国农业大数据平台</div>
            </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <div class="right">
            <div class="place"  @click="goto('/login')">
            <div class="name">
              <div class="username">Yutian</div>
              <div class="role">个人用户</div>
            </div>
            <el-avatar class="avatar" :size="50" src="https://mypan.yutiantian.top/raw/health/11.jpg" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      path:"/"
    }
  },
  methods: {
    goto(p){
      this.$router.push({path: p})
      this.path = p
    }

  },
  created() {

  },
}
</script>

<style lang="scss">
#topBar {
  width: 100%;
  line-height: 50px;

  .login-header {
    display: flex;
    align-items: center;
    justify-content: center;
    //margin-bottom: 40px;
    height: 60px;
  }

  .logo {
    width: 35px;

  }

  .login-title {
    margin-left: 20rpx;
    font-size: 30px;
    color: #ffffff;
    font-weight: bold;
    line-height: 60px;
  }
  .el-row {
    //margin-bottom: 20px;
  }

  .el-row:last-child {
    margin-bottom: 0;
  }

  .el-col {
    //border-radius: 4px;
    height: 60px;
  }

  .grid-content {
    height: 60px;
  }
  .left{
    width: 100%;
    //background-color: #29bfff;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 20px;

  }
  .right{
    .place{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .avatar{
        margin-right: 10px;
      }
      .name{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        color: #fff;
        font-size: 14px;
        margin-right: 15px;
        line-height: 24px;
        //margin-right: 10px;
        .username{
          font-weight: bold;
          font-size: 22px;
        }
        .role{
          font-size: 14px;
          color: #bcbcbc;
        }
      }
    }
    width: 100%;
    //background-color: #29bfff;
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

  }
  .bg-purple {
    //background: #dbe2ef;
  }

  .bg-purple-light {
    background: #dbe2ef;
  }
}
.choosed{
  display: block;
  text-decoration: none;
  text-transform: uppercase;
  padding: 10px 30px 10px;
  background-color: #1fab89;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid #1fab89;
  margin-left: 10px;
  margin-right: 10px;
}

$color-gray: #1fab89;
$color-black: #000;
$stripe-height: 7px;
$btn-color: $color-gray;
$btn-background: #000000;
$btn-color-hover: #fff;
$btn-background-hover: $color-gray;
$border-color: $color-gray;
$border-color-hover: $color-black;

@mixin reset-button {
  overflow : visible;
  margin : 0;
  padding : 0;
  border : 0;
  background : transparent;
  font : inherit;
  line-height : normal;
  cursor : pointer;
  -moz-user-select : text;

  &::-moz-focus-inner {
    padding : 0;
    border : 0;
  }
}

@keyframes stripe-slide {
  0% { background-position: 0% 0; }
  100% { background-position: 100% 0; }
}

.btn {
  @include reset-button;
  display: block;
  text-decoration: none;
  text-transform: uppercase;
  padding: 8px 30px 12px;
  background-color: $btn-background;
  color: $btn-color;
  border: 2px solid $border-color;
  margin-left: 10px;
  margin-right: 10px;
  //border-radius: 0px;
  //margin-bottom: 5px;
  transition: all .5s ease;

  &--stripe {
    overflow: hidden;
    position: relative;

    &:after {
      content: '';
      display: block;
      height: $stripe-height;
      width: 100%;
      background-image: repeating-linear-gradient(
              45deg,
              $border-color,
              $border-color 1px,
              transparent 2px,
              transparent 5px
      );
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      border-top: 1px solid $border-color;
      position: absolute;
      left: 0;
      bottom: 0;
      background-size: $stripe-height $stripe-height;
    }

    &:hover {
      background-color: $btn-background-hover;
      color: $btn-color-hover;
      border-color: $border-color-hover;

      &:after {
        background-image: repeating-linear-gradient(
                45deg,
                $btn-color-hover,
                $btn-color-hover 1px,
                transparent 2px,
                transparent 5px
        );
        border-top: 1px solid $border-color-hover;
        animation: stripe-slide 12s infinite linear forwards;
      }
    }
  }

  &--large {
    width: 50%;
  }

  &--radius {
    border-radius: 36px;
  }
}
</style>