<template>
  <div class="info">
    <p class="title">入湘人员</p>
    <img class="bg" src="../assets/images/info_bg.png">
    <van-cell-group title="入湘人员信息采集">
      <van-field v-model="name" label="姓名" input-align="right" placeholder="请输入如：张三"/>
      <van-cell title="户籍所在地" :value="census" is-link @click="showCensusArea=true"/>
      <van-field v-model="phone" label="手机号码" input-align="right" placeholder="请输入手机号码"/>
      <van-cell title="证件类型" :value="cardType" is-link @click="showCardType=true"/>
      <van-field v-model="cardNum" label="证件号码" input-align="right" placeholder="请输入证件号码"/>
      <van-field v-model="temperature" label="体温情况" input-align="right" placeholder="度"/>
    </van-cell-group>
    <van-cell-group title="出发来湘情况">
      <van-cell title="来湘日期" :value="intoDateText" is-link @click="showIntoDate=true"/>
      <van-cell title="出发地（省市区）" :value="start" is-link @click="showStartArea=true"/>
      <van-field v-model="startDetails" label="出发地(详细地址)" input-align="right" placeholder="请输入如:**街道**小区*栋"/>
      <van-cell title="目的地（省市区）" :value="arrive" is-link @click="showArriveArea=true"/>
      <van-field v-model="arriveDetails" label="目的地(详细地址)" input-align="right" placeholder="请输入如:**街道**小区*栋"/>
      <van-field v-model="arriveContacts" label="目的地联系人" input-align="right" placeholder="请输入联系人姓名"/>
      <van-field v-model="arriveContactsPhone" label="目的地联系人电话" input-align="right" placeholder="请输入联系人电话"/>
      <van-cell title="交通方式" :value="transportation" is-link @click="showTran=true"/>
      <van-cell title="目前健康状况" :value="health" is-link @click="showHealth=true"/>
      <van-cell title="近14日是否去过湖北、武汉">
        <template>
          <van-radio-group v-model="radio1" direction="horizontal">
            <van-radio name="2">否</van-radio>
            <van-radio name="1">是</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <van-cell title="近期是否与发热病人接触">
        <template>
          <van-radio-group v-model="radio2" direction="horizontal">
            <van-radio name="2">否</van-radio>
            <van-radio name="1">是</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <van-cell title="是否做过核酸检测">
        <template>
          <van-radio-group v-model="radio3" direction="horizontal">
            <van-radio name="2">否</van-radio>
            <van-radio name="1">是</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <van-cell title="核酸检测结果">
        <template>
          <van-radio-group v-model="radio4" direction="horizontal" :disabled="radio3==='2'">
            <van-radio name="2">阴</van-radio>
            <van-radio name="1">阳</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <van-cell title="是否计划核酸送检">
        <template>
          <van-radio-group v-model="radio5" direction="horizontal" :disabled="radio3==='2'">
            <van-radio name="2">否</van-radio>
            <van-radio name="1">是</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
    </van-cell-group>
    <div class="btn">
      <van-button type="info" size="large" @click="submit">上报</van-button>
    </div>

    <!--户口所在地-->
    <van-popup v-model="showCensusArea" position="bottom"><van-area :area-list="areaList" @confirm="chooseCensusArea" @cancel="showCensusArea=false" :columns-num="2"/></van-popup>
    <!--目的地-->
    <van-popup v-model="showArriveArea" position="bottom"><van-area :area-list="areaList" @confirm="chooseArriveArea" @cancel="showStartArea=false"/></van-popup>
    <!--证件类型-->
    <van-popup v-model="showCardType" position="bottom">
      <van-picker show-toolbar :columns="cardList" @cancel="showCardType=false" @confirm="chooseCardType"/>
    </van-popup>
    <!--日期-->
    <van-popup v-model="showIntoDate" position="bottom">
      <van-datetime-picker v-model="intoDate" type="date" :formatter="formatter" @cancel="showIntoDate=false" @confirm="chooseIntoDate"/>
    </van-popup>
    <!--出发地-->
    <van-popup v-model="showStartArea" position="bottom"><van-area :area-list="areaList" @confirm="chooseStartArea" @cancel="showStartArea=false"/></van-popup>
    <!--交通方式-->
    <van-popup v-model="showTran" position="bottom">
      <van-picker show-toolbar :columns="tranList" @cancel="showTran=false" @confirm="chooseTran"/>
    </van-popup>
    <!--健康状况-->
    <van-popup v-model="showHealth" position="bottom">
      <van-picker show-toolbar :columns="healthList" @cancel="showHealth=false" @confirm="chooseHealth"/>
    </van-popup>
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
import area from '../assets/data/area'
export default {
  name: 'Info',
  props: ['locationProvince', 'locationCity', 'locationDistrict', 'reportLocation', 'locationType'],
  data () {
    return {
      loading: false,
      showCert: false,
      areaList: area,
      cardList: ['居民身份证', '护照', '台湾居民来往内地通行证', '香港居民来往内地通行证', '澳门居民来往内地通行证'],
      tranList: ['高铁', '火车', '公共汽车', '飞机', '其他'],
      healthList: ['健康', '有发烧、咳嗽等症状', '其他'],
      showCensusArea: false,
      showArriveArea: false,
      showCardType: false,
      showIntoDate: false,
      showStartArea: false,
      showTran: false,
      showHealth: false,
      // 表单属性
      name: '',
      census: '请选择户口所在地',
      phone: '',
      cardType: '请选择证件类型',
      cardNum: '',
      temperature: '',
      intoDate: new Date(),
      intoDateText: '请选择来湘日期',
      start: '请选择出发地（省市区）',
      startDetails: '',
      arrive: '请选择目的地（省市区）',
      arriveDetails: '',
      arriveContacts: '',
      arriveContactsPhone: '',
      transportation: '请选择交通方式',
      health: '请选择目前健康状况',
      radio1: '2',
      radio2: '2',
      radio3: '2',
      radio4: '2',
      radio5: '2'
    }
  },
  watch: {
    // 监听核酸检测情况
    radio3 (val) {
      // 做过核酸检测的才需要选择结果
      if (val === '2') {
        this.radio4 = '2'
        this.radio5 = '2'
      }
    }
  },
  methods: {
    // 选择户口所在地区
    chooseCensusArea (area) {
      this.showCensusArea = false
      area.forEach((item, index) => {
        if (index > 0) {
          this.census += '/'
        } else {
          this.census = ''
        }
        this.census += item.name
      })
    },
    // 选择目的地
    chooseArriveArea (area) {
      this.showArriveArea = false
      area.forEach((item, index) => {
        if (index > 0) {
          this.arrive += '/'
        } else {
          this.arrive = ''
        }
        this.arrive += item.name
      })
    },
    // 选择证件类型
    chooseCardType (type) {
      this.showCardType = false
      this.cardType = type
    },
    // 选择进入日期
    chooseIntoDate (date) {
      this.showIntoDate = false
      this.intoDateText = date.format('yyyy年MM月dd日')
    },
    // 选择出发地
    chooseStartArea (area) {
      this.showStartArea = false
      area.forEach((item, index) => {
        if (index > 0) {
          this.start += '/'
        } else {
          this.start = ''
        }
        this.start += item.name
      })
    },
    // 选择交通方式
    chooseTran (val) {
      this.showTran = false
      this.transportation = val
    },
    // 选择健康状况
    chooseHealth (val) {
      this.showHealth = false
      this.health = val
    },
    // 日期格式化
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      } else if (type === 'day') {
        return `${val}日`
      }
      return val
    },
    // 提交上报
    submit () {
      // 过滤表单信息
      if (!this.name) {
        this.$toast('请输入姓名')
        return
      }
      if (this.census === '请选择户口所在地') {
        this.$toast('请选择户口所在地')
        return
      }
      if (!this.phone) {
        this.$toast('请输入电话号码')
        return
      }
      if (this.cardType === '请选择证件类型') {
        this.$toast('请选择证件类型')
        return
      }
      if (!this.cardNum) {
        this.$toast('请输入证件号码')
        return
      }
      if (!this.temperature) {
        this.$toast('请输入体温')
        return
      }
      if (this.intoDateText === '请选择来湘日期') {
        this.$toast('请选择来湘日期')
        return
      }
      if (this.start === '请选择出发地（省市区）') {
        this.$toast('请选择出发地')
        return
      }
      if (!this.startDetails) {
        this.$toast('请输入出发地(详细地址)')
        return
      }
      if (this.arrive === '请选择目的地（省市区）') {
        this.$toast('请选择目的地')
        return
      }
      if (!this.arriveDetails) {
        this.$toast('请输入目的地(详细地址)')
        return
      }
      if (!this.arriveContacts) {
        this.$toast('请输入目的地联系人')
        return
      }
      if (!this.arriveContactsPhone) {
        this.$toast('请输入目的地联系人电话')
        return
      }
      if (this.transportation === '请选择交通方式') {
        this.$toast('请选择交通方式')
        return
      }
      if (this.health === '请选择目前健康状况') {
        this.$toast('请选择目前健康状况')
        return
      }
      this.loading = true
      // 调用接口提交
      this.$axios.post('/api/reportInfo', {
        'perName': this.name,
        'residenceAddressProvince': this.census.split('/')[0],
        'residenceAddressCity': this.census.split('/')[1],
        'mobilePhoneNumber': this.phone,
        'certificateType': this.cardType,
        'certificateNumber': this.cardNum,
        'bodyTemperature': this.temperature,
        'enteringHunanDate': this.intoDate.format('yyyy-MM-dd hh:mm:ss'),
        'departureProvince': this.start.split('/')[0],
        'departureCity': this.start.split('/')[1],
        'departureDistrict': this.start.split('/')[2],
        'departureLocation': this.startDetails,
        'destinationProvince': this.arrive.split('/')[0],
        'destinationCity': this.arrive.split('/')[1],
        'destinationDistrict': this.arrive.split('/')[2],
        'destinationLocation': this.arriveDetails,
        'destinationContact': this.arriveContacts,
        'destinationPhoneNumber': this.arriveContactsPhone,
        'transportation': this.transportation,
        'healthStatus': this.health,
        'isToHubeiRecently': /^1$/.test(this.radio1) ? '是' : '否',
        'isDoNucleicAcidTestRecently': /^1$/.test(this.radio2) ? '是' : '否',
        'nucleicAcidTestResult': /^1$/.test(this.radio3) ? '是' : '否',
        'isContactFeverPatientRecently': /^1$/.test(this.radio4) ? '阳性' : '阴性',
        'isPlanDoNucleicAcidTest': /^1$/.test(this.radio5) ? '是' : '否',
        'locationProvince': this.locationProvince,
        'locationCity': this.locationCity,
        'locationDistrict': this.locationDistrict,
        'reportLocation': this.reportLocation,
        'locationType': this.locationType
      }).then(res => {
        if (/^0$/.test(res.code)) {
          // 上报成功后调用本地的图片凭证生成函数
          this.save()
        } else if (!/^-100$/.test(res.code)) {
          this.$toast('上报失败，请检查参数是否正确')
        }
      }).catch(() => {}).finally(() => {
        this.loading = false
      })
    },
    // 生成凭证并下载
    save () {
      // 准备凭证数据
      const name = this.name
      const cardType = this.cardType
      const cardNum = this.cardNum
      // 准备画布
      const canvas = this.$refs.canvas
      canvas.width = 650
      canvas.height = 974
      const ctx = canvas.getContext('2d')
      const image = this.$refs.cert
      // 定义绘画函数
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
        ctx.fillText('提交时间：' + new Date().format('yyyy年MM月dd日 hh时mm分'), 70, 550)
        ctx.save()
        ctx.font = '28px serif'
        ctx.fillText('温馨提示：如果浏览器没有自动下载此凭证', 70, 640)
        ctx.fillText('图，请用户请长按并保存或使用手机截屏保', 70, 670)
        ctx.fillText('存！', 70, 700)
        ctx.save()
        // 创建下载
        let imgData = canvas.toDataURL('png')
        imgData = imgData.replace(this._fixType('png'), 'image/octet-stream')
        // 判断浏览器
        let userAgent = navigator.userAgent
        let isOpera = userAgent.indexOf('Opera') > -1
        if (userAgent.indexOf('Trident') > -1 || userAgent.indexOf('Edge') > -1) {
          this.ieFun(canvas)
        } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
          this.ieFun(canvas)
        } else {
          this.otherFun(imgData)
        }

        this.$refs.certImage.src = imgData
        this.showCert = true
      }
      // 背景图过大，防止未加载完成的情况生成空白凭证图
      if (image.complete) {
        drawImage()
      } else {
        image.onload = () => {
          drawImage()
        }
      }
    },
    ieFun (myCanvas) {
      window.navigator.msSaveBlob(myCanvas.msToBlob(), '入湘人员信息采集凭证.png')
    },
    otherFun (imgData) {
      // 创建带有指定命名空间的元素节点
      let saveLink = document.createElement('a')
      saveLink.href = imgData
      saveLink.download = '入湘人员信息采集凭证.png'

      let event = document.createEvent('MouseEvents')
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      saveLink.dispatchEvent(event)
    },
    _fixType (type) {
      type = type.toLowerCase().replace(/jpg/i, 'jpeg')
      const r = type.match(/png|jpeg|bmp|gif/)[0]
      return 'image/' + r
    }
  },
  mounted () {
    // this.save()
  }
}
</script>

<style lang="less" scoped>
  .info {
    >.title {
      position: absolute;
      .px2vw(top, 80);
      .px2vw(left, 60);
      color: #fff;
      font-size: 18px;
    }
    .bg {
      width: 100%;
    }
    .van-cell-group__title {
      font-size: 16px;
      color: #2e3034;
    }
    .van-radio {
      float: right;
      .px2vw(margin-left, 50);
    }
    .btn {
      .px2vw(padding, 20);
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
      .title {
        text-align: center;
        .px2vw(margin-top, 360);
        font-size: 20px;
      }
      .name {
        .px2vw(margin-top, 60);
        .px2vw(padding-left, 120);
      }
      .t_card {
        .px2vw(padding-left, 120);
      }
      .card {
        .px2vw(padding-left, 120);
      }
      .time {
        .px2vw(padding-left, 120);
      }
    }
  }
</style>
