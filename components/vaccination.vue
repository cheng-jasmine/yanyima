<template>
  <div class="vaccination" :style="{ height: height + 'rpx' }">
    <div
      v-if="vaccinationNum"
      class="circular c2"
      :style="{
        width: size + 'rpx',
        height: size + 'rpx',
        fontSize: resultSize + 'rpx',
      }"
    >
      <p>接种</p>
      <p>{{ vaccinationNum }}针</p>
    </div>
    <img
      v-else
      class="codes"
      :style="{ width: size + 'rpx', height: size + 'rpx' }"
      :src="IMG.noCode"
      alt=""
      :mode="widthFix"
    />
    <div class="data" :style="{ fontSize: fontSizeDesc + 'rpx' }">
      {{ vaccinationTime != 0 ? vaccinationTime : "未查询到结果" }}
    </div>
    <div :style="{ fontSize: fontSizeTitle + 'rpx' }">疫苗接种报告</div>
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
    //核酸检测时间
    vaccinationTime: {
      type: String,
      default: "",
    },
    //核酸检测状态
    nucleicState: {
      type: String,
      default: "",
    },
    // 图标尺寸
    size: {
      type: Number,
      default: 140,
    },
    // 描述文字
    fontSizeDesc: {
      type: Number,
      default: 24,
    },
    // 标题文字
    fontSizeTitle: {
      type: Number,
      default: 26,
    },
    // 高度
    height: {
      type: Number,
      default: 280,
    },
    resultSize: {
      type: Number,
      default: 28,
    },
  },
  data() {
    return {
      IMG: IMG,
    };
  },
};
</script>

<style lang="less" scoped>
.vaccination {
  background-color: #f3f3f3;
  padding: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10rpx;
}
.codes {
  margin-top: 18%;
  margin-bottom: 16%;
}
.data {
  color: #666666;
}

.circular {
  margin-top: 18%;
  margin-bottom: 16%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4caa63;
  border-radius: 50%;
  color: #fff;
  font-weight: bold;
}
.red {
  background-color: #ec4b40;
}
.tip {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 18rpx;
  background-color: #bbbbbb;
  color: #fff;
  padding: 4rpx 8rpx;
  border-bottom-left-radius: 8rpx;
}
.green {
  background-color: #4caa63;
}
.gray {
  background-color: #bbbbbb;
}
.c2 {
  background-color: #fed57d;
  color: #ba8004;
  flex-wrap: wrap;
  flex-direction: column;
}
</style>