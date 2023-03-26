<template>
  <view class="index-content">
    <view class="boxstyle">
      <view class="boxstyle-title">
        <span>{{ box.title }}</span>
      </view>
      <view class="boxstyle-content">
        <view
          class="boxstyle-content-item"
          v-for="item in boxList"
          :key="item.title"
          @click="toH5(item)"
        >
          <template>
            <image :src="item.icon" class="icon"></image>
            <span class="boxstyle-content-item-title">{{ item.title }}</span>
          </template>
        </view>
      </view>
      <view
        class="btn"
        v-if="box.children.length > 5 && show === 1"
        @click="handle(2)"
      >
        <span>展开全部</span>
        <image class="topDown" :src="IMG.down"></image>
      </view>
      <view
        class="btn"
        v-if="box.children.length > 5 && show === 2"
        @click="handle(1)"
      >
        <span>收起</span>
        <image class="topDown" :src="IMG.top"></image>
      </view>
    </view>
  </view>
</template>

<script>
import { IMG } from "../../utils/index";
export default {
  name: "IndexContentBox",
  props: {
    box: {
      type: Object,
      default: {
        title: "",
        children: [],
      },
    },
  },
  data() {
    return {
      IMG: IMG,
      show: 1,

      list: [],
      boxList: [],
    };
  },
  created() {
    if (this.box.children.length > 5) {
      this.box.children.forEach((e, i) => {
        if (i < 5) {
          this.list.push(e);
        }
      });
    } else {
      this.list = this.box.children;
    }
    this.boxList = this.list;
  },
  methods: {
    // 展开与收起
    handle(i) {
      this.show = i;
      if (i == 2) {
        this.boxList = this.box.children;
      } else if (i == 1) {
        this.boxList = this.list;
      }
    },

    toH5(data) {
      const that = this;
      // console.log(data, "data");
      if (data.title === "核酸检测地点") {
        wx.navigateTo({
          url: "/pages/H5/location",
        });
      } else if (data.title === "疫苗接种") {
        wx.navigateTo({
          url: "/pages/H5/inoculation",
        });
      } else if (data.title === "扫码管控") {
        wx.navigateTo({
          url: "/pages/H5/scanControl",
        });
      } else if (data.url) {
        // 这里跳转链接
        uni.navigateTo({
          url: "/pages/H5/H5?url=" + data.url,
        });
      } else if (!data.url) {
        wx.showToast({
          title: "正在建设中",
          icon: "none",
          duration: 1500,
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.index-content {
  width: 100vw;
  box-sizing: border-box;
  padding: 0 30rpx;
  margin-top: 20rpx;
}
.boxstyle {
  width: 100%;
  box-sizing: border-box;
  padding: 18rpx 20rpx;
  margin-top: 20rpx;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #ffffff;
  &-title {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 34rpx;
    // margin-bottom: 30rpx;
    > i {
      margin-right: 10rpx;
    }
  }
  &-content {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    &-item {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      margin-top: 20rpx;
      > i {
        margin-bottom: 25rpx;
      }
      .icon {
        width: 50rpx;
        height: 50rpx;
      }
      &-title {
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: #333333;
        width: 100rpx;
        text-align: center;
        margin-top: 10rpx;
      }
    }
  }
}
.btn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999999;
  font-size: 22rpx;
  margin-top: 20rpx;
  .topDown {
    width: 28rpx;
    height: 10rpx;
    margin-left: 10rpx;
  }
}
</style>

