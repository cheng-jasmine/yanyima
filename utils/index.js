export const baseUrl = 'https://changsuoma.haiyan.gov.cn'
// https://hy.morelinker.com    测试域名
// https://changsuoma.haiyan.gov.cn  正式域名

// export const IMGUrl = `${baseUrl}/img`
// {baseUrl}/img
export const IMG = {
  icon1: require('../static/img/index/icon1.png'),
  icon2: require('../static/img/index/icon2.png'),
  icon3: require('../static/img/index/icon3.png'),
  icon4: require('../static/img/index/icon4.png'),
  icon5: require('../static/img/index/icon5.png'),
  icon6: require('../static/img/index/icon6.png'),
  icon7: require('../static/img/index/icon7.png'),
  icon8: require('../static/img/index/icon8.png'),
  icon9: require('../static/img/index/icon9.png'),
  icon10: require('../static/img/index/icon10.png'),
  icon11: require('../static/img/index/icon11.png'),
  code1: require('../static/img/code_green.png'),
  code2: require('../static/img/code_yellow.png'),
  code3: require('../static/img/code_red.png'),
  close1: require('../static/img/close1.png'),
  epidemic1: require('../static/img/epidemic1.png'),
  epidemic2: require('../static/img/epidemic2.png'),

  // 中间的接种后的qrcode
  qrcode: [
    require('../static/img/jie_green.png'),
    require('../static/img/jie_yellow.png'),
    require('../static/img/jie_red.png'),
  ],
  banner: require('../static/img/banner@3x.png'),
  tripCard: require('../static/img/xingchengma.png'),
  noEye: require('../static/img/no_eye.png'),
  eye: require('../static/img/eye.png'),
  topBanner: require('../static/img/top_banner.png'),
  topBanner1: require('../static/img/top_banner1.png'),
  logo: require('../static/img/logo.png'),
  info: require('../static/img/info.png'),
  backgroundImg: require('../static/img/verify_background.jpg'),
  cname: require('../static/img/cname.png'),
  idcard: require('../static/img/idcard.png'),
  yzm: require('../static/img/yzm.png'),
  card: require('../static/img/card.png'),
  close: require('../static/img/close.png'),
  noCode: require('../static/img/no_code.png'),
  leftIcon: require('../static/img/left.png'),
  rightIcon: require('../static/img/right.png'),
  downloadIcon: require('../static/img/downloads.png'),
  delsIcon: require('../static/img/dels.png'),
  bgcwhite: require('../static/img/bgcwhite.png'),
  information: require('../static/img/information.png'),
  watermarker: require('../static/img/watermarker.png'),
  rightIcon: require('../static/img/right_icon.png'),
  address: require('../static/img/address.png'),
  phone: require('../static/img/phone.png'),
  time: require('../static/img/time.png'),
  index: require('../static/img/index_css_sprites.png'), // 首页icon雪碧图
  iconPath: require('../static/img/local.png'),
  list1: require('../static/img/list1.png'),
  list2: require('../static/img/list2.png'),
  // icon1: require('../static/img/icon1.png'),
  // icon2: require('../static/img/icon2.png'),
  // icon3: require('../static/img/icon3.png'),
  zheng: require('../static/img/zheng.png'),
  right2: require('../static/img/right2.png'),
  banner1: require('../static/img/banner.png'),
  banner2: require('../static/img/banner2.png'),

  change: require('../static/img/change.png'),
  top: require('../static/img/top.png'),
  down: require('../static/img/down.png'),
  right3: require('../static/img/right3.png'),
  changeTab1: require('../static/img/changeTab1.png'),
  changeTab2: require('../static/img/changeTab2.png'),
  tit1: require('../static/img/tit1.png'),
  tit2: require('../static/img/tit2.png'),
  addrss: require('../static/img/addrss.png'),
  scan1: require('../static/img/scan1.png'),
  scan2: require('../static/img/scan2.png'),
  tip: require('../static/img/tip.png'),
  rightW: require('../static/img/rightW.png'),
  yimiao: require('../static/img/yimiao.png'),
  tipImg: require('../static/img/tip_img.png'),
  monitorTip: require('../static/img/monitor_tip.png'),
  bg: require('../static/img/bg.png')
}

export const types = [
  '村（小区）',
  '商场超市',
  '菜场',
  '政府机关',
  '车站/码头/机场',
  '机关事业单位',
  '银行/证券公司',
  '医院/药店',
  '住宿餐饮',
  '景区/公园/广场',
  '企业/工地',
  '娱乐场所',
  '其他',
]

