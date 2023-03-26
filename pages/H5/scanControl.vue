<template>
  <div class="scanControl">
    <div class="top">
      <div class="address">
        <img class="scan" :src="IMG.addrss" alt="" mode="widthFix" />
        <div class="text">
          {{ !websiteIds ? "请先获取场所管控权限" : address }}
        </div>
      </div>
      <div class="line">
        <div class="scanBtn" @click="wxScan">
          <span>扫码获取场所</span>
          <img class="right" :src="IMG.rightIcon" alt="" mode="widthFix" />
        </div>
      </div>
      <div class="tips">
        <img class="tipimg" :src="IMG.tip" alt="" mode="widthFix" />
        <div class="tip" v-if="!websiteIds">
          <div class="ti">温馨提示：</div>
          <div class="ti">
            1.请先点击上方获取场所码获取权限，单次4小时内有效；
          </div>
          <div class="ti">
            2.此项功能仅供实体码用户进出场所查验使用，无需用户请勿点击。
          </div>
        </div>
        <div class="tip" v-else>
          温馨提示：扫描场所码后，识别用户实体码后方可通行
        </div>
      </div>
    </div>
    <div class="center">
      <div class="box" :class="[websiteIds ? 'bg' : '']" @click="scanSTM">
        <img
          v-if="!websiteIds"
          class="scan"
          :src="IMG.scan1"
          alt=""
          mode="widthFix"
        />
        <img
          v-if="websiteIds"
          class="scan"
          :src="IMG.scan2"
          alt=""
          mode="widthFix"
        />
        <div class="text">实体码扫码</div>
        <div class="tip" v-if="!websiteIds">请先点击上方扫码获取场所按钮</div>
      </div>
    </div>

    <!-- 扫码管控弹窗 -->
    <div class="trip-card-box" v-if="scanCodeShow">
      <div class="scan-code">
        <div class="name">{{ scanData.name }}</div>
        <div class="healthcode" v-if="scanData.qrcodeColor">
          <TkiQrcode
            :loadMake="true"
            :val="scanData.qrcodeText"
            :foreground="scanData.qrcodeColor"
            :pdground="scanData.qrcodeColor"
            size="300"
          />
        </div>
        <block v-else>
          <img class="qrcode-img" mode="widthFix" :src="IMG.noCode" alt="" />
        </block>
        <div class="healthData">
          <div class="left">
            <nucleic
              :checktime="scanData.checktime"
              :nucleicDate="scanData.nucleicDate"
              :nucleicState="scanData.nucleicState"
              :btnShow="false"
            />
          </div>
          <div class="right">
            <vaccinate
              :vaccinationNum="scanData.vaccinationNum"
              :btnShow="false"
            />
          </div>
        </div>
        <div class="scanBtn" @click="scanSTM">继续扫一扫</div>
        <img
          class="close"
          :src="IMG.close1"
          alt=""
          mode="widthFix"
          @click="scanCodeShow = false"
        />
        <img
          v-if="monitorDay"
          class="monitorTip"
          :src="IMG.monitorTip"
          mode="widthFix"
          alt=""
        />
      </div>
    </div>

    <!-- 提示弹窗 -->
    <div class="trip-card-box" v-if="toolTip">
      <div class="toolTip-box">
        <div class="toolTip-box-title">温馨提示</div>
        <div class="toolTip-box-address">
          是否获取{{ mo_address }}场所管控权限
        </div>
        <div class="toolTip-box-tips">
          <img class="tip" :src="IMG.noCode" alt="" mode="widthFix" />
          <div class="text">
            提示：选择是可获取4小时网点管理员（扫码管控）权限
          </div>
        </div>
        <div class="buttons">
          <div class="confirm" @click="getPermission">是</div>
          <div class="confirm" @click="cancel">否</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime, IMG } from "../../utils";
