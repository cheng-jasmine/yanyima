<template>
  <div class="apply" id="apply">
    <!-- 身份信息 -->
    <div class="infos">
      <div class="tit">添加人信息</div>
      <div class="cell">
        <div class="cell-item">
          <div class="cell-item-title">姓名</div>
          <input
            class="cell-item-input"
            align="right"
            v-model="form.username"
            readonly
            disabled
            placeholder="请输入姓名"
            @blur="blurInput(form.username, 'name')"
          />
        </div>
        <div class="cell-item">
          <div class="cell-item-title">手机号</div>
          <input
            class="cell-item-input"
            align="right"
            v-model="form.phone"
            placeholder="请输入手机号"
            @blur="blurInput(form.phone, 'phone')"
          />
        </div>
        <div class="cell-item">
          <div class="cell-item-title">身份证号</div>
          <input
            class="cell-item-input"
            align="right"
            type="idcard"
            readonly
            disabled
            :value="idcardValue"
            placeholder="请输入身份证号"
            @blur="blurInput(form.idcard, 'id')"
          />
        </div>
      </div>
    </div>

    <!-- 场所信息 -->
    <div class="changsuo">
      <div class="tit">场所信息</div>
      <div class="froms">
        <div class="fileds">
          <div class="su">1.场所名称</div>
          <div class="do">
            <input type="text" placeholder="请输入" v-model="form2.names" />
            <div class="txts"></div>
          </div>
        </div>
        <div class="fileds">
          <div class="su">2.场所类型</div>
          <div class="do" @click="showPicker = true">
            <input
              type="text"
              placeholder="请选择场所类型"
              v-model="form2.value1"
              disabled
            />
            <div class="txts">选择</div>
          </div>
          <van-popup :show="showPicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="types"
              @confirm="onConfirm"
              @cancel="showPicker = false"
            />
          </van-popup>
        </div>
        <div class="fileds">
          <div class="su">3.所属街道</div>
          <div class="do">
            <input
              type="text"
              placeholder="街道"
              v-model="form2.value2"
              disabled
            />
            <div class="txts" @click="showStreet = true">选择</div>
          </div>
          <van-popup :show="showStreet" position="bottom">
            <van-picker
              show-toolbar
              :columns="street"
              @confirm="cancels"
              @cancel="showStreet = false"
            />
          </van-popup>
        </div>
        <div class="fileds">
          <div class="su">4.详细地址</div>
          <div class="do">
            <input
              type="text"
              placeholder="省/市/区"
              disabled
              v-model="form2.address"
            />
            <div class="txts" @click="gotomaps">定位</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 承诺 -->
    <div class="nuo">
      <div class="nuo_tit">本人承诺</div>
      <div class="radios">
        <div :class="radio == 1 ? 'l' : 'lbgc'" @click="changeRadio">
          <van-icon name="success" v-if="radio == 2" />
        </div>
        <div class="r">
          本人对场所信息内容的真实性和完整性负责。如果场所信息有误或缺失，本人愿承担相应的法律责任。
        </div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="tijiao" @click="submit">
      <div class="btns" :class="buttons == 2 ? 'btnbgc' : ''">提交</div>
    </div>
  </div>
</template>

