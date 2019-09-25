import dsbridge from 'dsbridge'

const invokeDsBridge = (name, params = {}) => {
  if (!dsbridge) {
    window.alert('no supported')
  } else {
    return dsbridge.call(name, params, (res) => {
      if (params.success && typeof params.success === 'function') {
        res = JSON.parse(res)
        return params.success(res)
      }
    })
  }
}

export default {
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
  }
}
