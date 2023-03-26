<template>
  <div
    class="necleic"
    :class="[
      nucleicState
        ? 'redb'
        : checktime <= 3 && checktime !== 0
        ? 'greenb'
        : 'grayb',
    ]"
  >
    <div class="text" v-if="nucleicState">阳性</div>
    <div class="text" v-else-if="checktime == 0">未检测</div>
    <div class="text" v-else>
      <div class="time">
        {{
          checktime === 1
            ? "24"
            : checktime === 2
            ? "48"
            : checktime === 3
            ? "72"
            : checktime === 4
            ? "96"
            : ">96"
        }}
      </div>
      <div class="r">
        <div class="t">小时内</div>
        <div class="result">阴性</div>
      </div>
    </div>

    <div
      class="btn"
      :style="{ border: checktime == 0 || !btnShow ? 'none' : '' }"
    >
      <span>核酸检测报告</span>
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
    checktime: {
      type: Number,
      default: 0,
    },
    //核酸检测时间
    nucleicDate: {
      type: String,
      default: "",
    },
    //核酸检测状态
    nucleicState: {
      type: Boolean,
      default: false,
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
.greenb {
  background-image: linear-gradient(45deg, #6db0ec, #64d792);
}
.redb {
  background: #ec4b40;
}
.grayb {
  background-image: linear-gradient(45deg, #9b9b9b, #d9d7d8);
}
.necleic {
  padding: 30rpx;
  border-radius: 20rpx;
  color: #fff;
  .text {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    height: 90rpx;
    margin-bottom: 10rpx;
    .time {
      font-size: 64rpx;
      margin-right: 10rpx;
    }
    .r {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .t {
        font-size: 16rpx;
      }
      .result {
        font-size: 24rpx;
      }
    }
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