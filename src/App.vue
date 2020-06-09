<template>
  <div id="app">
    <!--滑动过渡效果-->
    <transition :name="transition">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    // 根据新目标页面计算左滑和右滑规则
    transition () {
      if (this.to.meta.level > this.from.meta.level) {
        return 'left'
      } else {
        return 'right'
      }
    }
  },
  data () {
    return {
      // 定义新页面等级
      from: {
        name: '',
        meta: {
          level: 0
        }
      },
      to: {
        name: '',
        meta: {
          level: 0
        }
      }
    }
  },
  created () {
    // 全局守卫
    this.$router.beforeEach((to, from, next) => {
      this.from = from
      this.to = to
      next()
    })
  },
  mounted () {
    window.console.log('version:0.0.1')
  }
}
</script>
<style>
  .left-enter, .left-enter-active {
    transition: 400ms;
    position: absolute;
    left: 100%;
  }
  .left-enter-to, .left-leave, .left-leave-active {
    position: absolute;
    left: 0;
  }
  .left-leave-to {
    transition: 400ms;
    position: absolute;
    left: -100%;
  }

  .right-enter, .right-enter-active {
    transition: 400ms;
    position: absolute;
    right: 100%;
  }
  .right-enter-to, .right-leave, .right-leave-active {
    position: absolute;
    right: 0;
  }
  .right-leave-to {
    transition: 400ms;
    position: absolute;
    right: -100%;
  }
  .left-enter, .left-enter-active, .left-enter-to, .left-leave, .left-leave-active, .left-leave-to, .right-enter, .right-enter-active, .right-enter-to, .right-leave, .right-leave-active, .right-leave-to {
    position: absolute;
    width: 100vw;
    box-sizing: border-box;
  }
</style>
