<script>
export default {
  onLaunch(option) {
    console.log(option, 'App onLaunch')
    this.autoUpdate()
  },
  onShow(option) {
    console.log(option, 'App onShow')
    if (option.scene === 1038) {
      // 从小程序返回
      this.getCityVerifyCode(option)
    }
    //  else if (option.scene === 1047) {
    //   // 扫描小程序码
    // } else {
    //   // 给予提示
    //   this.$store.commit('SET_SCAN_STATE',false)
    // }
  },
  methods: {
    /** 获取城市服务验证授权code(只能在app.onshow中调用) **/
    getCityVerifyCode(options) {
      console.log(options, 'options')
      const that = this
      // 获取城市服务验证授权code
      if ('appId' in options.referrerInfo) {
        if (options.referrerInfo.appId === 'wx308bd2aeb83d3345') {
          try {
            that.verifyAuthCode =
              options.referrerInfo.extraData.code.auth_code || ''

            // 获取当前打开过的页面路由数组
            let routes = getCurrentPages()
            let curPage = routes[routes.length - 1]
            // 判断发起校验的页面与当前页面是否一致
            if (options.path === curPage.route) {
              console.log('****************')
              console.log(curPage, 'curPage')
              curPage.data.requestSeverToVerify.call(
                curPage.$vm,
                that.verifyAuthCode
              )
            }
          } catch (e) {
            that.verifyAuthCode = ''
            console.log('App Show error：', e)
          }
        } else {
          const obj = options.referrerInfo.extraData
          if (obj instanceof Object) {
            wx.setStorageSync('extraData', JSON.stringify(obj))
          }
        }
      } else {
        that.verifyAuthCode = ''
      }
    },
    /**更新提示 */
    autoUpdate: function () {
      let self = this
      // 获取小程序更新机制兼容
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        //1. 检查小程序是否有新版本发布
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            //检测到新版本，需要更新，给出提示
            wx.showModal({
              title: '更新提示',
              // content: '检测到新版本，是否下载新版本并重启小程序？',
              content: "当前版本过低，请下载新版本并重启小程序",
              showCancel: false, //隐藏取消按钮
              success: function (res) {
                if (res.confirm) {
                  //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                  self.downLoadAndUpdate(updateManager)
                } else if (res.cancel) {
                  //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                  wx.showModal({
                    title: '温馨提示~',
                    content:
                      '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                    showCancel: false, //隐藏取消按钮
                    confirmText: '确定更新', //只保留确定更新按钮
                    success: function (res) {
                      if (res.confirm) {
                        //下载新版本，并重新应用
                        self.downLoadAndUpdate(updateManager)
                      }
                    },
                  })
                }
              },
            })
          }
        })
      } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        wx.showModal({
          title: '提示',
          content:
            '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        })
      }
    },
    /*下载小程序新版本并重启应用*/
    downLoadAndUpdate: function (updateManager) {
      let self = this
      wx.showLoading({
        title: '加载中...',
      })
      //静默下载更新小程序新版本
      updateManager.onUpdateReady(function () {
        wx.hideLoading()
        //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      })
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: '已经有新版本了哟~',
          content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
        })
      })
    },
  },
}
</script>
