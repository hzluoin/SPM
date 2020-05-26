<template>
  <div class="data-entry">
    <van-nav-bar title="楼栋信息采集" left-arrow @click-left="$router.go(-1)"/>
    <van-form @submit="onSubmit">
      <van-field readonly clickable name="picker" :value="community.communityName" label="小区名称" placeholder="点击选择小区" @click="showCommunityPicker = true" input-align="right"/>
      <van-popup v-model="showCommunityPicker" position="bottom">
        <van-picker show-toolbar :columns="communityList" value-key="communityName" @confirm="onCommunityConfirm" @cancel="showCommunityPicker = false"/>
      </van-popup>

      <!--<div v-if="community.isZone===1">-->
        <!--<van-cell-group title="区" v-for="(item, index) in community.zoneEntityList" :key="index">-->
        <!--</van-cell-group>-->
      <!--</div>-->

      <van-collapse v-model="activeCommunity">
        <van-collapse-item title="标题1" name="1">
          <van-field name="switch" label="批量创建楼栋" input-align="right">
            <template #input>
              <van-switch v-model="ridgepoleChecked" size="20" />
            </template>
          </van-field>
        </van-collapse-item>
        <van-collapse-item title="标题2" name="2">
          <van-field name="switch" label="批量创建楼栋" input-align="right">
            <template #input>
              <van-switch v-model="ridgepoleChecked" size="20" />
            </template>
          </van-field>
        </van-collapse-item>
        <van-collapse-item title="标题3" name="3" disabled>
          <van-field name="switch" label="批量创建楼栋" input-align="right">
            <template #input>
              <van-switch v-model="ridgepoleChecked" size="20" />
            </template>
          </van-field>
        </van-collapse-item>
      </van-collapse>

      <van-cell-group title="栋">
        <van-field name="switch" label="批量创建楼栋" input-align="right">
          <template #input>
            <van-switch v-model="ridgepoleChecked" size="20" />
          </template>
        </van-field>
        <!--非批量创建楼栋-->
        <van-field v-model="ridgepole" label="栋" input-align="right" placeholder="请输入楼栋号" v-show="!ridgepoleChecked"/>
        <!--批量创建楼栋-->
        <van-field name="ridgepoleType" label="编号类型" input-align="right" v-show="ridgepoleChecked">
          <template #input>
            <van-radio-group v-model="ridgepoleType" direction="horizontal">
              <van-radio name="1">大写</van-radio>
              <van-radio name="2">小写</van-radio>
              <van-radio name="3">方位</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field readonly clickable name="picker" input-align="right" label="起始栋" placeholder="点击选择"
                   :value="startRidgepole" @click="ridgepoleStartPicker = true" v-show="ridgepoleChecked"/>
        <van-field readonly clickable name="picker" input-align="right" label="结束栋" placeholder="点击选择"
                   :value="endRidgepole" @click="ridgepoleEndPicker = true" v-show="ridgepoleChecked"/>
        <van-popup v-model="ridgepoleStartPicker" position="bottom">
          <van-picker show-toolbar :columns="ridgepolePickerData" @confirm="onStartConfirm" @cancel="ridgepoleStartPicker = false"/>
        </van-popup>
        <van-popup v-model="ridgepoleEndPicker" position="bottom">
          <van-picker show-toolbar :columns="ridgepolePickerData" @confirm="onEndConfirm" @cancel="ridgepoleEndPicker = false"/>
        </van-popup>
      </van-cell-group>

      <!--单元-->
      <van-cell-group title="单元">
        <van-field name="switch" label="批量创建单元" input-align="right">
          <template #input>
            <van-switch v-model="unitChecked" size="20"/>
          </template>
        </van-field>
        <!--非批量创建单元-->
        <van-field v-model="unit" label="单元" input-align="right" placeholder="请输入单元号" v-show="!unitChecked"/>
        <!--批量创建单元-->
        <van-field name="ridgepoleType" label="编号类型" input-align="right" v-show="unitChecked">
          <template #input>
            <van-radio-group v-model="unitType" direction="horizontal">
              <van-radio name="1">大写</van-radio>
              <van-radio name="2">小写</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field readonly clickable name="picker" input-align="right" label="起始单元" placeholder="点击选择"
                   :value="startUnit" @click="unitStartPicker = true" v-show="unitChecked"/>
        <van-field readonly clickable name="picker" input-align="right" label="结束单元" placeholder="点击选择"
                   :value="endRidgepole" @click="unitEndPicker = true" v-show="unitChecked"/>
        <van-popup v-model="unitStartPicker" position="bottom">
          <van-picker show-toolbar :columns="unitPickerData" @confirm="onStartConfirm" @cancel="unitStartPicker = false"/>
        </van-popup>
        <van-popup v-model="unitEndPicker" position="bottom">
          <van-picker show-toolbar :columns="unitPickerData" @confirm="onEndConfirm" @cancel="unitEndPicker = false"/>
        </van-popup>
      </van-cell-group>

      <!--室-->
      <van-cell-group title="室">
        <van-field name="switch" label="批量创建室" input-align="right">
          <template #input>
            <van-switch v-model="roomChecked" size="20"/>
          </template>
        </van-field>
        <!--非批量创建室-->
        <van-field v-model="room" label="室" input-align="right" placeholder="请输入房屋" v-show="!roomChecked"/>
        <!--批量创建室-->
        <van-field v-model="startRoom" label="起始室" input-align="right" placeholder="请输入起始房屋" v-show="roomChecked"/>
        <van-field v-model="endRoom" label="结束室" input-align="right" placeholder="请输入结束房屋" v-show="roomChecked"/>
      </van-cell-group>

      <van-button type="info" size="large" block native-type="submit">创建</van-button>
    </van-form>
  </div>
</template>

<script>
import PickerData from '@data/PickerData'
export default {
  name: 'DataEntry',
  data () {
    return {
      loading: false,
      // 区域
      community: {},
      showCommunityPicker: false,
      activeCommunity: '1',
      // 楼栋数据
      ridgepoleChecked: false,
      ridgepoleType: '1',
      ridgepole: '',
      ridgepoleStartPicker: false,
      ridgepoleEndPicker: false,
      startRidgepole: '',
      endRidgepole: '',
      // 单元数据
      unitChecked: false,
      unitType: '1',
      unit: '',
      unitStartPicker: false,
      unitEndPicker: false,
      startUnit: '',
      endUnit: '',
      // 房号数据
      roomChecked: false,
      room: '',
      startRoom: '',
      endRoom: ''
    }
  },
  computed: {
    communityList () {
      return this.$store.getters.getCommunity
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
    this.$store.dispatch('qryAllCommunity').then()
  },
  methods: {
    onSubmit () {
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
  .data-entry {
    button {
      .px2vw(width, 700);
      .px2vw(margin-left, 25);
      .px2vw(margin-top, 50);
    }
  }
</style>
