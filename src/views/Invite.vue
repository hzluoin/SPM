<template>
  <div class="invite">
    <van-nav-bar title="门禁认证"/>
    <van-form @submit="onSubmit" v-show="!result">
      <van-field
        v-model="inviteCode"
        name="inviteCode"
        label="邀请码"
        placeholder="请输入邀请码"
        :rules="[{ required: true, message: '请输入邀请码' }]"/>

      <van-field label="个人照片(最大2M)" :rules="[{ required: true, message: '请上传个人照' }]">
        <template #input>
          <van-uploader v-model="self" :after-read="handleSelf" :max-count="1" :max-size="2 * 1024 * 1024" accept="image/jpeg"/>
        </template>
      </van-field>

      <van-field label="身份证正面照(最大2M)" :rules="[{ required: true, message: '请上传身份证正面照' }]">
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
    <div v-show="result" class="result">
      <van-icon name="smile-comment" :class="{success: resultType, error: !resultType}"/>
      <p>{{resultMsg}}</p>
    </div>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'Invite',
  data () {
    return {
      result: false, // 结果模块
      resultType: true, // 结果类型：成功、失败
      resultMsg: '', // 结果提示
      inviteCode: '', // 邀请码
      idCard: '', // 身份证号码
      extension: '', // 照片文件扩展名
      self: [], // 自拍照
      selfUrl: '', // 自拍照上传url
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
    // 判断时间是否有效
    // 判断是否有邀请码
    const start = +new Date(this.$route.query.startTime)
    const end = +new Date(this.$route.query.endTime)
    const now = +new Date()
    if (start > now || end < now) {
      this.result = true
      this.resultType = false
      this.resultMsg = '链接不在有效时间内'
      return
    }
    this.inviteCode = this.$route.query.s || ''
    if (!this.inviteCode) {
      this.result = true
      this.resultType = false
      this.resultMsg = '该链接缺失邀请码'
    }
  },
  methods: {
    onSubmit () {
      this.$axios.post('/api_not_login/accessCtl/auth', {
        name: this.frontData['name'],
        sex: /男/.test(this.frontData['gender']) ? 1 : 2,
        cardType: 0,
        idCard: this.frontData['id_card_number'],
        inviteCode: this.inviteCode,
        fileList: [{
          attachExt: this.extension,
          attachPath: this.selfUrl,
          attachType: 3
        }]
      }).then(res => {
        this.result = true
        this.resultType = true
        this.resultMsg = '认证成功！'
      }).catch(res => {
        this.$toast(res)
      })
    },
    // 获取自拍照的文件后缀
    handleSelf (file) {
      const matcher = /\..*$/.exec(file.file.name)
      if (matcher.length > 0) {
        this.extension = matcher[0].replace('.', '')
      }
      this.upload(file).then(res => {
        this.selfUrl = res
      })
    },
    // 文件上传
    upload (file) {
      return new Promise((resolve, reject) => {
        file.status = 'uploading'
        file.message = '上传中...'
        const formData = new FormData()
        formData.append('file', file.file)
        this.$axios.post('/api_upload/attach/uploadImage', formData).then(res => {
          file.status = 'success'
          resolve(res.data)
        }).catch(res => {
          file.status = 'failed'
          file.message = '上传失败'
          reject(res)
        })
      })
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
        file.status = 'success'
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
        this.$toast('证件识别失败!')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .invite {
    .result {
      text-align: center;
      i {
        font-size: 108px;
        margin-top: 200px;
        margin-bottom: 20px;
        &.success {
          color: #67C23A;
        }
        &.error {
          color: #E6A23C;
        }
      }
      p {
        font-size: 18px;
        color: #909399;
      }
    }
  }
</style>
