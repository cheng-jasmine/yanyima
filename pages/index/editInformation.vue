<template>
  <view class="edit-information">
    <div class="cell-item">
      <div class="cell-item-title">您的姓名</div>
      <input
        class="cell-item-input"
        align="right"
        v-model="form.username"
        placeholder="请输入姓名"
        @blur="blurInput(form.username, 'name')"
      />
    </div>
    <div class="cell-item">
      <div class="cell-item-title">身份证号码</div>
      <input
        class="cell-item-input"
        align="right"
        type="idcard"
        v-model="form.idcard"
        placeholder="请输入身份证号"
        @blur="blurInput(form.idcard, 'id')"
      />
    </div>
    <div class="cell-item">
      <div class="cell-item-title">手机号</div>
      <input
        class="cell-item-input"
        align="right"
        type="phone"
        readonly
        disabled
        v-model="form.phone"
      />
    </div>
    <button class="submit-btn" @click="updateInfo" :disabled="loading">
      保存
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 用于展示的用户信息
      form: {
        username: '',
        idcard: '',
        phone: '',
      },
      // 用于提交的用户信息
      submitValue: {
        username: '',
        idcard: '',
        phone: '',
      },
      changed: false,
      loading: false,
    }
  },
  watch: {
    'form.username'(newVal, oldVal) {
      console.log(newVal, oldVal, 'form.username')
      if (newVal !== oldVal && oldVal !== '') {
        this.submitValue.username = newVal
      }
    },
    'form.idcard'(newVal, oldVal) {
      if (newVal !== oldVal && oldVal !== '') {
        this.changed = true
        this.submitValue.idcard = newVal
      }
    },
    'form.phone'(newVal, oldVal) {
      if (newVal !== oldVal && oldVal !== '') {
        this.submitValue.phone = newVal
      }
    },
  },
  onLoad(options) {
    console.log(options)
    if (Reflect.has(options, 'name')) {
      this.submitValue.username = options.name
      this.form.username = options.name
    }
    if (Reflect.has(options, 'idcard')) {
      this.submitValue.idcard = options.idcard
      this.form.idcard = options.idcard
    }
    if (Reflect.has(options, 'phone')) {
      this.submitValue.phone = options.phone
      this.form.phone = options.phone
    }
  },
  methods: {
    // 手机号脱敏
    hidePhone(newVal) {
      const phoneArr = newVal.split('')
      return (
        phoneArr[0] +
        phoneArr[1] +
        phoneArr[2] +
        '****' +
        phoneArr[7] +
        phoneArr[8] +
        phoneArr[9] +
        phoneArr[10]
      )
    },
    // 身份证号码脱敏
    hideIdcard(newVal) {
      const idArr = newVal.split('')
      return (
        idArr[0] +
        idArr[1] +
        idArr[2] +
        idArr[3] +
        '**********' +
        idArr[idArr.length - 4] +
        idArr[idArr.length - 3] +
        idArr[idArr.length - 2] +
        idArr[idArr.length - 1]
      )
    },
    // 姓名脱敏
    hideName(newVal) {
      const nameArr = newVal.split('')
      const len = nameArr.length
      let disName = ''
      if (len === 0) {
        disName = '未认证'
      } else if (len === 2) {
        disName = '*' + nameArr[1]
      } else if (len >= 3) {
        let star = ''
        for (let i = 0; i < len - 2; i++) {
          star += '*'
        }
        disName = nameArr[0] + star + nameArr[len - 1]
      }
      return disName
    },
    // 失焦校验
    blurInput(value, type) {
      let msg = ''
      switch (type) {
        case 'id':
          msg = this.changed
            ? /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
              ? ''
              : '身份证格式有误'
            : ''
          break
        case 'name':
          msg = value === '' ? '姓名不能为空' : ''
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
    // 校验提交的信息
    checkSubmit() {
      console.log(this.form, 'checkSubmit')
      if (this.form.username === '') {
        wx.showToast({
          title: '姓名不能为空',
          icon: 'none',
          duration: 1000,
        })
        return
      }
      if (
        !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(
          this.form.idcard
        )
      ) {
        wx.showToast({
          title: '身份证格式有误',
          icon: 'none',
          duration: 1000,
        })
        console.log('error idcard')
        return
      }
    },
    // 更新信息
    updateInfo() {
      console.log('更新信息');
      const that = this
      // this.checkSubmit()
      if (this.form.username === '') {
        wx.showToast({
          title: '姓名不能为空',
          icon: 'none',
          duration: 1000,
        })
        return
      }
      if (
        !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(
          this.form.idcard
        )
      ) {
        wx.showToast({
          title: '身份证格式有误',
          icon: 'none',
          duration: 1000,
        })
        console.log('error idcard')
        return
      }
      that.loading = true
      console.log(this.form, 'update')
      this.$apipost({
        url: '/manager/user/info/update',
        data: {
          name: that.form.username,
          phone: that.form.phone,
          id_card: that.form.idcard,
        },
      }).then((res) => {
        that.loading = false
        if (res.code === 0) {
          uni.showToast({
            title: '更新成功',
            icon: 'success',
            duration: 2000,
          })
          setTimeout(() => {
            uni.redirectTo({
              url: '/pages/index/index',
            })
          }, 1500)
        } else {
          uni.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000,
          })
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.edit-information {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  padding: 20rpx;
  box-sizing: border-box;
  background-color: #ffffff;
  width: 100%;
  align-content: center;
  .cell-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    box-sizing: border-box;
    padding: 20rpx 32rpx;
    &-title {
      width: 100%;
      font-size: 32rpx;
      margin-bottom: 10rpx;
      color: #999999;
    }
    &-input {
      width: 100%;
      font-size: 32rpx;
      text-align: left;
      color: #333333;
      padding-bottom: 10rpx;
      border-bottom: 1px solid #eeeeee;
    }
  }
  .submit-btn {
    width: 100%;
    background: #1676fe;
    color: #ffffff;
  }
}
</style>
