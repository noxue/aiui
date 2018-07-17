import request from '@/utils/request'
import * as CryptoJS from 'crypto-js'

export function loginByUsername(username, password) {
  // 获取tokenKey
  const req = new XMLHttpRequest()
  req.open('GET', process.env.BASE_API + '/account/login?tokenKey=get', false) // 第三个参数 false 代表设置同步请求
  req.setRequestHeader('Accept', 'application/json')
  req.setRequestHeader('Content-Type', 'application/json')
  req.send()
  if (req.status !== 200) {
    return null
  }

  const data = JSON.parse(req.response).data
  const tokenKey = CryptoJS.enc.Utf8.parse(data.tokenKey)
  password = CryptoJS.enc.Utf8.parse(password)
  // AES CBC加密模式
  password = CryptoJS.AES.encrypt(password, tokenKey, { iv: tokenKey, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString()
  var reqData = { appId: username, password: password, methodName: 'login', userKey: data.userKey, timestamp: new Date() }
  return request({
    url: '/account/login',
    method: 'post',
    data: reqData
  })
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}
