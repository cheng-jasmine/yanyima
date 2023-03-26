<template>
  <div class="place" @click="placeClick">
    <div class="left" v-if="content.img">
      <img :src="content.img" alt="" />
    </div>
    <div class="right">
      <div class="name">{{ content.name }}</div>
      <div class="address">
        <div class="p">
          <img class="img" :src="IMG.address" alt="" mode="widthFix" />
          <span class="con">{{ content.address }}</span>
        </div>
        <span v-if="content.distance" class="distance"
          >{{ content.distance }}km</span
        >
      </div>
      <div class="bottom">
        <div class="le">
          <div class="time" v-if="content.time">
            <img class="img" :src="IMG.time" alt="" mode="widthFix" />{{
              content.time.length == 1
                ? content.time[0]
                : `上午:${content.time[0]},下午:${content.time[1]}`
            }}
          </div>
          <div class="phone" v-if="content.phone">
            <img class="img" :src="IMG.phone" alt="" mode="widthFix" />{{
              content.phone
            }}
          </div>
        </div>
        <div class="ri">
          <p>到这去></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG } from "../../../utils/index";

export default {
  props: ["content"],
  data() {
    return {
      IMG: IMG,
    };
  },
  methods: {
    placeClick() {
      const that = this;
      wx.getSetting({
        success(res) {
          console.log(res.authSetting, "auth");
          // 已授权定位
          if (res.authSetting["scope.userLocation"]) {
            that.openWxLocation();
          } else {
            // 未授权定位
            wx.authorize({
              scope: "scope.userLocation",
              success() {
                console.log("authorize");
                that.openWxLocation();
              },
            });
          }
        },
      });
    },
    openWxLocation() {
      const that = this;
      console.log(this.content);
      const name = that.content.name;
      const address = that.content.address;
      const latitude = parseFloat(that.content.lat);
      const longitude = parseFloat(that.content.lon);
      console.log("latitude", latitude, typeof latitude);
      console.log("longitude", longitude, typeof longitude);
      wx.openLocation({
        address,
        name,
        latitude,
        longitude,
        scale: 18,
      });
    },
  },
};
</script>

<style scoped lang="less">
.place {
  background-color: #fff;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  font-size: 0.9rem;
  .left {
    width: 6rem;
    flex-shrink: 1;
    margin-right: 1rem;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .right {
    flex: 1;
    overflow: hidden;
    .name {
      width: 100%;
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    .address {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // font-size: 0.9rem;
      margin-bottom: 10px;
      .p {
        width: 75%;
        display: flex;
        align-content: flex-start;
        align-content: center;
        .img {
          width: 32rpx;
          margin-right: 5px;
        }
        .con {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .distance {
      margin-left: 10px;
      font-size: 0.8rem;
      color: #aaaaaa;
    }
    .img {
      width: 16px;
      margin-right: 5px;
    }
  }
}
.bottom {
  display: flex;
  justify-content: space-between;
  align-content: center;
  // font-size: 0.9rem;
  .le {
    width: 72%;
    .time {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .phone {
      margin-top: 10px;
    }
  }
  .ri {
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    p {
      border: 1px solid #105aab;
      color: #105aab;
      padding: 4px 12px;
      border-radius: 20px;
    }
  }
}
</style>
