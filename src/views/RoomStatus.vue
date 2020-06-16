<template>
  <div class="room-status">
    <van-nav-bar title="防疫作战房态图" left-arrow @click-left="$router.go(-1)"/>
    <van-row>
      <van-col span="24" class="warning">注：您浏览的界面中设计居民隐私，我们将记录您的操作，并留下日志已备审计核查。系统在您将浏览的界面上已经打上了水印，请勿通过拍摄、录屏等方式泄漏信息。</van-col>
    </van-row>
    <van-collapse v-model="activeNames">
      <van-collapse-item title="筛选设置" name="form">
        <van-form @submit="onSubmit"  class="data-entry">
          <van-cell title="省市区" :value="area" is-link @click="areaPicker=true"/>
          <van-field readonly clickable name="picker" input-align="right" label="社区" placeholder="点击选择" v-model="community.text" @click="qryCommunity(areaCode)"/>
          <van-field readonly clickable name="picker" input-align="right" label="栋" placeholder="点击选择" v-model="ridgepole.text" @click="qryRidgepole(community.id)"/>
          <van-button block type="info" native-type="submit">查询</van-button>
        </van-form>
      </van-collapse-item>
    </van-collapse>
    <van-popup v-model="areaPicker" position="bottom">
      <van-area :area-list="areaList" @confirm="onConfirmArea" @cancel="areaPicker=false" value="431302"/>
    </van-popup>
    <van-popup v-model="communityPicker" position="bottom">
      <van-picker show-toolbar :columns="communityData" @confirm="onCommunityConfirm" @cancel="communityPicker = false"/>
    </van-popup>
    <van-popup v-model="ridgepolePicker" position="bottom">
      <van-picker show-toolbar :columns="ridgepoleData" @confirm="onRidgepoleConfirm" @cancel="ridgepolePicker = false"/>
    </van-popup>

    <van-row class="header">
      <van-col span="6" class="first">室号</van-col>
      <van-col span="8">居住情况</van-col>
      <van-col span="10" class="last">防控状态</van-col>
    </van-row>
    <van-row class="item" v-for="(item, index) in roomStatusList" :key="index">
      <van-col span="6" class="first">{{item.houseCode}}</van-col>
      <van-col span="8">{{item.houseStatus | status}}({{item.residentCount}})</van-col>
      <van-col span="10" class="last"><i :style="{background: item.useColor}"></i>{{item.markName}}</van-col>
    </van-row>

    <van-row class="legend title">
      <van-col span="24">图例</van-col>
    </van-row>
    <van-row class="legend">
      <van-col span="12"><i class="a"></i><span>未离湘外出户以及解除预警户({{roomStatusTotal['未离湘外出户以及解除预警户']}})</span></van-col>
      <van-col span="12"><i class="b"></i><span>重点疫区返湘居家隔离户({{roomStatusTotal['重点疫区返湘居家隔离户']}})</span></van-col>
    </van-row>
    <van-row class="legend">
      <van-col span="12"><i class="c"></i><span>非重点地区返湘落实健康登记户({{roomStatusTotal['非重点地区返湘落实健康登记户']}})</span></van-col>
      <van-col span="12"><i class="d"></i><span>重点关注地区返湘落实居家健康管理户({{roomStatusTotal['重点关注地区返湘落实居家健康管理户']}})</span></van-col>
    </van-row>
    <van-row class="legend">
      <van-col span="12"><i class="e"></i><span>其他尚未返回或未取得联系户({{roomStatusTotal['其他尚未返回或未取得联系户']}})</span></van-col>
      <van-col span="12"><i class="f"></i><span>空关户({{roomStatusTotal['空关户']}})</span></van-col>
    </van-row>

    <base-loading :show="loading"></base-loading>
    <div class="watermark" :style="{background: watermarkImg}"></div>
  </div>
</template>

