<template>
  <div class="invite">
    <van-nav-bar title="门禁认证"/>
    <van-form @submit="onSubmit">
      <van-field
        v-model="inviteCode"
        name="inviteCode"
        label="邀请码"
        placeholder="请输入邀请码"
        :rules="[{ required: true, message: '请输入邀请码' }]"/>

      <van-field label="个人照片(最大2M)">
        <template #input>
          <van-uploader v-model="self" :after-read="getSelf" :max-count="1" :max-size="2 * 1024 * 1024" accept="image/jpeg"/>
        </template>
      </van-field>

      <van-field label="身份证正面照(最大2M)">
        <template #input>
          <van-uploader v-model="front" :after-read="ocr" :max-count="1" :max-size="2 * 1024 * 1024" accept="image/jpeg"/>
        </template>
      </van-field>

      <van-field label="身份证反面照(最大2M)">
        <template #input>
          <van-uploader v-model="back" :after-read="ocr" :max-count="1" :max-size="2 * 1024 * 1024" accept="image/jpeg"/>
        </template>
      </van-field>

      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'Invite',
  data () {
    return {
      loading: false,
      inviteCode: '',
      idCard: '',
      self: [], // 自拍照
      front: [], // 正面照
      back: [], // 反面照
      frontData: {
        'gender': '女',
        'name': '牛XX',
        'id_card_number': 'XXXXXX19841013XXXX',
        'birthday': '1984-10-13',
        'race': '汉',
        'address': '广东省深圳市XXXXXXXX',
        'legality': {
          'Edited': 0.001,
          'Photocopy': 0,
          'ID Photo': 0.502,
          'Screen': 0.496,
          'Temporary ID Photo': 0
        },
        'type': 1,
        'side': 'front'
      }, // 正面照数据
      backData: {
        'issued_by': '北京市公安局海淀分局',
        'side': 'back',
        'valid_date': '2010.11.13-2020.11.13'
      } // 正面照数据
    }
  },
  mounted () {
    document.title = '门禁邀请'
  },
  methods: {
    onSubmit () {
      this.$axios.post('/api/accessCtl/auth', {
        name: this.frontData['name'],
        sex: /男/.test(this.frontData['gender']) ? 1 : 2,
        cardType: 0,
        idCard: this.frontData['id_card_number'],
        inviteCode: '123456',
        fileList: this.self,
        attachExt: ''
      }).then(res => {
      }).catch().finally(() => {
        this.loading = false
      })
    },
    // 个人照
    getSelf (file) {

    },
    // 证件识别
    ocr (file) {
      file.status = 'uploading'
      file.message = '上传中...'
      const formData = new FormData()
      formData.append('api_key', 'beJJKb5wweqO1YGJ6GGojINItqPY5Q4i')
      formData.append('api_secret', 'XJTByZaTni891ztRBCC_qY_N-iRRyEa9')
      formData.append('image_base64', file.content)
      this.$axios.post('/api_face/cardpp/v1/ocridcard', formData).then(res => {
        res.cards.forEach(item => {
          if (item.side === 'front') {
            this.frontData = item
          } else {
            this.backData = item
          }
        })
      }).catch(() => {
        file.status = 'failed'
        file.message = '上传失败'
      }).finally(() => {
        this.loading = false
      })
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
