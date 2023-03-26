<template>
  <div class="relate">
    <template v-if="familyIds !== '0'">
      <div class="top">
        <img :src="IMG.zheng" alt="" mode="widthFix" />
        <span>他/她无手机或者不方便提交，可代其申请，请确保信息真实</span>
      </div>
      <div class="key"><span style="color: #ff0000">*</span>与你的关系</div>
      <div class="value">
        <picker
          class="picker"
          @change="bindPickerChange1"
          :value="index1"
          :range="relateList"
          :disabled="disabled1"
        >
          <view class="uni-input">{{ relateList[index1] }}</view>
        </picker>
      </div>
    </template>

    <div class="key"><span style="color: #ff0000">*</span>姓名</div>
    <input
      class="input"
      v-model="keyName"
      type="text"
      @blur="blurInput(keyName, 'name')"
      style="text-align: left; width: 67%"
      placeholder-style="color:#e6e6e6"
      placeholder="请输入姓名"
      :disabled="disabled2"
    />
    <div class="key"><span style="color: #ff0000">*</span>选择证件类型</div>
    <div class="value">
      <picker
        class="picker"
        @change="bindPickerChange2"
        :value="index2"
        :range="cardList"
        :disabled="disabled3"
      >
        <view class="uni-input">{{ cardList[index2] }}</view>
      </picker>
    </div>
    <div class="key"><span style="color: #ff0000">*</span>证件号码</div>
    <input
      class="input"
      v-model="cardId"
      type="text"
      @blur="blurInput(cardId, 'cardId')"
      style="text-align: left; width: 67%"
      placeholder-style="color:#e6e6e6"
      placeholder="请输入证件号"
      :disabled="disabled4"
      maxlength="18"
    />

    <div class="key">手机号码</div>
    <input
      class="input"
      v-model="phone"
      type="number"
      style="text-align: left; width: 67%"
      placeholder-style="color:#e6e6e6"
      placeholder="请输入手机号"
      :disabled="disabled5"
    />

    <div class="key"><span style="color: #ff0000">*</span>所在的街道</div>
    <div class="value">
      <picker
        class="picker"
        @change="bindPickerChange3"
        :value="streetIndex"
        :range="streetList"
        range-key="value"
      >
        <view class="uni-input">{{ streetList[streetIndex].value }}</view>
      </picker>
    </div>

    <div class="key"><span style="color: #ff0000">*</span>所在的社区</div>
    <div class="value">
      <picker
        class="picker"
        @change="bindPickerChange4"
        :value="componyIndex"
        :range="componyArray"
        range-key="value"
      >
        <view class="uni-input">{{ componyArray[componyIndex].value }}</view>
      </picker>
    </div>
    <template v-if="familyIds !== '0'">
      <div class="key"><span style="color: #ff0000">*</span>详细地址</div>
      <input
        class="input"
        v-model="address"
        type="text"
        style="text-align: left; width: 67%"
        placeholder-style="color:#e6e6e6"
        placeholder="请输入详细地址"
      />
    </template>

    <div class="key"><span style="color: #ff0000">*</span>健康信息</div>
    <div class="box">
      <span class="tit">最近14天是否一直在浙江省？</span>
      <radio-group class="radioGroup" :value="radio1" @change="onChange1">
        <radio class="radio" value="1">是</radio>
        <radio class="radio" value="2">否</radio>
      </radio-group>
    </div>

    <div class="box">
      <span class="tit">是否有发热、气促、呼吸道症状等异常健康状态？</span>
      <radio-group class="radioGroup" :value="radio2" @change="onChange2">
        <radio class="radio" value="1">是</radio>
        <radio class="radio" value="2">否</radio>
      </radio-group>
    </div>

    <div class="bottom">
      <div class="title"><span style="color: #ff0000">*</span>本人郑重承诺</div>
      <checkbox-group :value="result" @change="change3">
        <div class="flex">
          <checkbox value="1" id="box1"></checkbox>
          <label class="promiss" for="box1"
            >为疫情防控，本人确认已获取被代领人合法有效授权，同意将以上信息依法提交所在辖区疫情防控部门统筹管理。本人承诺未经被代领人同意，不会擅自使用及披露被代领人的健康码。如有违反，本人愿承担相应的法律责任。</label
          >
        </div>
        <div class="flex">
          <checkbox value="2" id="box2"></checkbox>
          <label class="promiss" for="box2"
            >上述信息已经被代领人本人确认核实，本人及被代领人对信息内容的真实性和完整性负责.如果信息有误或缺失，本人及被代领人愿承担相应的法律责任.同时，本人及被代领人保证遵守防疫管控的各项规定，配合并听从各项措施和要求。</label
          >
        </div>
      </checkbox-group>
    </div>

    <button class="btn" @click="toVerify">提交</button>

    <div class="dialog" v-if="showDialog">
      <div class="content">
        <div class="head">提交后不能修改，是否继续</div>
        <div class="line">
          <div class="le">姓名：</div>
          <div class="ri">{{ keyName }}</div>
        </div>
        <div class="line">
          <div class="le">证件类型：</div>
          <div class="ri">{{ cardList[index2] }}</div>
        </div>
        <div class="line">
          <div class="le">证件号码：</div>
          <div class="ri">{{ cardId }}</div>
        </div>
        <div class="line">
          <div class="le">手机号：</div>
          <div class="ri">{{ phone }}</div>
        </div>
        <div class="line">
          <div class="le">街道：</div>
          <div class="ri">{{ street }}</div>
        </div>
        <div class="line">
          <div class="le">社区：</div>
          <div class="ri">{{ componyText }}</div>
        </div>
        <div class="line" v-if="address">
          <div class="le">详细地址</div>
          <div class="ri">{{ address }}</div>
        </div>
        <div class="line">
          <div class="le">最近14天是否一直在浙江省？</div>
          <div class="ri">{{ radio1 == 1 ? "是" : "否" }}</div>
        </div>
        <div class="line">
          <div class="le">是否有发热、气促、呼吸道症状等异常健康状态？</div>
          <div class="ri">{{ radio2 == 1 ? "是" : "否" }}</div>
        </div>
        <div class="button">
          <div class="cancel" @click="cancel">取消</div>
          <div class="submit" @click="submit">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IMG, validator, cardList, cardListValue } from "@/utils/index";
