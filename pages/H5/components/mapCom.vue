<template>
  <view class="content">
    <map
      id="map"
      class="map"
      :latitude="latitude"
      :longitude="longitude"
      :scale="scale"
      :markers="markers"
      @markertap="markertap"
    >
    </map>

    <div class="dialog" v-if="dialog">
      <div class="content">
        <div class="title">
          <div class="tit">{{ dailogData.content.name }}</div>
          <div class="close" @click="closeDialog">X</div>
        </div>
        <div class="desc">地址：{{ dailogData.content.address }}</div>
        <div v-if="dailogData.content.phone" class="desc">
          咨询电话：{{ dailogData.content.phone }}
        </div>
        <div v-if="dailogData.content.time.length" class="desc">
          工作时间：{{
            dailogData.content.time.length == 1
              ? dailogData.content.time[0]
              : `上午：${dailogData.content.time[0]}，下午：${dailogData.content.time[1]}`
          }}
        </div>
        <div class="btn" @click="dao">导航</div>
      </div>
    </div>

    <div v-if="ids == 1" class="look" @click="handle(2)">
      <img class="img" :src="IMG.list2" alt="" mode="widthFix" />
      <span>综合服务点</span>
    </div>
    <div v-if="ids == 2" class="look" @click="handle(1)">
      <img class="img1" :src="IMG.list1" alt="" mode="widthFix" />
      <span>愿检尽检</span>
    </div>
  </view>
</template>

<script>
import { IMG } from "../../../utils/index";
export default {
  props: {
    mapData: {
      type: Array,
      default: () => {},
    },
    ids: {
      type: Number,
      default: 0,
    },
    location: {
      type: Object,
      require: false,
    },
  },
  data() {
    return {
      latitude: 30,
      longitude: 120,
      markers: [],
      dailogData: [],
      dialog: false,
      IMG: IMG,
      scale: 11,
    };
  },
  onReady() {
    console.log(this.location, "location", this.ids);
    this.scale = this.ids == 1 ? 11 : 12;
    this.mapContext = uni.createMapContext("map", this);
    this.latitude = parseFloat(this.location.latitude);
    this.longitude = parseFloat(this.location.longitude);
    // // 因为设备地址在成都，所以在本地测试时，改为检测点的第一个
    // this.latitude = Number(this.mapData[0].lat);
    // this.longitude = Number(this.mapData[0].lon);

    this.addMarkers();
  },
  methods: {
    addMarkers() {
      let positions = [];
      if (this.location) {
        positions.push({
          iconPath: "/static/img/local.png",
          width: 25,
          height: 30,
          id: 20,
          latitude: parseFloat(this.location.latitude),
          longitude: parseFloat(this.location.longitude),
          callout: {
            content: "我的位置",
            color: "#000",
            borderRadius: 15,
            padding: "6",
            bgColor: "#FFFFFF",
          },
        });
      }
      const icon1 = "/static/img/icon1.png";
      const icon2 = "/static/img/icon2.png";
      const icon3 = "/static/img/icon3.png";
      this.mapData.forEach((item, i) => {
        positions.push({
          iconPath: this.ids == 1 ? icon1 : this.ids == 2 ? icon2 : icon3,
          width: 35,
          height: 35,
          id: i + 1,
          content: item,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
        });
      });
      this.markers = positions;
      this.mapContext.addMarkers({
        markers: positions,
        clear: true,
        success(res) {
          console.log("success addMarkers", res);
        },
        fail(res) {
          console.log("fail addMarkers", res);
        },
      });
    },
    markertap(e) {
      let marker = this.markers.find((item) => {
        return item.id == e.detail.markerId;
      });
      if (marker.id != 20) {
        this.dailogData = marker;
        this.dialog = true;
      } else {
        this.dialog = false;
      }
    },
    closeDialog() {
      this.dialog = false;
      this.dailogData = [];
    },
    dao() {
      const name = this.dailogData.content.name;
      const address = this.dailogData.content.address;
      const latitude = this.dailogData.latitude;
      const longitude = this.dailogData.longitude;
      wx.openLocation({
        address,
        name,
        latitude,
        longitude,
        scale: 18,
      });
    },

    handle(ids) {
      this.$emit("handle", { tabId: ids });
    },
  },
};
</script>

<style scoped lang="less">
.content {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}

.map {
  width: 100%;
  height: 100%;
}
.dialog {
  position: fixed;
  bottom: 6px;
  z-index: 1024;
  width: 100vw;
  display: flex;
  justify-content: center;
  .content {
    background: #fff;
    padding: 12px;
    width: 90vw;
    border-radius: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tit {
      font-size: 1rem;
      font-weight: bold;
    }
    .close {
      padding: 6px;
    }
  }
  .desc {
    color: #666;
    font-size: 0.9rem;
    line-height: 24px;
  }
  .btn {
    width: 90%;
    color: #fff;
    background: #1b6efd;
    border-radius: 20px;
    padding: 6px;
    margin: 10px auto;
    font-size: 1rem;
    text-align: center;
  }
}
.look {
  position: fixed;
  right: 0;
  top: 27%;
  color: #1b6efd;
  background: #fff;
  padding: 6px 12px;
  border: 1px solid #d6d5d5;
  border-top-left-radius: 18px;
  border-bottom-left-radius: 18px;
  border-right: none;
  display: flex;
  align-items: center;
  .img {
    width: 12px;
    height: 15px;
    margin-right: 5px;
  }
  .img1 {
    width: 15px;
    height: 18px;
    margin-right: 5px;
  }
}
</style>