<template>
  <div class="page-box">
    <image class="top-img" :src="IMG.backgroundImg" alt="" mode="widthFix" />
    <div class="top-title">海盐盐易码</div>
    <view class="box-msg">
      <view class="item-row">
        <image class="item-row-icon" :src="IMG.cname" mode="widthFix" />
        <input
          class="item-row-input"
          v-model="curInfo.keyName"
          type="text"
          @blur="blurInput(curInfo.keyName, 'name')"
          placeholder-style="color:#e6e6e6"
          placeholder="请输入姓名"
        />
      </view>
      <view class="item-row">
        <image class="item-row-icon" :src="IMG.idcard" mode="widthFix" />
        <picker
          class="picker"
          @change="bindPickerChange2"
          :value="index"
          :range="cardList"
        >
          <view class="item-row-input">{{ cardList[index] }}</view>
        </picker>
      </view>
      <view class="item-row">
        <image
          class="item-row-icon"
          :src="IMG.card"
          mode="widthFix"
          style="width: 46rpx"
        />
        <input
          class="item-row-input"
          v-model="curInfo.keyId"
          type="text"
          @blur="blurInput(curInfo.keyId, 'id')"
          placeholder-style="color:#e6e6e6"
          placeholder="请输入证件号码"
          maxlength="18"
        />
      </view>
      <view class="item-row">
        <image class="item-row-icon" :src="IMG.phone" mode="widthFix" />
        <input
          class="item-row-input"
          v-model="curInfo.phone"
          type="text"
          placeholder-style="color:#e6e6e6"
          placeholder="请输入手机号"
          maxlength="11"
        />
      </view>
      <view class="item-row">
        <image class="item-row-icon" :src="IMG.yzm" mode="widthFix" />
        <input
          class="item-row-input"
          v-model="curInfo.yzm"
          type="text"
          placeholder-style="color:#e6e6e6"
          placeholder="请输入验证码"
          maxlength="6"
        />
        <button
          :class="['mini-btn', yzmDisable ? 'yzmDisable' : '']"
          size="mini"
          :disabled="yzmDisable"
          @click="getYZM"
        >
          {{ yzmText }}
        </button>
      </view>
      <div class="info-tip">注：请先申领浙江省健康码</div>
      <div class="info-box">
        <image class="info-box-icon" :src="IMG.info" mode="widthFix" />
        <div class="info-box-title">您正在验证身份信息，请确认</div>
      </div>
      <button class="search-btn" @click="toVerify">确认</button>
    </view>
  </div>
</template>

