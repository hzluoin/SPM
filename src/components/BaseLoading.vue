<template>
  <van-overlay :show="show" :z-index="99" class="base-loading">
    <van-loading class="container" color="#FFFFFF"/>
  </van-overlay>
</template>

<script>
export default {
  name: 'BaseLoading',
  props: {
    show: {
      Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
  .base-loading {
    .container {
      margin: auto;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      line-height: 100vh;
    }
  }
</style>
