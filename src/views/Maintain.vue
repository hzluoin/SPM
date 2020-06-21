<template>
  <div class="maintain">
    <van-nav-bar title="楼栋数据维护" left-arrow @click-left="back"/>
    <van-cell icon="location" title="地区" class="location" :value="area"  @click="areaPicker=true"/>
    <van-cell icon="wap-home" title="社区" class="location" :value="address"/>
    <!--社区列表-->
    <!--滑动过渡效果-->
    <transition :name="communityTran">
      <van-list v-model="communityLoading" :finished="communityFinished" finished-text="没有更多了" @load="onLoad" v-show="showCommunity">
        <van-cell v-for="item in communityData" :key="item.id" :title="item.communityName" @click="onConfirmCommunity(item)" center/>
      </van-list>
    </transition>
    <!--区域列表-->
    <transition :name="zoneTran">
      <van-list v-model="zoneLoading" :finished="zoneFinished" finished-text="没有更多了" @load="onLoad" v-show="showZone">
        <van-swipe-cell v-for="(item, index) in zoneData" :key="index" center>
          <van-cell :key="item.id" :title="item.zoneName" @click="onConfirmZone(item)"/>
          <template #right>
            <van-button square type="danger" text="删除" @click="del(community.id, 'zone', item.zoneName, item.id)"/>
            <van-button square type="primary" text="编辑" @click="showEditDialog('zone', item.zoneName, item.id)"/>
          </template>
        </van-swipe-cell>
      </van-list>
    </transition>
    <!--楼栋列表-->
    <transition :name="ridgepoleTran">
      <van-list v-model="ridgepoleLoading" :finished="ridgepoleFinished" finished-text="没有更多了" @load="onLoad" v-show="showRidgepole">
        <van-swipe-cell v-for="(item, index) in ridgepoleData" :key="index" center>
          <van-cell :key="item.id" :title="item.buildingCode" @click="onConfirmRidgepole(item)"/>
          <template #right>
            <van-button square type="danger" text="删除" @click="del(community.id, 'ridgepole', item.buildingCode, item.id)"/>
            <van-button square type="primary" text="编辑" @click="showEditDialog('ridgepole', item.buildingCode, item.id)"/>
          </template>
        </van-swipe-cell>
      </van-list>
    </transition>
    <!--单元列表-->
    <transition :name="unitTran">
      <van-list v-model="unitLoading" :finished="unitFinished" finished-text="没有更多了" @load="onLoad" v-show="showUnit">
        <van-swipe-cell v-for="(item, index) in unitData" :key="index" center>
          <van-cell :key="item.id" :title="item.unitCode" @click="onConfirmUnit(item)"/>
          <template #right>
            <van-button square type="danger" text="删除" @click="del(community.id, 'unit', item.unitCode, item.id)"/>
            <van-button square type="primary" text="编辑" @click="showEditDialog('unit', item.unitCode, item.id)"/>
          </template>
        </van-swipe-cell>
      </van-list>
    </transition>
    <!--房间列表-->
    <transition :name="roomTran">
      <van-list v-model="roomLoading" :finished="roomFinished" finished-text="没有更多了" @load="onLoad" v-show="showRoom">
        <van-swipe-cell v-for="(item, index) in roomData" :key="index" center>
          <van-cell :key="item.id" :title="item.houseCode"/>
          <template #right>
            <van-button square type="danger" text="删除" @click="del(community.id, 'room', item.houseCode, item.id)"/>
            <van-button square type="primary" text="编辑" @click="showEditDialog('room', item.houseCode, item.id)"/>
          </template>
        </van-swipe-cell>
      </van-list>
    </transition>
    <!--地区选择-->
    <van-popup v-model="areaPicker" position="bottom">
      <van-area :area-list="areaList" @confirm="onConfirmArea" @cancel="areaPicker=false" value="430104"/>
    </van-popup>
    <van-dialog v-model="editDialog" :title="editDialogTitle" show-cancel-button @confirm="edit(community.id, editDialogType, editDialogText, editDialogId)">
      <van-field v-model="editDialogText"/>
    </van-dialog>
    <base-loading :show="loading"></base-loading>
  </div>
