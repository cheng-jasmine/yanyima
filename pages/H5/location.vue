<template>
  <div class="location" :loading="loading">
    <div class="banner">
      <img class="img" :src="IMG.banner1" alt="" mode="widthFix" />
    </div>

    <div class="topTab">
      <div :class="[tabTop == 1 ? 'check' : 'list']" @click="changeTab(1)">
        列表
      </div>
      <div :class="[tabTop == 2 ? 'check' : 'list']" @click="changeTab(2)">
        地图
      </div>
    </div>
    <div class="container" v-if="tabId == 1 && !mapShow">
      <div class="tabCon">
        <div class="top">
          <p class="title">愿检尽检核酸采样点服务对象:</p>
          <p class="con">1. 非中高风险地区来（返）盐人员;</p>
          <p class="con">2. 非健康管控人员;</p>
          <p class="con">3. 其他主动检测的愿检尽检非涉疫人员。</p>
        </div>
      </div>
      <div class="list">
        <div class="place" v-for="place in placeList" :key="place.id">
          <place :content="place" />
        </div>
      </div>
    </div>
    <div class="container" v-if="tabId == 2 && !mapShow">
      <div class="tabCon">
        <div class="top">
          <p class="title">综合服务点采样服务对象为:</p>
          <p class="con">1. "红码"或需集中隔离人员（仅天都酒店综合服务点）;</p>
          <p class="con">2. "黄码""红码"人员;</p>
          <p class="con">3. "居家健康观察""日常健康监测"人员。</p>
        </div>
      </div>
      <div class="list">
        <div class="place" v-for="place in placeList" :key="place.id">
          <place :content="place" />
        </div>
      </div>
    </div>
    <div v-if="tabId == 1" class="look" @click="handeTab(2)">
      <img class="img" :src="IMG.list2" alt="" mode="widthFix" />
      <span>综合服务点</span>
    </div>
    <div v-if="tabId == 2" class="look" @click="handeTab(1)">
      <img class="img1" :src="IMG.list1" alt="" mode="widthFix" />
      <span>愿检尽检</span>
    </div>
    <map
      v-if="mapShow && !loading"
      class="mapShow"
      :mapData="placeList"
      :ids="tabId"
      :location="location"
      @handle="handle"
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
      tabs: [
        {
          id: 1,
          label: "愿检尽检",
        },
        {
          id: 2,
          label: "综合服务点",
        },
      ],
      tabTop: 1,
      tabId: 1,
      placeList: [],
      placeList1: [],
      placeList2: [],
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
        that.handeTab(that.tabId);
      },
      fail: function (res) {
        that.handeTab(that.tabId);
      },
    });
  },
  methods: {
    handeTab(id) {
      this.tabId = id;
      this.placeList = [];
      this.loading = true;
      this.$apiget({
        url: "/business/district/shop/point/list/yuhuan",
        data: {
          page: 1,
          limit: 10,
          latitude: this.location.latitude,
          longitude: this.location.longitude,
          industry: this.tabId,
        },
      }).then((data) => {
        let placeList = [];
        data.data.datas.forEach((e) => {
          placeList.push({
            id: e.ids,
            name: e.shop_name,
            address: e.address,
            time: e.service_time ? e.service_time.map((e, i) => e.name) : "",
            phone: e.phone.trim(),
            lat: e.latitude,
            lon: e.longitude,
            distance: (Number(e.distance) / 1000).toFixed(1),
            img: e.shop_logo.url,
          });
        });
        this.placeList = placeList;
        this.loading = false;
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
    handle(val) {
      const ids = val.target.__args__[0].tabId;
      this.handeTab(ids);
    },
  },
};
</script>

<style lang="less" scoped>
.location {
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