<script>
import { baseUrl, validator, IMG, cardList, cardListValue } from "../../utils";
export default {
  data() {
    return {
      IMG: IMG,
      cardList: cardList,
      cardListValue: cardListValue,
      index: 0,
      curInfo: {
        // 姓名
        keyName: "",
        cardIdType: "IDENTITY_CARD", // 证件类型，默认身份证
        // 身份证号
        keyId: "", // 123456789012345678
        phone: "",
        yzm: "", //验证码
      },
      // 用户ids
      memberIds: "",

      yzmText: "获取验证码",
      yzmDisable: true,
      totalTime: 120,
    };
  },
  onLoad(options) {
    console.log(options, "options onload");
    if (Reflect.has(options, "name")) {
      this.curInfo.keyName = options.name;
      this.curInfo.phone = options.phone;
      this.curInfo.keyId = options.idcard;
      this.curInfo.cardIdType = options.cardIdType;
      const index = this.cardListValue.findIndex(
        (ele) => ele.ids === this.curInfo.cardIdType
      );
      if (index !== -1) {
        this.index = index;
      } else {
        this.index = 0;
      }
    }
  },
  watch: {
    "curInfo.phone"(now, old) {
      if (now && now.length == 11) {
        this.yzmDisable = false;
      } else {
        this.yzmDisable = true;
      }
    },
  },
  methods: {
    // 跳转实名认证小程序
    toVerify() {
      console.log(this.curInfo, this.index);
      // wx.navigateToMiniProgram({
      //   appId: 'wx308bd2aeb83d3345', // 'wx62adf534f47f7b61', // 'wx308bd2aeb83d3345',
      //   path: 'subPages/city/wxpay-auth/main',
      //   envVersion: 'release',
      //   success(res) {
      //     console.log('打开成功，结果：', res)
      //   },
      //   fail(err) {
      //     console.log('打开失败，原因：', err)
      //   },
      // })

      const that = this;
      if (this.curInfo.keyName.trim() === "") {
        wx.showToast({
          title: "请输入姓名",
          icon: "none",
          duration: 1500,
        });
        return;
      }
      if (this.index == 0 && !validator(this.curInfo.keyId.toString())) {
        wx.showToast({
          title: "请输入正确的身份证号",
          icon: "none",
          duration: 1500,
        });
        return;
      } else if (this.curInfo.keyId.trim() === "") {
        wx.showToast({
          title: "请输入正确的证件号码",
          icon: "none",
          duration: 1500,
        });
        return;
      }
      if (this.curInfo.phone.trim().length !== 11) {
        wx.showToast({
          title: "请输入正确的手机号",
          icon: "none",
          duration: 1500,
        });
        return;
      }
      if (this.curInfo.yzm.trim() === "") {
        wx.showToast({
          title: "请输入验证码",
          icon: "none",
          duration: 1500,
        });
        return;
      }

      uni.showLoading({
        title: "提交中",
      });
      const data = {
        name: this.curInfo.keyName,
        id_card_type: this.curInfo.cardIdType,
        id_card: this.curInfo.keyId,
        phone: this.curInfo.phone,
        code: this.curInfo.yzm,
      };
      this.$apipost({
        url: "/manager/user/info/update",
        data,
      })
        .then((res) => {
          console.log(res, "info update");
          uni.hideLoading();
          if (res.code === 0) {
            wx.showToast({
              title: "认证成功！",
              icon: "success",
              duration: 1500,
            });
            setTimeout(() => {
              uni.redirectTo({
                url: "/pages/index/index",
              });
            }, 1500);
          } else {
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
            title: "认证失败请重试",
            icon: "error",
            duration: 1500,
          });
        });
    },
    bindPickerChange2(e) {
      this.index = e.detail.value;
      this.curInfo.cardIdType = this.cardListValue[this.index];
    },
    // 获取验证码
    getYZM() {
      if (this.yzmDisable) return; // 禁用时不再请求
      this.yzmText = "正在获取";
      this.$apiget({
        url: "/manager/send/register/sms",
        data: {
          phone: this.curInfo.phone,
        },
      })
        .then((res) => {
          console.log(res, "验证码获取结果");
          if (res.code !== 200) {
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 1500,
            });
            this.yzmDisable = false;
          } else {
            this.yzmDisable = true;
            this.yzmText = this.totalTime + "s";
            const clock = setInterval(() => {
              this.totalTime--;
              this.yzmText = this.totalTime + "s";
              // 如果倒计时为0的话 ，恢复获取验证码按钮
              if (this.totalTime <= 0) {
                clearInterval(clock);
                this.yzmText = "重新获取";
                this.totalTime = 120;
                this.yzmDisable = false; //这里重新开启
              }
            }, 1000);
          }
        })
        .catch(() => {
          wx.showToast({
            title: "数据请求出错",
            icon: "error",
            duration: 1500,
          });
          this.yzmText = "重新获取";
          this.yzmDisable = false;
        });
    },
    /**
     * 离开输入框校验
     * @param value {string} 需要校验的值
     * @param type {string} 数据类型
     */
    blurInput(value, type) {
      let msg = "";
      switch (type) {
        // 身份证校验
        case "id":
          if (this.index == 0) {
            msg = validator(value.toString()) ? "" : "身份证格式有误";
          }
          break;
        case "name":
          msg = value.trim() === "" ? "姓名不能为空" : "";
          break;
        default:
          break;
      }
      if (msg) {
        wx.showToast({
          title: msg,
          icon: "none",
          duration: 1000,
        });
      }
    },

    /** 加载简易封装 **/
    showMsg(obj = {}) {
      if (
        Object.prototype.toString.call(obj) === "[object Object]" &&
        obj.title
      ) {
        wx.hideLoading();
        wx.hideToast();
        wx.showToast({
          icon: "none",
          duration: 1500,
          mask: true,
          ...obj,
        });
      }
    },
    /** 请求后端验证 **/
    requestSeverToVerify(verifyAuthCode) {
      const that = this;
      console.log(that.curInfo, that, "***requestSeverToVerify***");
      /** 1.获取必要参数：【身份证姓名，身份证号，登录人ids，验证code，app_id】 **/
      const member_ids = that.$store.state.qyMemberIds || "";
      console.log(member_ids, "member_ids");
      const [{ keyName: real_name, keyId: cred_id }, app_id] = [
        that.curInfo,
        wx.getAccountInfoSync().miniProgram.appId,
      ];
      that.showMsg({
        title: "绑定中...",
        icon: "loading",
        duration: 1000 * 60 * 60,
        mask: true,
      });
      // 无论成功与否，都视为已经认证过了
      that.hasVerified = true;
      wx.login({
        success: function (res2) {
          console.log("【获取wx-code成功】：", res2);
          that
            .$apiget({
              url: `/manager/user/get/open/id?app_id=${app_id}&code=${res2.code}`,
            })
            .then((res3) => {
              console.log("【获取openid成功】:", res3);
              // openid => res.data.openid
              if (res3.code == "0") {
                /** 4.必要数据获取后，请求后端校验内容 **/
                console.log(
                  {
                    open_id: res3.data.openid, // 小程序 openId
                    code: verifyAuthCode, // 小程序 回调的 code
                    app_id, // 小程序 appId

                    member_ids, // 由 h5 获取当前登录人信息获取
                    real_name: real_name.replace(/\s*/g, ""), // 由 h5 获取当前登录人输入用户姓名
                    cred_id, // 由 h5 获取当前登录人输入用户身份证
                  },
                  "send_data"
                );
                that
                  .$apipost({
                    url: "/manager/user/mini/program/verify/id/card",
                    data: {
                      open_id: res3.data.openid, // 小程序 openId
                      code: verifyAuthCode, // 小程序 回调的 code
                      app_id, // 小程序 appId

                      member_ids, // 由 h5 获取当前登录人信息获取
                      real_name: real_name.replace(/\s*/g, ""), // 由 h5 获取当前登录人输入用户姓名
                      cred_id, // 由 h5 获取当前登录人输入用户身份证
                    },
                  })
                  .then((res4) => {
                    console.log("【获取验证结果成功】：", res4);
                    if (res4.code == "0") {
                      that.showMsg({
                        title: "绑定成功！",
                        icon: "success",
                        duration: 1000 * 60 * 60,
                        mask: true,
                      });
                      /* 验证成功后的回调 */
                      setTimeout(() => {
                        wx.navigateTo({
                          url: `/pages/index/index`, //  + '&test=1'
                        });
                      }, 1000);
                    } else {
                      /*that.showMsg({title: res4.msg || '绑定失败！'})*/
                      wx.showModal({
                        title: "绑定失败",
                        content: res4.msg || "请检查相关内容是否真实有效",
                        showCancel: false,
                        confirmText: "去修改",
                        success(res) {
                          if (res.confirm) {
                            console.log("用户点击确定");
                          } else if (res.cancel) {
                            console.log("用户点击取消");
                          }
                        },
                      });
                    }
                  })
                  .catch((err4) => {
                    console.log("【获取验证结果失败】:", err4);
                    that.showMsg({ title: "获取信息失败" });
                  });
              } else {
                that.showMsg({ title: res3.msg || "获取信息失败" });
              }
            })
            .catch((err3) => {
              console.log("【获取openid失败】：", err3);
              that.showMsg({ title: "获取信息失败" });
            });
        },
        fail: function (err2) {
          console.log("【获取wx-code失败】：", err2);
          that.showMsg({ title: "获取信息失败" });
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page-box {
  height: 100vh;
  overflow: hidden;
  width: 100vw;
  font-size: 1rem;
  background-image: linear-gradient(#0b72ff 0%, #368bff 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.top-img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  object-fit: contain;
  z-index: 1;
}
.top-title {
  z-index: 2;
  margin-top: 113rpx;
  font-size: 58rpx;
  color: #ffffff;
  text-shadow: 0px 5rpx 8rpx rgba(2, 15, 101, 0.72);
}

.box-msg {
  z-index: 2;
  width: 667rpx;
  height: 930rpx;
  background: #ffffff;
  border-radius: 10rpx;
  margin-top: 80rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 82rpx;
  box-sizing: border-box;
  .item-row {
    width: auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 32rpx;
    color: #ffffff;
    width: 597rpx;
    height: 71rpx;
    border: 1px solid #e9e9e9;
    border-radius: 10rpx;
    box-sizing: border-box;
    padding-left: 42rpx;
    &:last-child {
      margin-bottom: 0;
    }
    &-icon {
      width: 41rpx;
      object-fit: contain;
      margin-right: 21rpx;
    }
    &-input {
      flex: 1;
      height: 100%;
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #666666;
    }
    .picker {
      flex: 1;
    }
  }
  .info-box {
    margin-top: 30rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    &-icon {
      width: 34rpx;
      margin-right: 11rpx;
    }
    &-title {
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #f7ad4d;
    }
  }

  .search-btn {
    width: 597rpx;
    height: 104rpx;
    background: #2e86ff;
    border-radius: 20rpx;
    margin-top: 70rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 34rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
  }
}

.mini-btn {
  background-color: #1f75ff;
  color: #fff;
  margin-right: 10rpx;
}
.yzmDisable {
  background-color: #5d8dd9;
}
.info-tip{
  font-size: 24rpx;
  margin-top: 30rpx;
  color: #666;
}
</style>