</template>

<script>
import area from '../assets/data/area'
export default {
  name: 'Maintain',
  data () {
    return {
      loading: false,
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
      zoneTran: '',
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
      ridgepoleFinished: false,
      // 单元
      unitTran: '',
      showUnit: false,
      unitSourceData: {},
      unit: {},
      unitLoading: false,
      unitFinished: false,
      // 房间
      roomTran: '',
      showRoom: false,
      roomSourceData: {},
      room: {},
      roomLoading: false,
      roomFinished: false,
      // 编辑标题
      editDialog: false,
      editDialogType: '',
      editDialogTitle: '',
      editDialogText: '',
      editDialogId: ''
    }
  },
  computed: {
    address () {
      const list = []
      if (this.community.communityName) {
        list.push(this.community.communityName)
      }
      if (this.zone.zoneName) {
        list.push(this.zone.zoneName)
      }
      if (this.ridgepole.buildingCode) {
        list.push(this.ridgepole.buildingCode)
      }
      if (this.unit.unitCode) {
        list.push(this.unit.unitCode)
      }
      if (this.room.roomCode) {
        list.push(this.room.roomCode)
      }
      return list.join('/')
    },
    communityData () {
      return this.communitySourceData[this.areaCode.join('')]
    },
    zoneData () {
      return this.zoneSourceData
    },
    unitData () {
      return this.unitSourceData
    },
    ridgepoleData () {
      if (JSON.stringify(this.zone) === '{}') {
        return this.ridgepoleSourceData[this.community.id]
      } else {
        return this.ridgepoleSourceData[this.zone.id]
      }
    },
    roomData () {
      return this.roomSourceData[this.unit.id]
    }
  },
  methods: {
    back () {
      if (this.showZone) {
        // 社区 => 区域
        this.community = {}
        this.showZone = false
        this.showCommunity = true
        this.zoneTran = 'right'
        this.communityTran = 'right'
      } else if (this.showRidgepole) {
        if (JSON.stringify(this.zone) !== '{}') {
          // 区域 => 楼栋
          this.zone = {}
          this.showRidgepole = false
          this.showZone = true
          this.ridgepoleTran = 'right'
          this.zoneTran = 'right'
        } else {
          // 社区 => 楼栋
          this.community = {}
          this.showRidgepole = false
          this.showCommunity = true
          this.ridgepoleTran = 'right'
          this.communityTran = 'right'
        }
      } else if (this.showUnit) {
        // 楼栋 => 单元
        this.ridgepole = {}
        this.showUnit = false
        this.showRidgepole = true
        this.unitTran = 'right'
        this.ridgepoleTran = 'right'
      } else if (this.showRoom) {
        // 单元 => 房间
        this.room = {}
        this.showRoom = false
        this.showUnit = true
        this.roomTran = 'right'
        this.unitTran = 'right'
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
        this.qryRidgepole(community.id, 'community')
      } else {
        // 分区
        this.community = community
        this.communityTran = 'left'
        this.zoneTran = 'left'
        this.showCommunity = false
        this.showZone = true
        this.zoneSourceData = community.zoneEntityList
      }
    },
    // 区域选择
    onConfirmZone (zone) {
      this.zone = zone
      this.zoneTran = 'left'
      this.ridgepoleTran = 'left'
      this.showZone = false
      this.showRidgepole = true
      this.qryRidgepole(zone.id)
    },
    // 楼栋选择
    onConfirmRidgepole (ridgepole) {
      this.ridgepole = ridgepole
      this.ridgepoleTran = 'left'
      this.unitTran = 'left'
      this.showRidgepole = false
      this.showUnit = true
      this.unitSourceData = ridgepole.buildingUnitEntityList
    },
    // 单元选择
    onConfirmUnit (unit) {
      this.unit = unit
      this.unitTran = 'left'
      this.roomTran = 'left'
      this.showUnit = false
      this.showRoom = true
      this.qryRoom(unit.id)
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
    // 查询楼栋
    qryRidgepole (id, parentType) {
      if (!this.ridgepoleData) {
        const data = {}
        if (parentType === 'community') {
          data['communityId'] = id
        } else {
          data['communityZoneId'] = id
        }
        this.ridgepoleLoading = true
        this.$axios.post('/api/communityInfo/buildingQueryAll', data).then(res => {
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
      this.roomLoading = true
      this.$axios.post('/api/communityUnitHouse/queryAll', { unitId: id }).then(res => {
        this.$set(this.roomSourceData, id, res.data.rows.map(item => {
          item.text = item['buildingCode']
          return item
        }))
      }).catch().finally(() => {
        this.roomLoading = false
        this.roomFinished = true
      })
    },
    // 编辑区域、楼栋、单元、房间名称
    showEditDialog (type, title, id) {
      switch (type) {
        case 'zone':
          this.editDialogTitle = '编辑区域'
          break
        case 'ridgepole':
          this.editDialogTitle = '编辑楼栋'
          break
        case 'unit':
          this.editDialogTitle = '编辑单元'
          break
        case 'room':
          this.editDialogTitle = '编辑房间'
          break
      }
      this.editDialog = true
      this.editDialogText = title
      this.editDialogType = type
      this.editDialogId = id
    },
    // 查询社区详情
    qryCommunityDetail (id) {
      return this.$axios.post('/api/communityInfo/details', {
        id: id
      })
    },
    edit (communityId, type, val, id) {
      this.loading = true
      this.qryCommunityDetail(communityId).then(res => {
        const community = res.data
        switch (type) {
          case 'zone':
            const zone = community.zoneEntityList.filter(item => {
              return item.id === id
            })
            if (zone.length !== 1) {
              this.$toast('数据异常，修改失败!')
              this.loading = false
              return
            }
            zone[0].zoneName = val
            break
          case 'ridgepole':
            const ridgepole = community.buildingEntityList.filter(item => {
              return item.id === id
            })
            if (ridgepole.length !== 1) {
              this.$toast('数据异常，修改失败!')
              this.loading = false
              return
            }
            ridgepole[0].buildingCode = val
            break
          case 'unit':
            let unitList = []
            community.buildingEntityList.forEach(item => {
              unitList = unitList.concat(item.buildingUnitEntityList)
            })
            const unit = unitList.filter(item => {
              return item.id === id
            })
            if (unit.length !== 1) {
              this.$toast('数据异常，修改失败!')
              this.loading = false
              return
            }
            unit[0].unitCode = val
            break
          case 'room':
            community.buildingEntityList.forEach(ridgepole => {
              if (ridgepole.id === this.ridgepole.id) {
                ridgepole.buildingUnitEntityList.forEach(unit => {
                  if (unit.id === this.unit.id) {
                    unit.houseEntityList.forEach(room => {
                      if (room.id === id) {
                        room.houseCode = val
                        return false
                      }
                    })
                  }
                })
              }
            })
            break
        }
        this.$axios.post('/api/communityInfo/edit', community).then(res => {
          this.updateCallback('edit', type, id, val)
          this.$toast('修改成功!')
        }).catch(() => {}).finally(() => {
          this.loading = false
        })
      })
    },
    del (communityId, type, title, id) {
      this.$dialog.confirm({
        title: '确认删除',
        message: '删除"' + title + '"后此操作不可恢复.'
      }).then(() => {
        this.loading = true
        this.qryCommunityDetail(communityId).then(res => {
          const community = res.data
          switch (type) {
            case 'zone':
              const zone = community.zoneEntityList.filter(item => {
                return item.id === id
              })
              if (zone.length !== 1) {
                this.$toast('数据异常，删除失败!')
                this.loading = false
                return
              }
              zone[0].rdStatus = 1
              break
            case 'ridgepole':
              const ridgepole = community.buildingEntityList.filter(item => {
                return item.id === id
              })
              if (ridgepole.length !== 1) {
                this.$toast('数据异常，删除失败!')
                this.loading = false
                return
              }
              ridgepole[0].rdStatus = 1
              break
            case 'unit':
              const unitList = []
              community.buildingEntityList.forEach(item => {
                unitList.concat(item.buildingUnitEntityList)
              })
              const unit = unitList.filter(item => {
                return item.id === id
              })
              if (unit.length !== 1) {
                this.$toast('数据异常，删除失败!')
                this.loading = false
                return
              }
              unit[0].rdStatus = 1
              break
            case 'room':
              community.buildingEntityList.forEach(ridgepole => {
                if (ridgepole.id === this.ridgepole.id) {
                  ridgepole.buildingUnitEntityList.forEach(unit => {
                    if (unit.id === this.unit.id) {
                      unit.houseEntityList.forEach(room => {
                        if (room.id === id) {
                          room.rdStatus = 1
                          return false
                        }
                      })
                    }
                  })
                }
              })
              break
          }
          this.$axios.post('/api/communityInfo/edit', community).then(res => {
            this.updateCallback('del', type, id)
            this.$toast('删除成功!')
          }).catch(() => {}).finally(() => {
            this.loading = false
          })
        })
      }).catch(() => {})
    },
    updateCallback (handle, type, id, val) {
      if (handle === 'edit') {
        switch (type) {
          case 'zone':
            let zoneIndex
            const zoneArray = this.zoneSourceData.filter((item, index) => {
              if (item.id === id) {
                zoneIndex = index
                item.zoneName = val
                return item
              }
            })
            this.zoneSourceData.splice(zoneIndex, 1, ...zoneArray)
            break
          case 'ridgepole':
            let ridgepoleIndex
            const ridgepoleArray = this.ridgepoleData.filter((item, index) => {
              if (item.id === id) {
                ridgepoleIndex = index
                item.buildingCode = val
                return item
              }
            })
            if (JSON.stringify(this.zone) === '{}') {
              this.ridgepoleSourceData[this.community.id].splice(ridgepoleIndex, 1, ...ridgepoleArray)
            } else {
              this.ridgepoleSourceData[this.zone.id].splice(ridgepoleIndex, 1, ...ridgepoleArray)
            }
            break
          case 'unit':
            let unitIndex
            const unitArray = this.unitSourceData.filter((item, index) => {
              if (item.id === id) {
                unitIndex = index
                item.unitCode = val
                return item
              }
            })
            this.zoneSourceData.splice(unitIndex, 1, ...unitArray)
            break
          case 'room':
            let roomIndex
            const roomArray = this.roomData().filter((item, index) => {
              if (item.id === id) {
                roomIndex = index
                item.roomCode = val
                return item
              }
            })
            this.roomSourceData[this.unit.id].splice(roomIndex, 1, ...roomArray)
            break
        }
      } else {
        switch (type) {
          case 'zone':
            this.zoneSourceData = this.zoneSourceData.filter(item => {
              return item.id !== id
            })
            break
          case 'ridgepole':
            this.ridgepoleSourceData = this.ridgepoleSourceData.filter(item => {
              return item.id !== id
            })
            break
          case 'unit':
            this.unitSourceData = this.unitSourceData.filter(item => {
              return item.id !== id
            })
            break
          case 'room':
            this.$set(this.roomSourceData, this.unit.id, this.roomSourceData[this.unit.id].filter(item => {
              return item.id !== id
            }))
            break
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .maintain {
    .location {
      color: #07c160;
    }
  }
</style>