export default {
  data() {
    return {
      IMG: IMG,
      relateList: ["请选择关系", "我的父母", "我的子女", "我的配偶", "其他"],
      cardList: cardList,
      cardListValue: cardListValue,
      index1: 0, // 关系
      index2: 0, // 证件类型
      keyName: "", // 姓名
      phone: "",
      cardId: "", //身份政
      cardIdType: "IDENTITY_CARD", // 证件类型，默认身份证
      radio1: "",
      radio2: "",
      result: [],
      showDialog: false,
      address: "",
      familyIds: "",
      familyAgentList: [],
      ids: null,
      disabled1: false,
      disabled2: false,
      disabled3: false,
      disabled4: false,
      disabled5: false,
      nameT: "",
      cardT: "",
      streetList: [
        {
          value: "请选择街道",
        },
      ],
      streetIndex: 0,
      street: {},
      componyArray: [
        {
          value: "请先选择街道",
        },
      ],
      componyIndex: 0,
      componyText: "",
    };
  },
  onLoad(options) {
    this.$apipost({
      url: "/custom/address/tree",
    })
      .then((res) => {
        if (res.code === 200) {
          this.streetList.push(...res.data);
        }
      })
      .catch(() => {
        wx.showToast({
          title: "获取街道数据失败",
          icon: "none",
          duration: 1500,
        });
      });
    // 从重新修改而来
    if (Reflect.has(options, "edit")) {
      this.familyIds = this.$store.state.familyIds;
      if (this.familyIds !== "0") {
        this.familyAgentList = this.$store.state.familyAgentList;
        const tempIndex = this.familyAgentList.findIndex(
          (ele) => ele.ids === this.familyIds
        );
        if (tempIndex !== -1) {
          this.index1 = Number(this.familyAgentList[tempIndex].guanxi) - 5;
          this.nameT = this.familyAgentList[tempIndex].name;
          this.phone = this.familyAgentList[tempIndex].mobile;
          this.cardIdType = this.familyAgentList[tempIndex].id_card_type;

          this.cardT = this.familyAgentList[tempIndex].id_card;
          this.ids = this.familyAgentList[tempIndex].ids;
        }
      } else {
        this.nameT = this.$store.state.userName;
        this.phone = this.$store.state.userPhone;
        this.cardIdType = this.$store.state.userIdCardType;
        this.cardT = this.$store.state.idCard;
        this.ids = this.$store.state.userIdCardType;
        this.disabled5 = true;
      }
      const index = this.cardListValue.findIndex(
        (ele) => ele.ids === this.cardIdType
      );
      if (index !== -1) {
        this.index2 = index;
      } else {
        this.index2 = 0;
      }
      this.keyName = this.hideName(this.nameT);
      this.cardId = this.hideIdcard(this.cardT);
      this.disabled1 = true;
      this.disabled2 = true;
      this.disabled3 = true;
      this.disabled4 = true;
    }
  },
  methods: {
    bindPickerChange1(e) {
      // console.log("picker1", e.detail.value);
      this.index1 = e.detail.value;
    },
    bindPickerChange2(e) {
      // console.log("picker2", e);
      this.index2 = e.detail.value;
      this.cardIdType = this.cardListValue[this.index2];
    },
    bindPickerChange3(e) {
      this.streetIndex = e.detail.value;
      this.componyIndex = 0;
      this.street = this.streetList[e.detail.value].value;

      if (this.streetIndex !== "0") {
        this.$apipost({
          url: "/custom/address/tree",
          data: {
            key: 2,
            value: this.streetList[e.detail.value].code,
          },
        })
          .then((res) => {
            console.log(res);
            if (res.code === 200) {
              this.componyArray = res.data;
              this.componyText = this.componyArray[this.componyIndex].value;
            }
          })
          .catch(() => {
            wx.showToast({
              title: "获取社区数据失败",
              icon: "none",
              duration: 1500,
            });
          });
      }
    },
    bindPickerChange4(e) {
      this.componyIndex = e.detail.value;
      this.componyText = this.componyArray[this.componyIndex].value;
    },
    onChange1(event) {
      this.radio1 = event.detail.value;
    },
    onChange2(event) {
      //   console.log(event.detail)
      this.radio2 = event.detail.value;
    },
    change3(e) {
      this.result = e.target.value;
    },
    /**
     * 离开输入框校验
     * @param value {string} 需要校验的值
     * @param type {string} 数据类型
     */
    blurInput(value, type) {
      let msg = "";
      switch (type) {
        case "cardId":
          if (this.index2 == 0) {
            // 身份证校验
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
    toVerify() {
      if (this.index1 == 0 && this.familyIds !== "0") {
        wx.showToast({
          title: "请选择关系",
          icon: "none",
          duration: 1500,
        });
        return;
      }
      if (this.keyName.trim() === "") {
        wx.showToast({
          title: "请输入姓名",
          icon: "none",
          duration: 1500,
        });
        return;
      }
      if (!this.disabled4 && !this.cardId) {
        if (this.index2 == 0 && !validator(this.cardId.toString())) {
          wx.showToast({
            title: "请输入正确的身份证号",
            icon: "none",
            duration: 1500,
          });
        } else {
          wx.showToast({
            title: "请输入正确的证件号码",
            icon: "none",
            duration: 1500,
          });
        }
        return;
      }
      if (this.streetIndex == 0) {
        wx.showToast({
          title: "请选择街道",
          icon: "none",
          duration: 1500,
        });
        return;
      }
      if (this.address.trim() == "" && this.familyIds !== "0") {
        wx.showToast({
          title: "请填写详细地址",
          icon: "none",
          duration: 1500,
        });
        return;
      }
      if (this.radio1 == "" || this.radio2 == "") {
        wx.showToast({
          title: "请选择健康信息",
          icon: "none",
          duration: 1500,
        });
        return;
      }
      if (this.result.length !== 2) {
        wx.showToast({
          title: "请勾选承诺",
          icon: "none",
          duration: 1500,
        });
        return;
      }
      this.showDialog = true;
    },
    cancel() {
      this.showDialog = false;
    },
    submit() {
      if (this.familyIds !== "0") {
        this.daiSubmit();
      } else {
        // 本人的修改
        uni.showLoading({
          title: "提交中",
          mask: true,
        });
        const data = {
          name: this.nameT,
          id_card: this.cardT,
          id_card_type: this.cardIdType,
          mobile: this.phone,
          street: this.street,
          compony: this.componyText,
        };
        console.log(data, "本人修改");
        this.$apipost({
          url: "/custom/update/self/info",
          data,
        })
          .then((res) => {
            uni.hideLoading();
            if (res.code === 200) {
              wx.navigateTo({
                url: `/pages/index/index`,
              });
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
              title: "请求出错，请重试",
              icon: "none",
              duration: 1500,
            });
          });
      }
    },
    // 代领人的提交和修改
    daiSubmit() {
      uni.showLoading({
        title: "提交中",
        mask: true,
      });
      const data = {
        id_card_type: this.cardIdType,
        relation_mobile: this.phone,
        relation_is_zhejiang: this.radio1,
        relation_is_abnormal: this.radio2,
        relation_type: Number(this.index1) + 5,
        street: this.street,
        compony: this.componyText,
        relation_address: this.address,
      };
      if (this.nameT) {
        Object.assign(data, { relation_name: this.nameT });
      } else {
        Object.assign(data, { relation_name: this.keyName });
      }
      if (this.cardT) {
        Object.assign(data, { card_num: this.cardT });
      } else {
        Object.assign(data, { card_num: this.cardId });
      }
      if (this.ids) {
        Object.assign(data, { ids: this.ids });
      }
      this.$apipost({
        url: "/custom/acting/dai/data",
        data,
      })
        .then((res) => {
          if (res.code == 200) {
            this.$store.commit("SET_FAMILY_IDS", res.data.ids);
            const familyAgentList = this.$store.state.familyAgentList;
            const tempIndex = familyAgentList.findIndex(
              (ele) => ele.ids === res.data.ids
            );
            if (tempIndex !== -1) {
              familyAgentList[tempIndex] = res.data;
            } else {
              familyAgentList.push(res.data);
            }
            this.$store.commit("SET_FAMILY_ANGET_LIST", familyAgentList);
            uni.hideLoading();
            wx.navigateTo({
              url: `/pages/index/index?idcard=${res.data.id_card}&name=${res.data.name}`,
            });
          } else {
            this.showDialog = false;
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
            title: "请求出错，请重试",
            icon: "none",
            duration: 1500,
          });
        });
    },
    // 身份证号码脱敏
    hideIdcard(newVal) {
      const idArr = newVal.split("");
      return (
        idArr[0] +
        idArr[1] +
        idArr[2] +
        idArr[3] +
        "**********" +
        idArr[idArr.length - 4] +
        idArr[idArr.length - 3] +
        idArr[idArr.length - 2] +
        idArr[idArr.length - 1]
      );
    },
    // 姓名脱敏
    hideName(newVal) {
      const nameArr = newVal.split("");
      const len = nameArr.length;
      let disName = "";
      if (len === 0) {
        disName = "未认证";
      } else if (len === 2) {
        disName = "*" + nameArr[1];
      } else if (len >= 3) {
        let star = "";
        for (let i = 0; i < len - 2; i++) {
          star += "*";
        }
        disName = nameArr[0] + star + nameArr[len - 1];
      }
      return disName;
    },
  },
};
</script>

<style scoped lang="less">
.relate {
  width: 100%;
  height: 100%;
  padding-bottom: 50px;
  .top {
    padding: 30px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 18px;
    line-height: 24px;
    color: #000;
    img {
      width: 55px;
      height: 45px;
      margin-right: 24px;
    }
  }
}
.key {
  background: #f6f6f6;
  padding: 12px;
  color: #333;
  font-size: 13px;
}
.value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 12px;
    height: 20px;
  }
}
.picker,
.input {
  line-height: 30px;
  padding: 12px;
  width: 100%;
}
.box {
  padding: 12px;
  border-bottom: 2px solid #f6f6f6;
  border-top: 2px solid #f6f6f6;
  font-size: 18px;
  .radioGroup {
    margin-top: 12px;
    .radio {
      margin-right: 20px;
    }
  }
}
.bottom {
  border-top: 5px solid #f6f6f6;
  padding: 12px;
  .title {
    font-size: 17px;
    margin-bottom: 10px;
  }
  .promiss {
    color: #333;
    line-height: 27px;
  }
  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 2px solid #f6f6f6;
    margin-bottom: 10px;
  }
}
.btn {
  width: 90%;
  height: 50px;
  background: #1d77f9;
  border-radius: 10px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #ffffff;
}
.dialog {
  background: rgba(152, 151, 151, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  .content {
    background: #fff;
    padding: 12px;
    width: 70%;
    .head {
      color: #242424;
      font-size: 18px;
      margin-bottom: 12px;
    }
    .line {
      display: flex;
      font-size: 16px;
      justify-content: space-between;
      line-height: 30px;
      color: 000;
      flex-wrap: wrap;
      .le {
        color: #0b0b0b;
      }
    }
  }
  .button {
    display: flex;
    margin-top: 10px;
    > div {
      width: 50%;
      border: none;
      text-align: center;
      font-size: 18px;
    }
    .cancel {
      color: #8d8d8d;
    }
    .submit {
      color: #0c78cf;
    }
  }
}
</style>
