<template>
  <div class="preview">
    <van-row type="flex" justify="space-around">
      <van-col span="11">
        <div class="container">
          <van-button type="info">编辑</van-button>
          <van-button type="danger">删除</van-button>
          <van-cell title="一栋"/>
          <van-cell title="一单元"/>
          <van-cell title="一楼"/>
          <van-cell title="101室"/>
        </div>
      </van-col>
      <van-col span="11">
        <div class="container">
          <van-cell title="一栋"/>
          <van-cell title="一单元"/>
          <van-cell title="一楼"/>
          <van-cell title="101室"/>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  name: 'Preview',
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  .preview {
    .container {
      border: 1px solid #fcfcfd;
      background: #f7f8fa;
      border-radius: 4px;
    }
  }
</style>
