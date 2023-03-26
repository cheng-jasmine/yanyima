<template>
  <div class="inoculation">
    <div class="banner">
      <img class="img" :src="IMG.banner2" alt="" mode="widthFix" />
    </div>

    <div class="topTab">
      <div :class="[tabTop == 1 ? 'check' : 'list']" @click="changeTab(1)">
        列表
      </div>
      <div :class="[tabTop == 2 ? 'check' : 'list']" @click="changeTab(2)">
        地图
      </div>
    </div>
    <div class="container" v-if="!mapShow">
      <div class="tabCon">
        <div class="top">
          <!-- <p class="title">愿检尽检核酸采样点服务对象:</p> -->
          <!-- <p class="con">1. 非中高风险地区来（返）盐人员;</p>
          <p class="con">2. 非健康管控人员;</p> -->
          <p class="con">
            数据显示，新冠疫苗对轻症保护率达75%，重症保护率高达100%；在接种加强针后6个月，体内抗体浓度均高于第二剂峰值，且能更有效中和新冠病毒变异株，应及时接种。
          </p>
        </div>
      </div>
      <div>
        <div class="place" v-for="place in placeList" :key="place.id">
          <place :content="place" />
        </div>
      </div>
    </div>
    <map
      v-if="mapShow"
      class="mapShow"
      :mapData="placeList"
      :ids="3"
      :location="location"
    />
  </div>
</template>

<script>
import place from "./components/place.vue";
import map from "./components/mapCom.vue";
import { IMG } from "../../utils/index";
export default {
  components: {
    place,
    map,
  },
  data() {
    return {
      IMG: IMG,
      tabTop: 1,
      placeList: [],
      loading: true,
      mapShow: false,

      location: {
        latitude: null,
        longitude: null,
      },
    };
  },
  created() {
    var that = this;
    uni.getLocation({
      type: "gcj02",
      success: function (res) {
        that.location.latitude = res.latitude;
        that.location.longitude = res.longitude;
        that.handeTab();
      },
      fail: function (res) {
        that.handeTab();
      },
    });
  },
  methods: {
    handeTab() {
      this.placeList = [];
      // wx.showLoading({
      //   title: "加载中",
      // });
      this.$apiget({
        url: "/business/district/shop/point/list/yuhuan",
        data: {
          page: 1,
          limit: 10,
          latitude: this.location.latitude,
          longitude: this.location.longitude,
          shop_type: 4,
        },
      })
        .then((data) => {
          let placeList = [];
          if (data.data.datas.length) {
            data.data.datas.forEach((e) => {
              placeList.push({
                id: e.ids,
                name: e.shop_name,
                address: e.address,
                time: e.service_time
                  ? e.service_time.map((e, i) => e.name)
                  : "",
                phone: e.phone.trim(),
                lat: e.latitude,
                lon: e.longitude,
                distance: (Number(e.distance) / 1000).toFixed(1),
                img: e.shop_logo.url,
              });
            });
          } else {
            wx.showToast({
              title: "暂无数据",
              icon: "none",
              duration: 2000,
            });
          }
          this.placeList = placeList;
        })
        .catch(() => {
          wx.showToast({
            title: "加载失败",
            icon: "error",
            duration: 2000,
          });
        });
    },
    changeTab(tab) {
      this.tabTop = tab;
      if (tab == 1) {
        this.mapShow = false;
      } else if (tab == 2) {
        this.mapShow = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.inoculation {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding-top: 10px;
  .banner {
    width: 100vw;
    height: 15vh;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    .img {
      width: 90%;
      height: 100%;
    }
  }
  .container {
    // flex: 1;
    background: #f2f9ff;
    padding: 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .tabCon {
      display: flex;
      flex-direction: column;
      .top {
        background-color: #fff;
        padding: 1rem;
        border-radius: 10px;
        // border: 1px solid #1b6efd;
        margin-bottom: 10px;
        background: #dbeeff;
        .title {
          color: #1267f8;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .con {
          font-size: 0.9rem;
          line-height: 1.5rem;
        }
      }
    }
    .list {
      flex: 1;
      // overflow: auto;
      .place {
        margin-bottom: 1rem;
        &:last-child {
          margin-bottom: 0px;
        }
      }
    }
  }
}
.mapShow {
  height: 80vh;
  width: 100%;
}
.topTab {
  display: flex;
  .list {
    color: #000;
    width: 50%;
    text-align: center;
    padding-bottom: 10px;
    position: relative;
    font-size: 1.2rem;
    font-weight: 500;
  }
  .check {
    color: #1267f8;
    width: 50%;
    text-align: center;
    padding-bottom: 10px;
    position: relative;
    font-size: 1.2rem;
    font-weight: 500;
    &::after {
      content: "";
      position: absolute;
      bottom: 0px;
      height: 3px;
      width: 100px;
      background-color: #1f70fd;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 1px;
    }
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