<script>
import { types, street } from '../../utils/index'
export default {
  data() {
    return {
      // 用户信息
      form: {
        username: '',
        phone: '',
        idcard: '',
      },
      // 用户信息
      form2: {
        names: '', // 场所名称
        value1: '', // 场所类型
        valueid1: '', //场所类型index
        value2: '', // 所属街道
        lat: '',
        long: '',
        address: '',
      },
      radio: '1',
      types: types,
      street: street,
      showPicker: false,
      showStreet: false,
      buttons: 1, // 提交按钮背景颜色 1不显示  2显示
    }
  },
  computed: {
    idcardValue() {
      return (
        this.form.idcard.substring(0, 2) +
        '**************' +
        this.form.idcard.substring(
          this.form.idcard.length - 2,
          this.form.idcard.length
        )
      )
    },
  },
  onLoad() {
    this.$set(this.form, 'username', this.$store.state.userName)
    this.$set(this.form, 'phone', this.$store.state.userPhone)
    this.$set(this.form, 'idcard', this.$store.state.idCard)
  },
  methods: {
    blurInput(value, type) {
      let msg = ''
      switch (type) {
        case 'id':
          msg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
            ? ''
            : '身份证格式有误'
          break
        case 'name':
          msg = value === '' ? '姓名不能为空' : ''
          break
        case 'phone':
          msg = /^1[3-9]\d{9}$/.test(value) ? '' : '手机号格式错误'
          break
        default:
          break
      }
      if (msg) {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 1000,
        })
      }
    },
    // 选择器--场所类型
    onConfirm(value) {
      console.log(value, '场所类型')
      this.form2.value1 = value.target.value
      this.form2.valueid1 = value.target.index
      this.showPicker = false
    },
    // 选择器--所属街道
    cancels(value) {
      console.log(value, '所属街道')
      this.form2.value2 = value.target.value
      // console.log(this.value2, 'value2');
      this.showStreet = false
    },
    // 选择器--定位
    gotomaps() {
      const that = this
      wx.getSetting({
        success(res) {
          console.log(res.authSetting, 'auth')
          // 已授权定位
          if (res.authSetting['scope.userLocation']) {
            that.getWxLocation()
          } else {
            // 未授权定位
            wx.authorize({
              scope: 'scope.userLocation',
              success() {
                console.log('authorize')
                that.getWxLocation()
              },
            })
          }
        },
      })
    },
    getWxLocation() {
      const that = this
      wx.chooseLocation({
        success(res) {
          console.log(res, 'ress')
          if (res.errMsg === 'chooseLocation:ok') {
            that.form2.address = res.address
            that.form2.lat = res.latitude
            that.form2.long = res.longitude
            that.$forceUpdate()
          } else {
            wx.showToast({
              title: '未获取到定位信息',
              icon: 'none',
              mask: true,
              duration: 1500,
            })
          }
        },
        fail(err) {
          console.log(err, 'chooselocation')
        },
      })
    },
    // 切换radio
    changeRadio() {
      const that = this
      if (that.radio == 1) {
        if (that.form.username == '') {
          wx.showToast({
            title: '姓名有误',
            duration: 1500,
            icon: 'none',
            mask: true,
          })
        } else if (that.form.phone == '') {
          wx.showToast({
            title: '请填写手机号',
            duration: 1500,
            icon: 'none',
            mask: true,
          })
        } else if (that.form.idcard == '') {
          wx.showToast({
            title: '身份证号有误',
            duration: 1500,
            icon: 'none',
            mask: true,
          })
        } else if (that.form2.names == '') {
          wx.showToast({
            title: '请填写场所名称',
            duration: 1500,
            icon: 'none',
            mask: true,
          })
        } else if (that.form2.value1 == '') {
          wx.showToast({
            title: '请选择场所类型',
            duration: 1500,
            icon: 'none',
            mask: true,
          })
        } else if (that.form2.value2 == '') {
          wx.showToast({
            title: '请选择所属街道',
            duration: 1500,
            icon: 'none',
            mask: true,
          })
        } else if (that.form2.address == '') {
          wx.showToast({
            title: '请选择你的所在位置',
            duration: 1500,
            icon: 'none',
            mask: true,
          })
        } else {
          that.radio = 2
          that.buttons = 2
        }
        console.log(that.radio, 'up')
      } else if (that.radio == 2) {
        that.radio = 1
        that.buttons = 1
        console.log(that.radio, 'down')
      }
    },
    // 提交按钮
    submit() {
      const that = this
      if (!this.form.phone) {
        wx.showToast({
          title: '请填写手机号',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
      } else if (!this.form2.names) {
        wx.showToast({
          title: '请填写场所名称',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
      } else if (this.radio == 1) {
        wx.showToast({
          title: '请勾选本人承诺',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '提交后内容无法修改，请确认填写内容是否正确',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.showLoading({
                title: '提交中',
                mask: true,
              })
              that
                .$apipost({
                  url: '/custom/device/add',
                  data: {
                    qy_name: that.form2.names,
                    shop_name: that.form2.names,
                    shop_type: that.form2.valueid1 + 1,
                    street: that.form2.value2,
                    address: that.form2.address,
                    lon: that.form2.long,
                    lat: that.form2.lat,
                    phone: that.form.phone,
                    is_cs: 2,
                  },
                })
                .then((res) => {
                  console.log(res, 'ressssssss')
                  if (res.code === 1) {
                    wx.showToast({
                      title: '该场所名称已存在，请修改后再提交',
                      icon: 'error',
                      duration: 1500,
                      mask: true,
                    })
                    wx.hideLoading()
                  } else if (res.code === 0) {
                    wx.redirectTo({
                      url: '/pages/venueCode/venueCode',
                    })
                  }
                })
                .catch((err) => {
                  console.log(err, '接口err：/custom/device/add')
                })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          },
        })
      }
    },
    // 身份证打马
    filterIdcard(value) {
      let dealValue = ''
      let firstVal = value.subString(0, 2)
      console.log(firstVal)

      dealValue += firstVal
      return dealValue
    },
  },
}
</script>

<style lang="less" scoped>
.apply {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  box-sizing: border-box;
  padding-bottom: 30rpx !important;
  .tit {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    padding: 20rpx 0 20px 32rpx;
    box-sizing: border-box;
  }
  .froms {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
    .fileds {
      margin-bottom: 15px;
      .su {
        margin-bottom: 5px;
      }
      .do {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > input {
          width: 80%;
          background-color: #fff;
          border: none;
          color: #333;
          /* -webkit-appearance:none; */
        }
      }
    }
  }
}

input[disabled]::placeholder {
  -webkit-text-fill-color: darkgray;
  /* opacity:1 */
}

input[disabled] {
  -webkit-text-fill-color: #333;
  opacity: 1;
}

.do > .txts {
  width: 20%;
  color: #6364a5;
  font-size: 18px;
  text-align: right;
}
.nuo {
  padding: 0 16px;
  box-sizing: border-box;
}
.nuo_tit {
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}

.radios {
  color: #999;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.radios > .l {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ddd;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radios > .r {
  width: 95%;
}

.radios > .lbgc {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ddd;
  margin-right: 10px;
  background-color: #2e8ef6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
}

.tijiao {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
}

.btns {
  width: 90%;
  padding: 14px 0;
  box-sizing: border-box;
  background-color: #d7ddf5;
  color: #fff;
  text-align: center;
  border-radius: 5px;
}

.btnbgc {
  background-color: #467de1;
}

.van-cell {
  font-size: 16px !important;
  padding: 5px 16px;
}

.van-field__error-message {
  text-align: right;
}

.cell {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  &-item {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    box-sizing: border-box;
    padding: 20rpx 32rpx;
    &-title {
      font-size: 32rpx;
      margin-right: 10rpx;
    }
    &-input {
      font-size: 32rpx;
      flex: 1;
      text-align: right;
    }
  }
}
</style>