import TkiQrcode from "../../components/tki-qrcode.vue";
import nucleic from "../../components/nucleic.vue";
import vaccinate from "../../components/vaccinate.vue";
export default {
  components: {
    TkiQrcode,
    nucleic,
    vaccinate,
  },
  data() {
    return {
      IMG: IMG,
      scanCodeShow: false, // 扫码弹窗
      scanData: {}, // 扫码数据
      address: "", // 扫码场所的名字
      websiteIds: "", // 扫码场所的ids
      scanList: [],

      toolTip: false, // 提示弹窗
      mo_ids: "", // 中间转化的场所ids
      mo_address: "",

      monitorDay: 0, // 剩余监测天数
    };
  },
  onShow(options) {},
  onLoad(options) {
    const value = JSON.parse(wx.getStorageSync("StoragePermissions"));
    if (value) {
      const permissionTime = new Date(
        value.endTime.replace(/-/g, "/")
      ).getTime();
      if (new Date().getTime() < permissionTime) {
        this.address = value.moName;
        this.websiteIds = value.ids;
      }
    }
  },
  methods: {
    // 调用微信扫场所码
    wxScan() {
      const that = this;
      wx.scanCode({
        success(res) {
          console.log(res, "scan", res.path);
          if (res.path) {
            let path = res.path;
            const index1 = path.indexOf("=");
            const ids = path.substring(index1 + 1, path.length);
            that.getPlace(ids);
          } else {
            wx.showToast({
              title: "请扫描场所码",
              icon: "none",
              duration: 1500,
            });
          }
        },
      });
    },
    // 获取场所信息
    getPlace(ids) {
      this.mo_ids = ids;
      this.$apiget({
        url: "/custom/sweep/place/code/place_code?ids=" + ids,
      })
        .then((res) => {
          if (res.code === 200) {
            this.mo_address = res.data.moName;
            this.toolTip = true;
          } else {
            wx.showToast({
              title: "获取场所信息失败",
              icon: "none",
              duration: 1500,
            });
            this.mo_ids = "";
          }
        })
        .catch(() => {
          wx.showToast({
            title: "获取场所信息失败",
            icon: "none",
            duration: 1500,
          });
          this.mo_ids = "";
        });
    },
    cancel() {
      this.toolTip = false;
      this.mo_address = "";
      this.mo_ids = "";
    },
    // 获取权限
    getPermission() {
      this.$apiget({
        url: "/custom/sweep/place/code/set_per?ids=" + this.mo_ids,
      })
        .then((res) => {
          // console.log(res);
          if (res.code === 200) {
            wx.setStorageSync("StoragePermissions", JSON.stringify(res.data));
            this.address = this.mo_address;
            this.websiteIds = this.mo_ids;
            this.toolTip = false;
          } else {
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 1500,
            });
            this.toolTip = false;
          }
        })
        .catch(() => {
          this.toolTip = false;
          wx.showToast({
            title: "获取场所权限失败",
            icon: "none",
            duration: 1500,
          });
        });
    },
    // 调用微信扫实体码
    scanSTM() {
      if (!this.websiteIds) return;
      this.monitorDay = 0;
      this.scanCodeShow = false;
      const that = this;
      wx.scanCode({
        success(res) {
          // console.log(res, "scan", res.result);
          that.sendScanData(res.result);
        },
      });
    },
    sendScanData(value) {
      this.scanData = {};
      uni.showLoading({
        title: "获取中",
        mask: true,
      });
      this.$apipost({
        url: `/stm/prevention/control/health`,
        data: {
          type: "health",
          qrCode: value,
          ids: this.websiteIds,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            let { codeColor, nucleicAcidV2, vaccinationS, health_monitoring } =
              res?.data;
            this.monitorDay = health_monitoring ? health_monitoring : 0; // 监测剩余天数
            let name = res.data.name;
            const n1 = name.slice(0, 1);
            const n2 = name.slice(2, name.length);
            this.scanData.name = n1 + "*" + n2;
            this.scanData.qrcodeText = value;
            if (codeColor === "绿码") {
              this.scanData.qrcodeColor = "green";
            } else if (codeColor === "黄码") {
              this.scanData.qrcodeColor = "#fcc40c";
            } else if (codeColor === "红码") {
              this.scanData.qrcodeColor = "#fa2c2d";
            } else {
              this.scanData.qrcodeColor = "";
            }
            this.scanData.vaccinationNum = vaccinationS.length
              ? Number(vaccinationS[0].vaccinationTime)
              : 0; // 疫苗接种针数
            this.scanData.vaccinationTime = vaccinationS.length
              ? vaccinationS[0].vaccinationDateTime.substring(0, 10)
              : 0; // 疫苗接种时间
            // 核酸信息
            if (nucleicAcidV2.length) {
              this.scanData.nucleicDate = nucleicAcidV2[0].report_on_time;
              this.scanData.nucleicResult = nucleicAcidV2[0].result;
              // 判断核酸检测时间
              const nowTime = new Date().getTime(); //当前时间戳
              const date = new Date(
                this.scanData.nucleicDate.replace(/-/g, "/")
              ).getTime(); //核酸时间的时间戳

              const TimeDays = 1000 * 60 * 60 * 24; //1天的时间戳
              if (date + TimeDays >= nowTime) {
                // 核酸检测时间+1天的时间戳>现在的时间，表示核酸检测时间在1天内
                this.scanData.checktime = 1; // 一天内
              } else if (date + 2 * TimeDays >= nowTime) {
                this.scanData.checktime = 2; // 2天内
              } else if (date + 3 * TimeDays >= nowTime) {
                this.scanData.checktime = 3; // 3天内
              } else if (date + 4 * TimeDays >= nowTime) {
                this.scanData.checktime = 4; // 4天内
              } else {
                this.scanData.checktime = 5; // 4天外
              }
            } else {
              this.scanData.nucleicDate = "未检测";
              this.scanData.nucleicResult = "未检测";
              this.scanData.checktime = 0;
            }
            if (this.scanData.nucleicResult == "阳性") {
              this.scanData.nucleicState = true;
            }
            uni.hideLoading();
            this.scanCodeShow = true;
          } else {
            uni.hideLoading();
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 1500,
            });
          }
        })
        .catch(() => {
          uni.hideLoading();
          wx.showToast({
            title: "数据请求出错",
            icon: "error",
            duration: 1500,
          });
        });
    },
  },
};
</script>

