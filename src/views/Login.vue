<template>
  <div class="login">
    <div class="logo">LOGO</div>
    <van-field class="username" v-model="username" input-align="left" clearable placeholder="请输入管理账号"/>
    <van-field class="password" v-model="password" input-align="left" clearable placeholder="请输入密码" type="password"/>
    <van-button class="submit" type="info" size="large" @click="onSubmit">登录</van-button>
    <base-loading :show="loading"></base-loading>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: 'admin',
      password: '123456',
      loading: false
    }
  },
  created () {
  },
  methods: {
    onSubmit () {
      // TODO
      this.loading = true
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      }).then(res => {
        this.$router.push({ name: 'Home' }).then()
      }).catch(() => {
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login {
    .logo {
      .px2vw(margin-top, 200);
      text-align: center;
    }
    .username, .password, .submit {
      .px2vw(width, 600);
      margin: auto;
      .px2vw(margin-bottom, 100);
    }
    .submit {
      display: block;
    }
  }
</style>
