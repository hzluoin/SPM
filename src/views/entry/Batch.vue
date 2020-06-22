<template>
  <div class="batch">
    <van-nav-bar title="楼栋信息批量采集" left-arrow @click-left="$router.go(-1)"/>
    <van-cell icon="location" title="地区" class="location" :value="area"  @click="areaPicker=true"/>
    <van-form @submit="onSubmit">
      <van-field readonly clickable name="picker" :value="community.communityName" label="小区名称" placeholder="点击选择小区" @click="showCommunityPicker = true" input-align="right"/>
      <!--区域-->
      <van-cell-group title="区域" class="area">
        <van-field name="switch" label="小区是否分区" input-align="right">
          <template #input>
            <van-switch v-model="hasArea" size="20" />
          </template>
        </van-field>
        <template v-if="hasArea">
          <van-field name="ridgepoleType" label="区域名称" input-align="right" v-for="(item, index) in zoneList" :key="index">
            <template #input>
              <input :ref="'area' + index" v-model="zoneList[index]" placeholder="请输入区域名称"/><van-icon name="clear" size="20" color="#ee0a24" @click="removeArea(index)" v-if="index!==0"/>
            </template>
          </van-field>
          <van-row>
            <van-col span="24" type="flex" align="center" @click="addArea"><van-icon name="add" size="24" color="#1989fa"/></van-col>
          </van-row>
        </template>
      </van-cell-group>

      <!--楼栋-->
      <van-cell-group title="楼栋">
        <van-field name="ridgepoleType" label="编号类型" input-align="right">
          <template #input>
            <van-radio-group v-model="ridgepoleType" direction="horizontal">
              <van-radio name="1">大写</van-radio>
              <van-radio name="2">小写</van-radio>
              <van-radio name="3">字母</van-radio>
              <van-radio name="4">方位</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field label="示例" input-align="right" :placeholder="ridgepolePickerData[0]" disabled/>
        <van-field v-model="ridgepoleNumber" label="栋数" input-align="right" placeholder="请输入楼栋数量" v-show="ridgepoleType!=='4'"/>
        <van-field v-model="ridgepoleNumber" label="栋数" input-align="right" v-show="ridgepoleType==='4'">
          <template #input>
            <van-checkbox-group v-model="ridgepoleList" direction="horizontal">
              <van-checkbox :name="item" v-for="(item, index) in ridgepolePickerData" :key="index">{{item}}</van-checkbox>
            </van-checkbox-group>
          </template>
        </van-field>
      </van-cell-group>

      <!--单元-->
      <van-cell-group title="单元">
        <van-field name="ridgepoleType" label="编号类型" input-align="right">
          <template #input>
            <van-radio-group v-model="unitType" direction="horizontal">
              <van-radio name="1">大写</van-radio>
              <van-radio name="2">小写</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field label="示例" input-align="right" :placeholder="unitPickerData[0]" disabled/>
        <van-field v-model="unitNumber" label="栋数" input-align="right" placeholder="请输入单元数量"/>
      </van-cell-group>

      <!--房间-->
      <van-cell-group title="房间">
        <van-field v-model="roomNumber" label="房间数/每层" input-align="right" placeholder="请输入每层房间数量"/>
        <van-field v-model="roomNumber" label="" input-align="right" placeholder="请输入每层房间数量"/>
      </van-cell-group>

      <van-button type="info" size="normal" block>创建</van-button>
      <!--<van-button type="info" size="normal" block native-type="submit" plain>跳过预览直接创建</van-button>-->
      <div></div>
    </van-form>
    <!--地区选择-->
    <van-popup v-model="areaPicker" position="bottom">
      <van-area :area-list="areaList" @confirm="onConfirmArea" @cancel="areaPicker=false" value="430104"/>
    </van-popup>
    <!--社区选择-->
    <van-popup v-model="showCommunityPicker" position="bottom">
      <van-picker show-toolbar :columns="communityData" value-key="communityName" @confirm="onCommunityConfirm" @cancel="showCommunityPicker = false"/>
    </van-popup>
  </div>
</template>

