<template>
  <div class="batch">
    <van-nav-bar title="楼栋信息批量采集设定" left-arrow @click-left="$router.go(-1)"/>
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
              <input :ref="'area' + index"/><van-icon name="clear" size="20" color="#ee0a24"/>
            </template>
          </van-field>
          <van-row>
            <van-col span="24" type="flex" align="center" @click="addArea"><van-icon name="add" size="24" color="#1989fa" /></van-col>
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
              <van-radio name="3">方位</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field readonly clickable name="picker" input-align="right" label="起始栋" placeholder="点击选择"
                   :value="startRidgepole" @click="ridgepoleStartPicker = true"/>
        <van-field readonly clickable name="picker" input-align="right" label="结束栋" placeholder="点击选择"
                   :value="endRidgepole" @click="ridgepoleEndPicker = true"/>
        <van-popup v-model="ridgepoleStartPicker" position="bottom">
          <van-picker show-toolbar :columns="ridgepolePickerData" @confirm="onStartConfirm" @cancel="ridgepoleStartPicker = false"/>
        </van-popup>
        <van-popup v-model="ridgepoleEndPicker" position="bottom">
          <van-picker show-toolbar :columns="ridgepolePickerData" @confirm="onEndConfirm" @cancel="ridgepoleEndPicker = false"/>
        </van-popup>
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
        <van-field readonly clickable name="picker" input-align="right" label="起始单元" placeholder="点击选择"
                   :value="startUnit" @click="unitStartPicker = true"/>
        <van-field readonly clickable name="picker" input-align="right" label="结束单元" placeholder="点击选择"
                   :value="endRidgepole" @click="unitEndPicker = true"/>
        <van-popup v-model="unitStartPicker" position="bottom">
          <van-picker show-toolbar :columns="unitPickerData" @confirm="onStartConfirm" @cancel="unitStartPicker = false"/>
        </van-popup>
        <van-popup v-model="unitEndPicker" position="bottom">
          <van-picker show-toolbar :columns="unitPickerData" @confirm="onEndConfirm" @cancel="unitEndPicker = false"/>
        </van-popup>
      </van-cell-group>

      <!--室-->
      <van-cell-group title="房室">
        <van-field name="switch" label="批量创建室" input-align="right"></van-field>
        <!--批量创建室-->
        <van-field v-model="startRoom" label="起始室" input-align="right" placeholder="请输入起始房屋"/>
        <van-field v-model="endRoom" label="结束室" input-align="right" placeholder="请输入结束房屋"/>
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
      ridgepoleType: '1',
      ridgepoleStartPicker: false,
      ridgepoleEndPicker: false,
      startRidgepole: '',
      endRidgepole: '',
      ridgepoleNumber: 0,
      // 单元数据
      unitType: '1',
      unitStartPicker: false,
      unitEndPicker: false,
      startUnit: '',
      endUnit: '',
      unitNumber: 0,
      // 房号数据
      startRoom: '',
      endRoom: '',
      roomNumber: 0
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
    onStartConfirm (value) {
      this.startRidgepole = value
      this.ridgepoleStartPicker = false
    },
    onEndConfirm (value) {
      this.endRidgepole = value
      this.ridgepoleEndPicker = false
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
