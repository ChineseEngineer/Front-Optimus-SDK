const ua = window.navigator.userAgent
const s = ua.match(/MicroMessenger/)
const c = (function (e) {
  var t = e.match(/miniprogram/i)
  return t || window.__wxjs_environment === 'miniprogram' ? (t || (t = [s][1] = 'miniprogram'),
  s ? t : null) : null
}(ua))

const environment = {
  isOptimus: ua.match(/Optimus/),
  isIOS: ua.match(/iP(hone|od|ad)/),
  isAndroid: ua.match(/Android/),
  isWX: u,
  isWXApp: c,
  isQQ: l,
  isQZ: ua.match(/Qzone/),
  isQuickApp: ua.match(/quickapp/),
  toString: function () {
    return ua
  }
}

export default environment