<script>
import PickerData from '@data/PickerData'
import area from '../../assets/data/area'
export default {
  name: 'Batch',
  data () {
    return {
      loading: false,
      // 省市区
      area: '湖南省/娄底市/娄星区',
      areaPicker: false,
      areaList: area,
      areaCode: ['43', '13', '02'],
      // 小区
      communitySourceData: {},
      community: {},
      showCommunityPicker: false,
      activeCommunity: ['1'],
      // 区域
      zoneList: [''],
      hasArea: false,
      // 楼栋数据
      ridgepoleType: '1', // 楼栋编号类型
      ridgepoleNumber: '', // 楼栋数量
      ridgepoleList: [],
      // 单元数据
      unitType: '1',
      unitNumber: '',
      // 房号数据
      roomNumber: ''
    }
  },
  computed: {
    communityData () {
      return this.communitySourceData[this.areaCode.join('')]
    },
    ridgepolePickerData () {
      switch (this.ridgepoleType) {
        case '1':
          return PickerData['ridgepole1']
        case '2':
          return PickerData['ridgepole2']
        case '3':
          return PickerData['ridgepole3']
        case '4':
          return PickerData['ridgepole4']
        default:
          return PickerData['ridgepole1']
      }
    },
    unitPickerData () {
      switch (this.unitType) {
        case '1':
          return PickerData['unit1']
        case '2':
          return PickerData['unit2']
        default:
          return PickerData['unit1']
      }
    }
  },
  created () {
    this.qryCommunity(this.areaCode)
  },
  methods: {
    onSubmit () {
      this.$store.dispatch('updateCommunity', this.settings()).then()
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
        }).catch().finally(() => {
          this.loading = false
        })
      }
    },
    // 生成设定
    settings () {
      // 房屋列表
      let houseEntityList = [{ 'floor': '一楼', 'houseCode': '101', 'houseStatus': '1' }]
      // 单元列表
      let buildingUnitEntityList = [{ 'unitCode': '一单元', houseEntityList }]
      // 楼栋列表
      const buildingEntityList = [{ 'buildingCode': '一栋', buildingUnitEntityList }]
      // 区域列表
      const zoneEntityList = this.zoneList.map((item, index) => {
        const zoneName = this.$refs['area' + index][0].value
        return {
          communityId: this.community.id,
          rdStatus: 0,
          buildingEntityList,
          zoneName
        }
      })
      return {
        id: this.community.id, // 主键
        communityName: this.community.communityName || '', // 社区名称
        recordName: this.community.recordName || '', // 社区备案名称
        lProvince: this.community.lProvince || '', // 所在省
        lProvinceCode: this.community.lProvinceCode || '', // 所在省编码
        lCity: this.community.lCity || '', // 所在市
        lCityCode: this.community.lCityCode || '', // 所在市编码
        lDistrict: this.community.lDistrict || '', // 所在区/县
        lDistrictCode: this.community.lDistrictCode || '', // 所在区/县编码
        lStreet: this.community.lStreet || '', // 所在街道
        lAddress: this.community.lAddress || '', // 详细地址
        longitude: this.community.longitude || '', // 经度
        latitude: this.community.latitude || '', // 纬度
        phaseTotal: this.community.phaseTotal || '', // 期数
        isZone: this.hasArea ? 1 : 0, // 是否分区（数据字典：0-否；1-是）
        zoneTotal: this.zoneList.length, // 区域总数
        buildingTotal: this.ridgepoleNumber, // 楼栋总数
        unitTotal: this.unitNumber, // 单元总数
        houseTotal: this.roomNumber, // 房屋总套数
        householdTotal: 0, // 总户数
        peopleTotal: 0, // 总人数
        registerHouseholdTotal: 0, // 已登记户数
        registerPeopleTotal: 0, // 已登记人数
        zoneEntityList
      }
    },
    // 增加区域
    addArea () {
      this.zoneList.push('')
    },
    // 删除区域
    removeArea (index) {
      this.zoneList.splice(index, 1)
    },
    onCommunityConfirm (val) {
      this.showCommunityPicker = false
      this.community = val
    }
  }
}
</script>

<style lang="less" scoped>
  .batch {
    .location {
      color: #07c160;
    }
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
