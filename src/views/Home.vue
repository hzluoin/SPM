<template>
  <div class="home">
    <div class="button" @click="$router.push({ name: 'RoomStatus' })">疫情房态图</div>
    <!--<div class="button" @click="$router.push({ name: 'Batch' })">楼栋数据采集</div>-->
    <!--<div class="button" @click="$router.push({ name: 'Maintain' })">楼栋数据维护</div>-->
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'Home',
  data () {
    return {
    }
  },
  created () {
  }
}
</script>

<style lang="less" scoped>
  .home {
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
    .button {
      position: relative;
      display: block;
      width: 80%;
      .px2vw(line-height, 90);
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 40px;
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
  }
</style>
