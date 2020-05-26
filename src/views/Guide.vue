<template>
  <div class="guide">
    <div class="notice">
      <img src="../assets/images/title.png">
      <p>为节省通过站点检查时间，请提前上报入湘人员个人信息，信息如实完整填报提交后获得出站核验图片。
        ￼请按相关法律规定及我省疫情防控工作要求，请务必如实填写，虚假填写、瞒报信息等情况，将自行承担法律责任。
      </p>
    </div>
    <div class="notice2">
      <p class="title">核验图片提交信息后自动生成，可以以下方式出示给出站检查：</p>
      <p><i>1</i><span>信息提交后不退出图片界面、直接出示供出站核查。</span></p>
      <p><i>2</i><span>收到核验图片后长按可以图片格式保存或截屏保存。</span></p>
      <p><i>3</i><span>个别手机系统提交后未形成校验图片跳转提示下载的可下载图片保存。</span></p>
      <p><i>4</i><span>所有成功提交信息的旅客都可以在首页个人查询栏输入证件号查询校验图片供出站核查。</span></p>
      <p><i>5</i><span>入湘人员每人必填</span></p>
    </div>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'Guide'
}
</script>

<style lang="less" scoped>
  /*样式定义*/
  .guide {
    min-height: 100%;
    background: url("../assets/images/guide-bg.png");
    background-size: cover;
    overflow: hidden;
    >div {
      .px2vw(width, 670);
      .px2vw(padding, 40);
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      background: #fff;
      .px2vw(border-radius, 16);
      position: relative;
      margin: auto;
      color: #73767a;
      font-size: 14px;
      line-height: 1.8;
    }
    .notice {
      .px2vw(margin-top, 220);
      img {
        .px2vw(width, 590);
        .px2vw(margin-bottom, 30);
      }
    }
    .notice2 {
      .title {
        font-size: 16px;
        font-weight: bold;
        color: black;
      }
      i {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #FFF;
        font-size: 14px;
        font-weight: bold;
        background: linear-gradient(180deg, #fccd7a, #fba654);
        border-radius: 100%;
      }
      .px2vw(margin-top, 40);
      .px2vw(margin-bottom, 80);
    }
  }
</style>
