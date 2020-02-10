import dsbridge from 'dsbridge'

const invokeDsBridge = (name, params = {}) => {
  if (!dsbridge) {
    window.alert('no supported, 请在车主惠APP内使用')
  } else {
    return new Promise(function (resolve, reject) {
      dsbridge.call(name, params, function (res) {
        if (res) {
          res = JSON.parse(res)
          res.code = +res.code
          resolve(res)
        } else {
          reject(res)
        }
      })
    })
  }
}

const Optimus = {
  /**
   * 分享
   * @param params
   * @return {undefined}
   */
  share: (params) => {
    return invokeDsBridge('share', params)
  },
  /**
   * 关闭webview
   * @param params
   * @return {undefined}
   */
  close: (params) => {
    return invokeDsBridge('close', params)
  },
  /**
   * 拨打电话
   * @param params
   * @return {undefined}
   */
  telephone: (params) => {
    return invokeDsBridge('telephone', params)
  },
  /**
   * 唤起原生登录
   * @param params
   * @return {undefined}
   */
  login: (params) => {
    return invokeDsBridge('login', params)
  },
  /**
   * 唤起地图导航
   * @param params
   * @return {undefined}
   */
  mapNavi: (params) => {
    return invokeDsBridge('mapNavi', params)
  },
  /**
   * 支付成功调用 通知原生
   * @param params
   * @return {undefined}
   */
  paySuccess: (params) => {
    return invokeDsBridge('paySuccess', params)
  },
  /**
   * 获取app版本信息
   * @param params
   * @return {undefined}
   */
  getAppVersion: (params) => {
    return invokeDsBridge('getAppVersion', params)
  },
  /**
   * 打开原生页面或新的webview 可控制原生头显示类型
   * @param params
   * @return {undefined}
   */
  newAction: (params) => {
    return invokeDsBridge('newAction', params)
  },
  /**
   * 校验相册权限
   * @param params
   * @return {undefined}
   */
  isHaveCameraPermission: (params) => {
    return invokeDsBridge('isHaveCameraPermission', params)
  },
  wxNativePay: (params) => {
    return invokeDsBridge('wxNativePay', params)
  },
  /**
   * 获取高德定位信息
   * @param params
   * @return {any}
   */
  getAMapLoc: (params) => {
    return invokeDsBridge('getAMapLoc', params)
  },
  /**
   * 获取头部信息 状态栏高度、是否使用了原生头
   * @param params
   * @return {Promise<any>}
   */
  getWebHeadInfo: (params) => {
    return invokeDsBridge('getWebHeadInfo', params)
  },
  /**
   * 混合开发特殊事件 ps: 首页礼包交互
   * @param params
   * @return {Promise<any>}
   */
  hybridEvent: (params) => {
    return invokeDsBridge('hybridEvent', params)
  },
  /**
   * 同意隐私协议
   * @param params
   * @return {Promise<any>}
   */
  confirmAgreement: (params) => {
    return invokeDsBridge('confirmAgreement', params)
  },
  /**
   * 不同意隐私协议
   * @param params
   * @return {Promise<any>}
   */
  disagreeAgreement: (params) => {
    return invokeDsBridge('disagreeAgreement', params)
  },
  /**
   * 退出app
   * @param params
   * @return {Promise<any>}
   */
  exitApp: (params) => {
    return invokeDsBridge('exitApp', params)
  },
  /**
   * 关闭弹层webview
   * @param params
   * @return {Promise<any>}
   */
  closePopWebView: (params) => {
    return invokeDsBridge('closePopWebView', params)
  }
}

const install = function (Vue, options) {
  if (install.installed) return
  Vue.prototype.$op = Optimus
}

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install
}