<style scoped lang="less">
.scanControl {
  height: 100vh;
  overflow-y: scroll;
  width: 100vw;
  font-size: 1rem;
  background-color: #f1f6ff;
  position: relative;
}
.top {
  padding: 20px 12px;
  background-color: #468afe;
  color: #fff;
  .address {
    display: flex;
    align-items: center;
    font-size: 36rpx;
    margin-bottom: 30rpx;
    font-weight: bold;
    .scan {
      width: 30rpx;
      margin-right: 10rpx;
    }
  }
  .line {
    display: inline-block;
    margin-bottom: 60rpx;
  }
  .scanBtn {
    display: flex;
    align-items: center;
    background-color: #90b9fe;
    border-radius: 24rpx;
    font-size: 28rpx;
    width: auto;
    padding: 10rpx 24rpx;
    font-weight: 500;
    .right {
      width: 15rpx;
      margin-left: 10rpx;
    }
  }
  .tips {
    display: flex;
    font-size: 24rpx;
    min-height: 5vh;
    .tipimg {
      width: 35rpx;
      margin-right: 20rpx;
    }
    .tip {
      .ti {
        margin-bottom: 16rpx;
      }
    }
  }
}
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #dddddd;
    padding: 34rpx 50rpx 15rpx;
    border-radius: 20rpx;
    color: #999999;
    .scan {
      width: 70rpx;
    }
    .text {
      font-size: 40rpx;
      margin: 16rpx;
    }
    .tip {
      color: #aeaeae;
      font-size: 22rpx;
    }
  }
  .bg {
    background-color: #468afe;
    color: #fff;
    padding: 34rpx 50rpx 15rpx;
  }
}
.trip-card-box {
  position: fixed;
  top: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.7);
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  overflow-y: scroll;
}
.scan-code {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  border-radius: 20rpx;
  background-color: #ffffff;
  width: 90%;
  padding: 40rpx;
  position: relative;
  .close {
    position: absolute;
    width: 60rpx;
    bottom: -100rpx;
    z-index: 1024;
  }
  .qrcode-img {
    width: 250rpx;
    height: 250rpx;
    object-fit: contain;
    margin-bottom: 16rpx;
    margin: 30rpx 0;
  }
  .name {
    font-size: 40rpx;
    font-weight: 500;
  }
  .healthcode {
    margin: 20rpx 0 40rpx;
  }
  .healthData {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .left,
    .right {
      width: 47%;
    }
  }
  .scanBtn {
    background-color: #3381f6;
    color: #fff;
    font-size: 30rpx;
    padding: 15rpx;
    width: 90%;
    text-align: center;
    border-radius: 40rpx;
    margin-top: 50rpx;
  }
  .monitorTip {
    position: absolute;
    width: 100%;
    top: 200rpx;
  }
}
.toolTip-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  border-radius: 20rpx;
  background-color: #ffffff;
  width: 90%;
  padding: 72rpx 45rpx;
  color: #333;
  &-title {
    font-size: 40rpx;
    font-weight: bold;
  }
  &-address {
    font-size: 36rpx;
    font-weight: 500;
    margin: 50rpx 0;
  }
  &-tips {
    display: flex;
    font-size: 24rpx;
    color: #666;
    .tip {
      width: 30rpx;
      margin-right: 20rpx;
    }
  }
  .buttons {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-top: 50rpx;
    > div {
      width: 30%;
      background-color: #5ca8ff;
      border-radius: 30rpx;
      color: #fff;
      font-size: 36rpx;
      text-align: center;
      padding: 10rpx 0;
    }
  }
}
</style>