<template>
  <div class="search">
    <input class="input" placeholder="请输入个人证件号码" v-model="number"/>
    <div class="button" @click="submit">查询</div>

    <!--提交遮罩-->
    <van-overlay :show="loading">
      <van-loading type="spinner" color="#FFFFFF" />
    </van-overlay>
    <!--上报凭证图-->
    <van-overlay :show="showCert" @click="showCert=false">
      <img class="cert" ref="certImage"/>
    </van-overlay>
    <canvas ref="canvas" style="display: none;"></canvas>
    <img src="../assets/images/cert.png" ref="cert" style="display: none;"/>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      loading: false,
      // 生成图片凭证所需数据
      number: '',
      showCert: false,
      name: '',
      cardType: '',
      cardNum: '',
      time: null
    }
  },
  mounted () {
    // this.save()
  },
  methods: {
    // 查询函数
    submit () {
      this.loading = true
      this.$axios.get('/api/queryInfo', {
        params: {
          'certificateNumber': this.number
        }
      }).then(res => {
        if (/^0$/.test(res.code)) {
          this.name = res.data.perName
          this.cardType = res.data.certificateType
          this.cardNum = res.data.certificateNumber
          this.time = res.data.reportTime
          this.save()
        } else if (!/^-100$/.test(res.code)) {
          this.$toast('查询失败，请稍后再试')
        }
      }).catch(() => {}).finally(() => {
        this.loading = false
      })
    },
    // 生成凭证并下载
    save () {
      // 准备会话数据
      const name = this.name
      const cardType = this.cardType
      const cardNum = this.cardNum
      const time = this.time
      // 准备画布
      const canvas = this.$refs.canvas
      canvas.width = 650
      canvas.height = 974
      const ctx = canvas.getContext('2d')
      const image = this.$refs.cert
      const drawImage = () => {
        ctx.drawImage(image, 0, 0)
        ctx.save()
        ctx.fillStyle = '#FFF'
        ctx.strokeStyle = '#FFF'
        ctx.font = '40px serif'
        ctx.fillText('已完整提交疫时出站旅客信息', 70, 350)
        ctx.save()
        ctx.font = '34px serif'
        ctx.fillText('姓名:' + name, 70, 400)
        ctx.fillText('证件类型：' + cardType, 70, 450)
        ctx.fillText('证件号码：' + cardNum, 70, 500)
        ctx.fillText('提交时间：' + new Date(time).format('yyyy年MM月dd日 hh时mm分'), 70, 550)
        ctx.save()
        ctx.font = '28px serif'
        ctx.fillText('温馨提示：如果您此前没有保存过此凭证图，', 70, 640)
        ctx.fillText('请您请长按并保存或使用手机截屏保存！', 70, 670)
        ctx.save()
        let imgData = canvas.toDataURL('png')
        this.$refs.certImage.src = imgData
        this.showCert = true
      }
      if (image.complete) {
        drawImage()
      } else {
        image.onload = () => {
          drawImage()
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .search {
    height: 100%;
    background: url("../assets/images/bg.png");
    background-size: cover;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    flex-direction: column;
    .input {
      position: relative;
      display: block;
      width: 80%;
      .px2vw(line-height, 90);
      padding-left: 14px;
      padding-right: 14px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      margin-bottom: 40px;
      background: transparent;
      line-height: 12vw;
      border-bottom: 1px solid #15dfcd;
      color: white;
      &::placeholder {
        color: rgba(255, 255, 255, 8);
      }
    }
    .button {
      position: relative;
      display: block;
      width: 80%;
      .px2vw(line-height, 90);
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      padding-left: 14px;
      padding-right: 14px;
      box-sizing: border-box;
      background: #00beae;
      box-shadow: 1px 5px 15px 0 #2b91ad;
      border-radius: 4px;
      border: 1px solid #15dfcd;
      font-size: 17px;
      font-weight: 400;
      color: #fff;
      &:before {
        content: " ";
        width: 200%;
        height: 200%;
        position: absolute;
        top: 0;
        left: 0;
        border: 1px solid rgba(0,0,0,.2);
        -webkit-transform: scale(.5);
        transform: scale(.5);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        box-sizing: border-box;
        border-radius: 10px;
      }
    }

    .cert {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      background: url('../assets/images/cert.png');
      background-size: cover;
      .px2vw(width, 650);
      .px2vw(height, 974);
      color: #FFFFFF;
    }
  }
</style>