export const street = [
  '武原街道',
  '西塘桥街道',
  '望海街道',
  '秦山街道',
  '沈荡镇',
  '百步镇',
  '于城镇',
  '澉浦镇',
  '通元镇',
  '其他区域',
]
export const cardList = [
  "身份证",
  "护照",
  "回乡证",
  "台湾居民来往内地通行证",
  "台湾居民居住证",
  "港澳当地身份证",
  "港澳居民来往内地通行证",
  "港澳居民居住证",
]
export const cardListValue = [
  "IDENTITY_CARD",
  "PASSPORT",
  "BACK_HOMETOWN_CARD",
  "HOME_VISIT_PERMIT_TAIWAN",
  "RESIDENCE_PERMIT_TAIWAN",
  "HK_MC_CARD",
  "HOME_VISIT_PERMIT_HK_MC",
  "RESIDENCE_PERMIT_HK_MC",
]
/**
 * 格式化时间
 * @param {*} date
 * @param {*} fmt
 * @returns
 */
export function formatTime(date, fmt) {
  let ret
  if (isNaN(date) && !isNaN(Date.parse(date))) {
    // console.log(date, 'data是日期格式！')
    date = new Date(Date.parse(date))
  }
  let YY = ''
  let mm = ''
  let dd = ''
  let HH = ''
  let MM = ''
  let SS = ''
  try {
    YY = date.getFullYear().toString()
    mm = (date.getMonth() + 1).toString()
    dd = date.getDate().toString()
    HH = date.getHours().toString()
    MM = date.getMinutes().toString()
    SS = date.getSeconds().toString()
  } catch (e) {
    console.log(e, 'dateformat')
  }

  const opt = {
    'Y+': YY, // 年
    'm+': mm, // 月
    'd+': dd, // 日
    'H+': HH, // 时
    'M+': MM, // 分
    'S+': SS, // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
      )
    }
  }
  return fmt
}

// 获取当前运行所在环境（安卓/ios/windows等）
export function clientPlatform() {
  let tempPlatform = ''
  try {
    const res = wx.getSystemInfoSync()
    /*console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)*/

    tempPlatform = res.platform

    try {
      /*console.log(res.SDKVersion)*/
    } catch (e) {
      // Do something when catch error
    }
  } catch (e) {
    // Do something when catch error
  }
  return tempPlatform
}

export function isProperPhone(phone, isNotice = true) {
  var reg = /^1[3-9]\d{9}$/
  if (!reg.test(phone)) {
    // 手机号有误
    if (isNotice) {
      wx.showToast({
        title: '手机号有误，请重新填写',
        icon: 'none',
        mask: true,
        duration: 1000,
      })
    }
    return false
  }
  return true
}

/* 上传图片 */
export function uploadImage(srcArg) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: baseUrl + '/form/temp/update/ajax/img',
      filePath: srcArg,
      header: {
        Cookie: wx.getStorageSync('Cook') || '',
        'content-type': 'application/x-www-form-urlencoded',
        appid: wx.getAccountInfoSync().miniProgram.appId,
      },
      name: String(1),
      formData: {
        type: 'image',
      },
      success: function (res) {
        if (res.data.length > 0) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function (res) {
        // console.log('上传图片失败：',res)
        reject(res)
      },
    })
  })
}

const fsm = wx.getFileSystemManager()
const FILE_BASE_NAME = 'tmp_base64src'

export function base64src(base64data) {
  return new Promise((resolve, reject) => {
    const [, format, bodyData] =
      /data:image\/(\w+);base64,(.*)/.exec(base64data) || []
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'))
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`
    const buffer = wx.base64ToArrayBuffer(bodyData)
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath)
      },
      fail() {
        reject(new Error('ERROR_BASE64SRC_WRITE'))
      },
    })
  })
}

/**
 *
 * @param {*} val
 * @returns
 */
export function validator(val) {
  // 判断val类型
  if (typeof val === 'number') {
    val = val.toString()
  }
  if (typeof val !== 'string') {
    return false
  }
  if (val.length !== 18) {
    return false
  }
  var endNum = val.slice(17, 18)
  var idArray = [...val].splice(0, 17)

  var time = new Date(val.slice(6, 14)).getTime()
  var time1 = new Date().getTime
  if (time > time1) {
    return false
  }

  var sum = 0
  var num = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  for (let i = 0; i < idArray.length; i++) {
    sum = sum + idArray[i] * num[i]
  }
  var remain = sum % 11

  num = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  if (num[remain] !== endNum) {
    return false
  } else {
    return true
  }
}
