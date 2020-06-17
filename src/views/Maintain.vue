<template>
  <div class="maintain">
    <van-nav-bar title="楼栋数据维护" left-arrow @click-left="back" @click-right="areaPicker=true">
      <template #right>
        <van-icon name="search" size="18"/>
      </template>
    </van-nav-bar>
    <van-cell :value="area" icon="location-o" title="地区"/>
    <!--社区列表-->
    <!--滑动过渡效果-->
    <transition :name="communityTran">
      <van-list v-model="communityLoading" :finished="communityFinished" finished-text="没有更多了" @load="onLoad" v-show="showCommunity">
        <van-cell v-for="item in communityData" :key="item.id" :title="item.communityName" @click="onConfirmCommunity(item)"/>
      </van-list>
    </transition>
    <!--区域列表-->
    <van-list v-model="zoneLoading" :finished="zoneFinished" finished-text="没有更多了" @load="onLoad" v-show="showZone">
      <van-cell v-for="item in communityData" :key="item.id" :title="item.communityName" />
    </van-list>
    <!--楼栋列表-->
    <transition :name="ridgepoleTran">
      <van-list v-model="ridgepoleLoading" :finished="ridgepoleFinished" finished-text="没有更多了" @load="onLoad" v-show="showRidgepole">
        <van-cell v-for="item in ridgepoleData" :key="item.id" :title="item.buildingCode"  @click="onConfirmCommunity(item)"/>
      </van-list>
    </transition>
    <!--房间列表-->
    <van-popup v-model="areaPicker" position="bottom">
      <van-area :area-list="areaList" @confirm="onConfirmArea" @cancel="areaPicker=false" value="430104"/>
    </van-popup>
  </div>
</template>

<script>
import area from '../assets/data/area'
export default {
  name: 'Maintain',
  data () {
    return {
      // 省市区
      area: '湖南省/娄底市/娄星区',
      areaPicker: false,
      areaList: area,
      areaCode: ['43', '13', '02'],
      // 社区
      communityTran: '',
      showCommunity: true,
      communitySourceData: {},
      community: {},
      communityLoading: false,
      communityFinished: false,
      // 区域
      showZone: false,
      zoneSourceData: {},
      zone: {},
      zoneLoading: false,
      zoneFinished: false,
      // 楼栋
      ridgepoleTran: '',
      showRidgepole: false,
      ridgepoleSourceData: {},
      ridgepole: {},
      ridgepoleLoading: false,
      ridgepoleFinished: false
    }
  },
  computed: {
    communityData () {
      return this.communitySourceData[this.areaCode.join('')]
    },
    zoneData () {
      return this.zoneSourceData[this.community.id]
    },
    ridgepoleData () {
      return this.ridgepoleSourceData[this.community.id]
    }
  },
  created () {
  },
  methods: {
    back () {
      if (this.showRidgepole) {
        this.showRidgepole = false
        this.showCommunity = true
        this.ridgepoleTran = 'right'
        this.communityTran = 'right'
      } else {
        this.$router.go(-1)
      }
    },
    onLoad () {
      this.qryCommunity(this.areaCode)
    },
    // 省市区选择
    onConfirmArea (area) {
      this.areaPicker = false
      const code = area[2]['code']
      this.areaCode = [code.slice(0, 2), code.slice(2, 4), code.slice(4, 6)]
      this.area = area.map(item => {
        return item.name
      }).join('/')
      this.qryCommunity(this.areaCode)
    },
    // 社区选择
    onConfirmCommunity (community) {
      if (community.isZone === 0) {
        // 不分区
        this.community = community
        this.communityTran = 'left'
        this.ridgepoleTran = 'left'
        this.showCommunity = false
        this.showRidgepole = true
        this.qryRidgepole(community.id)
      } else {
        // 分区
        this.ridgepoleTran = 'left'
        this.showCommunity = false
        this.showZone = true
        this.qryZone(community.id)
      }
    },
    // 楼栋选择
    onConfirmRidgepole (ridgepole) {
      // this.community = community
      // this.communityTran = 'left'
      // this.ridgepoleTran = 'left'
      // this.showCommunity = false
      // this.showRidgepole = true
      // this.qryRidgepole(community.id)
    },
    // 查询社区
    qryCommunity (areaCode) {
      if (!this.communityData) {
        this.communityLoading = true
        this.$axios.post('/api/communityInfo/infoQueryAll', {
          lProvinceCode: areaCode[0],
          lCityCode: areaCode[0] + areaCode[1],
          lDistrictCode: areaCode.join('')
        }).then(res => {
          this.$set(this.communitySourceData, areaCode.join(''), res.data.rows.map(item => {
            item['text'] = item['communityName']
            return item
          }))
        }).catch().finally(() => {
          this.communityLoading = false
          this.communityFinished = true
        })
      }
    },
    // 查询区域
    qryZone (id) {
      if (!this.zoneData) {
        this.zoneLoading = true
        this.$axios.post('/api/communityZone/queryAll', { communityId: id }).then(res => {
          this.$set(this.zoneSourceData, id, res.data.rows.map(item => {
            item.text = item['buildingCode']
            return item
          }))
        }).catch().finally(() => {
          this.zoneLoading = false
          this.zoneFinished = true
        })
      }
    },
    // 查询楼栋
    qryRidgepole (id) {
      if (!this.ridgepoleData) {
        this.ridgepoleLoading = true
        this.$axios.post('/api/communityInfo/buildingQueryAll', { communityId: id }).then(res => {
          this.$set(this.ridgepoleSourceData, id, res.data.rows.map(item => {
            item.text = item['buildingCode']
            return item
          }))
        }).catch().finally(() => {
          this.ridgepoleLoading = false
          this.ridgepoleFinished = true
        })
      }
    },
    // 查询房间
    qryRoom (id) {
    }
  }
}
</script>

<style lang="less" scoped>
  .batch {
    .area {
      input {
        text-align: right;
        margin-right: 10px;
      }
      .van-row {
        height: 44px;
        line-height: 44px;
      }
    }
    button {
      .px2vw(width, 700);
      .px2vw(margin-left, 25);
      .px2vw(margin-top, 50);
      .px2vw(margin-bottom, 25);
    }
  }
</style>