<script>
import area from '../assets/data/area'
export default {
  name: 'RoomStatus',
  data () {
    return {
      // 水印图
      watermarkImg: '',
      activeNames: ['form'],
      loading: false,
      // 省市区
      area: '',
      areaPicker: false,
      areaList: area,
      areaCode: ['43', '13', '02'],
      // 社区
      communitySourceData: {},
      community: {},
      communityPicker: false,
      // 楼栋
      ridgepoleSourceData: {},
      ridgepole: {},
      ridgepolePicker: false,
      // 房态异常数据
      roomStatusList: [],
      // 房态异常数据汇总
      roomStatusTotal: {}
    }
  },
  computed: {
    username () {
      return this.$store.getters.getUsername
    },
    communityData () {
      return this.communitySourceData[this.areaCode.join('')]
    },
    ridgepoleData () {
      return this.ridgepoleSourceData[this.community.id]
    }
  },
  created () {
    this.qryNumber()
  },
  mounted () {
    this.watermarkImg = `url("${this.watermark(this.username, {
      width: 2000,
      height: 2000,
      interval: 50,
      color: 'red',
      font: '16px Arial'
    })}")`
  },
  filters: {
    status (value) {
      switch (value) {
        case '1':
          return '自住'
        case '2':
          return '出租'
        case '3':
          return '空置'
        default:
          return ''
      }
    }
  },
  methods: {
    onSubmit () {
      if (!this.ridgepole.id) {
        this.$toast('请选择楼栋')
        return
      }
      this.qryException(this.ridgepole.id)
    },
    // 省市区选择
    onConfirmArea (area) {
      this.areaPicker = false
      const code = area[2]['code']
      this.areaCode = [code.slice(0, 2), code.slice(2, 4), code.slice(4, 6)]
      this.area = area.map(item => {
        return item.name
      }).join('/')
    },
    // 社区选择
    onCommunityConfirm (value) {
      this.community = value
      this.communityPicker = false
    },
    // 楼栋选择
    onRidgepoleConfirm (value) {
      this.ridgepole = value
      this.ridgepolePicker = false
    },
    // 查询社区
    qryCommunity (areaCode) {
      if (!this.communityData) {
        this.loading = true
        this.$axios.post('/api/communityInfo/infoQueryAll', {
          lProvinceCode: areaCode[0],
          lCityCode: areaCode[0] + areaCode[1],
          lDistrictCode: areaCode.join('')
        }).then(res => {
          this.$set(this.communitySourceData, areaCode.join(''), res.data.rows.map(item => {
            item['text'] = item['communityName']
            return item
          }))
          this.communityPicker = true
        }).catch().finally(() => {
          this.loading = false
        })
      } else {
        this.communityPicker = true
      }
    },
    // 查询楼栋
    qryRidgepole (id) {
      if (!this.ridgepoleData) {
        this.loading = true
        this.$axios.post('/api/communityInfo/buildingQueryAll', { communityId: id }).then(res => {
          this.$set(this.ridgepoleSourceData, id, res.data.rows.map(item => {
            item.text = item['buildingCode']
            return item
          }))
          this.ridgepolePicker = true
        }).catch().finally(() => {
          this.loading = false
        })
      } else {
        this.ridgepolePicker = true
      }
    },
    // 查询异常记录
    qryException (buildingId) {
      this.loading = true
      this.$axios.post('/api/hEpidemicMark/queryAll', {
        buildingId: buildingId
      }).then(res => {
        this.roomStatusList = res.data.rows
      }).catch().finally(() => {
        this.loading = false
        this.activeNames = []
      })
    },
    // 查询异常统计数据
    qryNumber () {
      this.loading = true
      this.$axios.post('/api/rommSomEqidemics/queryRomSom', {}).then(res => {
        this.roomStatusTotal = {}
        res.data.forEach(item => {
          this.roomStatusTotal[item.markName] = item.count || 0
        })
      }).catch().finally(() => {
        this.loading = false
      })
    },
    watermark (text, option) {
      const canvas = document.createElement('canvas')
      canvas.width = option.width
      canvas.height = option.height
      const ctx = canvas.getContext('2d')
      // 设置水印样式
      // ctx.translate(option.width / 2, option.height / 2)
      ctx.rotate(45 * Math.PI / 180)
      ctx.translate(0, -(option.height / 2))
      ctx.font = option.font
      ctx.fillStyle = 'red'
      // 计算水印文字宽度
      const textWidth = ctx.measureText(text).width
      const width = textWidth + option.interval
      const height = option.interval
      const xTimes = option.width / width
      const yTimes = option.height / height
      for (let x = 0; x < xTimes; x++) {
        for (let y = 0; y < yTimes; y++) {
          ctx.fillText(text, x * width, y * height)
          ctx.save()
        }
      }
      return canvas.toDataURL('png')
    }
  }
}
</script>

<style lang="less" scoped>
  .room-status {
    position: relative;
    height: 100%;
    .warning {
      font-size: 12px;
      color: rgb(252, 44, 55);
      .px2vw(padding, 32);
    }
    .header {
      .px2vw(height, 64);
      .px2vw(line-height, 64);
      background: #5375FF;
      color: white;
      font-size: 12px;
      .first {
        .px2vw(padding-left, 32);
      }
      .last {
        .px2vw(padding-right, 32);
      }
    }
    .item {
      .px2vw(height, 64);
      .px2vw(line-height, 64);
      font-size: 12px;
      .first {
        .px2vw(padding-left, 32);
      }
      .last {
        .px2vw(padding-right, 32);
        i {
          float: left;
          vertical-align: top;
          .px2vw(margin-top, 16);
          .px2vw(margin-right, 16);
          display: inline-block;
          .px2vw(width, 32);
          .px2vw(height, 32);
          border-radius: 100%;
          background: #5375FF;
        }
      }
    }

    .legend {
      .px2vw(height, 100);
      .px2vw(padding-left, 32);
      .px2vw(padding-right, 32);
      .px2vw(margin-top, 32);
      &.title {
        .px2vw(line-height, 100);
      }
      >div {
        position: relative;
        .px2vw(height, 56);
        .px2vw(line-height, 56);
      }
      i {
        vertical-align: top;
        display: inline-block;
        .px2vw(width, 56);
        .px2vw(height, 56);
        border-radius: 100%;
        background: #5375FF;
        position: absolute;
      }
      span {
        font-size: 12px;
        display: inline-block;
        .px2vw(padding-left, 60);
      }
      .a {
        background: rgb(69, 176, 44);
      }
      .b {
        background: rgb(222, 42, 32);
      }
      .c {
        background: rgb(253, 140, 38);
      }
      .d {
        background: rgb(255, 234, 27);
      }
      .e {
        background: rgb(40, 127, 255);
      }
      .f {
        background: rgb(138, 136, 138);
      }
    }
    .watermark {
      pointer-events: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      opacity: 0.1;
    }
  }
</style>
