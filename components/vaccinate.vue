<template>
  <div class="vacc">
    <div class="text">接种{{ vaccinationNum }}针</div>
    <div class="btn" :style="{ border: !btnShow ? 'none' : '' }">
      <span>疫苗接种报告</span>
      <img
        v-if="btnShow"
        class="icon"
        :src="IMG.rightW"
        alt=""
        mode="widthFix"
      />
    </div>
  </div>
</template>

<script>
import { IMG } from "../utils/index";
export default {
  props: {
    //疫苗接种针数
    vaccinationNum: {
      type: Number,
      default: 0,
    },
    btnShow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      IMG: IMG,
    };
  },
};
</script>

<style scoped lang="less">
.vacc {
  padding: 30rpx;
  border-radius: 20rpx;
  color: #fff;
  background-image: linear-gradient(45deg, #ffc03b, #ffde98);
  .text {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    margin-bottom: 10rpx;
    height: 90rpx;
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    border-radius: 30rpx;
    border: 1px solid #fff;
    height: 50rpx;
    .icon {
      padding: 10rpx;
      height: 20rpx;
      width: 20rpx;
    }
  }
}
</style>