<template>
  <div class="room-status">
    <van-nav-bar title="防疫作战房态图" left-arrow @click-left="$router.go(-1)"/>
    <van-row>
      <van-col span="24" class="warning">注：您浏览的界面中设计居民隐私，我们将记录您的操作，并留下日志已备审计核查。系统在您将浏览的界面上已经打上了水印，请勿通过拍摄、录屏等方式泄漏信息。</van-col>
    </van-row>
    <van-form @submit="onSubmit"  class="data-entry">
      <van-field readonly clickable name="picker" input-align="right" label="社区" placeholder="点击选择"
                 :value="area" @click="qryArea(city)"/>
      <van-field readonly clickable name="picker" input-align="right" label="栋" placeholder="点击选择"
                 :value="ridgepole" @click="qryRidgepole(area)"/>
      <van-popup v-model="areaPicker" position="bottom">
        <van-picker show-toolbar :columns="areaData" @confirm="onAreaConfirm" @cancel="areaPicker = false"/>
      </van-popup>
      <van-popup v-model="ridgepolePicker" position="bottom">
        <van-picker show-toolbar :columns="cascadeRidgepoleList" @confirm="onRidgepoleConfirm" @cancel="ridgepolePicker = false"/>
      </van-popup>
    </van-form>

    <van-row class="header">
      <van-col span="6" class="first">室号</van-col>
      <van-col span="8">居住情况</van-col>
      <van-col span="10" class="last">防控状态</van-col>
    </van-row>
    <van-row class="item">
      <van-col span="6" class="first">101</van-col>
      <van-col span="8">租房(8)</van-col>
      <van-col span="10" class="last"><i></i>疑似病例</van-col>
    </van-row>
    <van-row class="item">
      <van-col span="6" class="first">101</van-col>
      <van-col span="8">租房(8)</van-col>
      <van-col span="10" class="last"><i></i>疑似病例</van-col>
    </van-row>
    <van-row class="item">
      <van-col span="6" class="first">101</van-col>
      <van-col span="8">租房(8)</van-col>
      <van-col span="10" class="last"><i></i>疑似病例</van-col>
    </van-row>

    <van-row class="legend title">
      <van-col span="24">图例</van-col>
    </van-row>
    <van-row class="legend">
      <van-col span="12"><i class="a"></i><span>未离湘外出或隔离解除户</span></van-col>
      <van-col span="12"><i class="b"></i><span>重点疫区返湘居家隔离户</span></van-col>
    </van-row>
    <van-row class="legend">
      <van-col span="12"><i class="c"></i><span>地区返湘落实居家健康管理户</span></van-col>
      <van-col span="12"><i class="d"></i><span>重点地区返湘落实健康户</span></van-col>
    </van-row>
    <van-row class="legend">
      <van-col span="12"><i class="e"></i><span>其他尚未返回或取得联系户</span></van-col>
      <van-col span="12"><i class="f"></i><span>空关户</span></van-col>
    </van-row>

    <base-loading :show="loading"></base-loading>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'RoomStatus',
  data () {
    return {
      loading: false,
      city: '',
      area: '',
      ridgepole: '',
      areaData: [],
      ridgepoleData: {},
      cityPicker: false,
      areaPicker: false,
      ridgepolePicker: false,
      roomStatusData: []
    }
  },
  computed: {
    cascadeAreaList () {
      return this.areaData[this.city]
    },
    cascadeRidgepoleList () {
      return this.ridgepoleData[this.area]
    }
  },
  watch: {
    ridgepole (val) {
      this.qryRoomStatus(val)
    }
  },
  created () {
    this.qryArea()
  },
  methods: {
    onSubmit () {
    },
    onAreaConfirm (value) {
      this.area = value.text
      this.areaPicker = false
      // 查询社区对应的楼栋信息
      if (this.ridgepoleData.hasOwnProperty(value.id)) {
        this.qryRidgepole(value.id)
      }
    },
    onRidgepoleConfirm (value) {
      this.ridgepole = value
      this.ridgepolePicker = false
    },
    qryArea () {
      this.loading = true
      this.$axios.post('/api/communityInfo/infoQueryAll', {}).then(res => {
        this.areaData = res.data.rows.map(item => {
          item['text'] = item['communityName']
          return item
        })
        this.areaPicker = true
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },
    qryRidgepole (area) {
      this.loading = true
      this.$axios.post('/api/communityInfo/buildingQueryAll', {
        id: area
      }).then(res => {
        Vue.set(this.ridgepoleData, area, res.data.map(item => {
          item.text = item['buildingCode']
          return item
        }))
        this.ridgepolePicker = true
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },
    qryRoomStatus (city, area, ridgepole) {
      this.loading = true
      this.$axios.post('/api/sys/selectBuildingszt', {
        areaname: city,
        communityname: area,
        buildings: ridgepole
      }).then(res => {
        Vue.set(this.roomStatusData, area, res.data.map(item => {
          return item.buildings
        }))
        this.ridgepolePicker = true
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .room-status {
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
  }
</style>
