/*
 * @Author: jayshawww
 * @Date: 2021-12-25 13:44:24
 * @LastEditTime: 2021-12-25 22:14:27
 * @LastEditors: your name
 * @FilePath: \yuhuanjiankangma\request\index.js
 */
import { baseUrl } from '../utils/index'
import { clientPlatform } from '../utils'
/**
 *
 * @param {String} url [请求的url地址]
 * @param {String} method [请求方式]
 * @param {Object} query [请求时携带的参数]
 * @param {String} header [请求头部]
 * @param {String} baseUrl [请求基础地址]
 */
function request (url, method, query, header, base = baseUrl) {
  // wx.showLoading({
  //   title: '加载中',
  //   mask: true,
  // })
  return new Promise((resolve, reject) => {
    var requestQuery = {
      url: base + url,
      data: query,
      method: method,
      header: header || {
        'content-type': 'application/x-www-form-urlencoded',
        openid: wx.getStorageSync('openid') || '',
        token: wx.getStorageSync('token') || '',
        Cookie: wx.getStorageSync('Cook') || '',
        appid: wx.getAccountInfoSync().miniProgram.appId,
      },
      success(res) {
        // console.log(res, 'requestRes')
        var Cook = ''
        let cook =
          res.header[clientPlatform() === 'windows' ? 'set-cookie' : 'Set-Cookie']
        var cookArr = cook.split('hugjoy_mobile_frontend=')
        if (cookArr.length != 1) {
          var CookArr = cookArr[cookArr.length - 1].split(';')
          Cook = 'hugjoy_mobile_frontend=' + CookArr[0]
          wx.setStorageSync('Cook', Cook)
        }
        // wx.hideLoading()
        var backs = res.data
        // console.log(backs, 'backs')

        if (backs.code == 100 || 'string' == typeof backs) {
          //登陆失败，重新登陆
          wx.setStorageSync('isLogin', false)
          // reject(res.data)
        } else if (backs.code == 0) {
          // console.log('0')
          if (wx.getStorageSync('qy_ids')) {
            wx.setStorageSync('isLogin', true)
          } else {
            wx.setStorageSync('isLogin', false)
          }
        }
        resolve(res.data)
      },
      fail(err) {
        console.log(err, 'allError')
        wx.hideLoading()
        wx.showToast({
          title: '网络链接错误,请重试',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
        reject(err.data)
      },
    }
    switch (header) {
      case 'openid':
        requestQuery.header.openid = wx.getStorageSync('openid')
        break
      case 'token':
        requestQuery.header.token = wx.getStorageSync('token')
        break
      case 'Cook':
        requestQuery.header.Cook = wx.getStorageSync('Cook')
        break
      default:
        break
    }
    wx.request(requestQuery)
  })
}
function get(obj) {
  return request(obj.url, 'GET', obj.data, false)
}

function post(obj) {
  return request(obj.url, 'POST', obj.data, false)
}
function postt(obj) {
  return request(obj.url, 'POST', obj.data, obj.header)
}

export { request, get, post, postt }
