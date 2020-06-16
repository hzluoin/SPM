<template>
  <van-form @submit="onSubmit">
    <van-field
      v-model="name"
      name="姓名"
      label="姓名"
      placeholder="请输入姓名"
      :rules="[{ required: true, message: '请输入姓名' }]"/>
    <van-field
      v-model="idCard"
      name="身份证"
      label="身份证"
      placeholder="请输入身份证"
      :rules="[{ required: true, message: '请输入身份证' }]"/>

    <van-field name="uploader" label="个人头像">
      <template #input>
        <van-uploader v-model="fileList" :after-read="afterRead"/>
      </template>
    </van-field>

    <van-field name="uploader" label="身份证正面照">
      <template #input>
        <van-uploader v-model="fileList" :after-read="afterRead"/>
      </template>
    </van-field>

    <van-field name="uploader" label="身份证反面照">
      <template #input>
        <van-uploader v-model="fileList" :after-read="afterRead"/>
      </template>
    </van-field>

    <div style="margin: 16px;">
      <van-button round block type="info" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script type="text/javascript" src="facepp_sdk/jquery.min.js"></script>
<script type="text/javascript" src="facepp_sdk/exif.js"></script>
<script type="text/javascript" src="facepp_sdk/facepp_sdk.js"></script>
<script>
export default {
  // 组件名称
  name: 'Invite',
  data () {
    return {
      name: '',
      idCard: '',
      fileList: [
        // {
        //   url: 'https://img.yzcdn.cn/vant/leaf.jpg',
        //   status: 'uploading',
        //   message: '上传中...'
        // }
      ]
    }
  },
  mounted () {
    document.title = '好友邀请'
  },
  methods: {
    onSubmit () {},
    afterRead (file) {
      file.status = 'uploading'
      file.message = '上传中...'

      setTimeout(() => {
        file.status = 'failed'
        file.message = '上传失败'
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
  /*样式定义*/
  .guide {
    min-height: 100%;
    background: url("../assets/images/guide-bg.png");
    background-size: cover;
    overflow: hidden;
    >div {
      .px2vw(width, 670);
      .px2vw(padding, 40);
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      background: #fff;
      .px2vw(border-radius, 16);
      position: relative;
      margin: auto;
      color: #73767a;
      font-size: 14px;
      line-height: 1.8;
    }
    .notice {
      .px2vw(margin-top, 220);
      img {
        .px2vw(width, 590);
        .px2vw(margin-bottom, 30);
      }
    }
    .notice2 {
      .title {
        font-size: 16px;
        font-weight: bold;
        color: black;
      }
      i {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #FFF;
        font-size: 14px;
        font-weight: bold;
        background: linear-gradient(180deg, #fccd7a, #fba654);
        border-radius: 100%;
      }
      .px2vw(margin-top, 40);
      .px2vw(margin-bottom, 80);
    }
  }
</style>
