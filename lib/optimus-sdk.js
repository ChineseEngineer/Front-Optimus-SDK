(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("optimus-sdk", [], factory);
	else if(typeof exports === 'object')
		exports["optimus-sdk"] = factory();
	else
		root["optimus-sdk"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/dsbridge/index.js":
/*!****************************************!*\
  !*** ./node_modules/dsbridge/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var bridge = {
    default:this,// for typescript
    call: function (method, args, cb) {
        var ret = '';
        if (typeof args == 'function') {
            cb = args;
            args = {};
        }
        var arg={data:args===undefined?null:args}
        if (typeof cb == 'function') {
            var cbName = 'dscb' + window.dscb++;
            window[cbName] = cb;
            arg['_dscbstub'] = cbName;
        }
        arg = JSON.stringify(arg)

        //if in webview that dsBridge provided, call!
        if(window._dsbridge){
           ret=  _dsbridge.call(method, arg)
        }else if(window._dswk||navigator.userAgent.indexOf("_dsbridge")!=-1){
           ret = prompt("_dsbridge=" + method, arg);
        }

       return  JSON.parse(ret||'{}').data
    },
    register: function (name, fun, asyn) {
        var q = asyn ? window._dsaf : window._dsf
        if (!window._dsInit) {
            window._dsInit = true;
            //notify native that js apis register successfully on next event loop
            setTimeout(function () {
                bridge.call("_dsb.dsinit");
            }, 0)
        }
        if (typeof fun == "object") {
            q._obs[name] = fun;
        } else {
            q[name] = fun
        }
    },
    registerAsyn: function (name, fun) {
        this.register(name, fun, true);
    },
    hasNativeMethod: function (name, type) {
        return this.call("_dsb.hasNativeMethod", {name: name, type:type||"all"});
    },
    disableJavascriptDialogBlock: function (disable) {
        this.call("_dsb.disableJavascriptDialogBlock", {
            disable: disable !== false
        })
    }
};

!function () {
    if (window._dsf) return;
    var ob = {
        _dsf: {
            _obs: {}
        },
        _dsaf: {
            _obs: {}
        },
        dscb: 0,
        dsBridge: bridge,
        close: function () {
            bridge.call("_dsb.closePage")
        },
        _handleMessageFromNative: function (info) {
            var arg = JSON.parse(info.data);
            var ret = {
                id: info.callbackId,
                complete: true
            }
            var f = this._dsf[info.method];
            var af = this._dsaf[info.method]
            var callSyn = function (f, ob) {
                ret.data = f.apply(ob, arg)
                bridge.call("_dsb.returnValue", ret)
            }
            var callAsyn = function (f, ob) {
                arg.push(function (data, complete) {
                    ret.data = data;
                    ret.complete = complete!==false;
                    bridge.call("_dsb.returnValue", ret)
                })
                f.apply(ob, arg)
            }
            if (f) {
                callSyn(f, this._dsf);
            } else if (af) {
                callAsyn(af, this._dsaf);
            } else {
                //with namespace
                var name = info.method.split('.');
                if (name.length<2) return;
                var method=name.pop();
                var namespace=name.join('.')
                var obs = this._dsf._obs;
                var ob = obs[namespace] || {};
                var m = ob[method];
                if (m && typeof m == "function") {
                    callSyn(m, ob);
                    return;
                }
                obs = this._dsaf._obs;
                ob = obs[namespace] || {};
                m = ob[method];
                if (m && typeof m == "function") {
                    callAsyn(m, ob);
                    return;
                }
            }
        }
    }
    for (var attr in ob) {
        window[attr] = ob[attr]
    }
    bridge.register("_hasJavascriptMethod", function (method, tag) {
         var name = method.split('.')
         if(name.length<2) {
           return !!(_dsf[name]||_dsaf[name])
         }else{
           // with namespace
           var method=name.pop()
           var namespace=name.join('.')
           var ob=_dsf._obs[namespace]||_dsaf._obs[namespace]
           return ob&&!!ob[method]
         }
    })
}();

module.exports = bridge;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dsbridge = _interopRequireDefault(__webpack_require__(/*! dsbridge */ "./node_modules/dsbridge/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var invokeDsBridge = function invokeDsBridge(name) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!_dsbridge.default) {
    window.alert('no supported, 请在车主惠APP内使用');
  } else {
    return new Promise(function (resolve, reject) {
      _dsbridge.default.call(name, params, function (res) {
        if (res) {
          res = JSON.parse(res);
          res.code = +res.code;
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }
};

var Optimus = {
  /**
   * 分享
   * @param params
   * @return {undefined}
   */
  share: function share(params) {
    return invokeDsBridge('share', params);
  },

  /**
   * 关闭webview
   * @param params
   * @return {undefined}
   */
  close: function close(params) {
    return invokeDsBridge('close', params);
  },

  /**
   * 拨打电话
   * @param params
   * @return {undefined}
   */
  telephone: function telephone(params) {
    return invokeDsBridge('telephone', params);
  },

  /**
   * 唤起原生登录
   * @param params
   * @return {undefined}
   */
  login: function login(params) {
    return invokeDsBridge('login', params);
  },

  /**
   * 唤起地图导航
   * @param params
   * @return {undefined}
   */
  mapNavi: function mapNavi(params) {
    return invokeDsBridge('mapNavi', params);
  },

  /**
   * 支付成功调用 通知原生
   * @param params
   * @return {undefined}
   */
  paySuccess: function paySuccess(params) {
    return invokeDsBridge('paySuccess', params);
  },

  /**
   * 获取app版本信息
   * @param params
   * @return {undefined}
   */
  getAppVersion: function getAppVersion(params) {
    return invokeDsBridge('getAppVersion', params);
  },

  /**
   * 打开原生页面或新的webview 可控制原生头显示类型
   * @param params
   * @return {undefined}
   */
  newAction: function newAction(params) {
    return invokeDsBridge('newAction', params);
  },

  /**
   * 校验相册权限
   * @param params
   * @return {undefined}
   */
  isHaveCameraPermission: function isHaveCameraPermission(params) {
    return invokeDsBridge('isHaveCameraPermission', params);
  },
  wxNativePay: function wxNativePay(params) {
    return invokeDsBridge('wxNativePay', params);
  },

  /**
   * 获取高德定位信息
   * @param params
   * @return {any}
   */
  getAMapLoc: function getAMapLoc(params) {
    return invokeDsBridge('getAMapLoc', params);
  },

  /**
   * 获取头部信息 状态栏高度、是否使用了原生头
   * @param params
   * @return {Promise<any>}
   */
  getWebHeadInfo: function getWebHeadInfo(params) {
    return invokeDsBridge('getWebHeadInfo', params);
  },

  /**
   * 混合开发特殊事件 ps: 首页礼包交互
   * @param params
   * @return {Promise<any>}
   */
  hybridEvent: function hybridEvent(params) {
    return invokeDsBridge('hybridEvent', params);
  },

  /**
   * 同意隐私协议
   * @param params
   * @return {Promise<any>}
   */
  confirmAgreement: function confirmAgreement(params) {
    return invokeDsBridge('confirmAgreement', params);
  },

  /**
   * 不同意隐私协议
   * @param params
   * @return {Promise<any>}
   */
  disagreeAgreement: function disagreeAgreement(params) {
    return invokeDsBridge('disagreeAgreement', params);
  }
};

var install = function install(Vue, options) {
  if (install.installed) return;
  Vue.prototype.$op = Optimus;
};
/* 支持使用标签的方式引入 */


if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

var _default = {
  install: install
};
exports.default = _default;
module.exports = exports["default"];

/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vcHRpbXVzLXNkay93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vb3B0aW11cy1zZGsvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb3B0aW11cy1zZGsvLi9ub2RlX21vZHVsZXMvZHNicmlkZ2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vb3B0aW11cy1zZGsvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiaW52b2tlRHNCcmlkZ2UiLCJuYW1lIiwicGFyYW1zIiwid2luZG93IiwiYWxlcnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNhbGwiLCJyZXMiLCJKU09OIiwicGFyc2UiLCJjb2RlIiwiT3B0aW11cyIsInNoYXJlIiwiY2xvc2UiLCJ0ZWxlcGhvbmUiLCJsb2dpbiIsIm1hcE5hdmkiLCJwYXlTdWNjZXNzIiwiZ2V0QXBwVmVyc2lvbiIsIm5ld0FjdGlvbiIsImlzSGF2ZUNhbWVyYVBlcm1pc3Npb24iLCJ3eE5hdGl2ZVBheSIsImdldEFNYXBMb2MiLCJnZXRXZWJIZWFkSW5mbyIsImh5YnJpZEV2ZW50IiwiY29uZmlybUFncmVlbWVudCIsImRpc2FncmVlQWdyZWVtZW50IiwiaW5zdGFsbCIsIlZ1ZSIsIm9wdGlvbnMiLCJpbnN0YWxsZWQiLCJwcm90b3R5cGUiLCIkb3AiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdE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RmE7O0FBb0ZkOzs7OztBQUtBdUIsZ0JBQWMsRUFBRSx3QkFBQ3ZCLE1BQUQsRUFBWTtBQUMxQixXQUFPRixjQUFjLENBQUMsZ0JBQUQsRUFBbUJFLE1BQW5CLENBQXJCO0FBQ0QsR0EzRmE7O0FBNEZkOzs7OztBQUtBd0IsYUFBVyxFQUFFLHFCQUFDeEIsTUFBRCxFQUFZO0FBQ3ZCLFdBQU9GLGNBQWMsQ0FBQyxhQUFELEVBQWdCRSxNQUFoQixDQUFyQjtBQUNELEdBbkdhOztBQW9HZDs7Ozs7QUFLQXlCLGtCQUFnQixFQUFFLDBCQUFDekIsTUFBRCxFQUFZO0FBQzVCLFdBQU9GLGNBQWMsQ0FBQyxrQkFBRCxFQUFxQkUsTUFBckIsQ0FBckI7QUFDRCxHQTNHYTs7QUE0R2Q7Ozs7O0FBS0EwQixtQkFBaUIsRUFBRSwyQkFBQzFCLE1BQUQsRUFBWTtBQUM3QixXQUFPRixjQUFjLENBQUMsbUJBQUQsRUFBc0JFLE1BQXRCLENBQXJCO0FBQ0Q7QUFuSGEsQ0FBaEI7O0FBc0hBLElBQU0yQixPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFVQyxHQUFWLEVBQWVDLE9BQWYsRUFBd0I7QUFDdEMsTUFBSUYsT0FBTyxDQUFDRyxTQUFaLEVBQXVCO0FBQ3ZCRixLQUFHLENBQUNHLFNBQUosQ0FBY0MsR0FBZCxHQUFvQnJCLE9BQXBCO0FBQ0QsQ0FIRDtBQUtBOzs7QUFDQSxJQUFJLE9BQU9WLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE1BQU0sQ0FBQzJCLEdBQTVDLEVBQWlEO0FBQy9DRCxTQUFPLENBQUMxQixNQUFNLENBQUMyQixHQUFSLENBQVA7QUFDRDs7ZUFFYztBQUNiRCxTQUFPLEVBQVBBO0FBRGEsQyIsImZpbGUiOiJvcHRpbXVzLXNkay5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwib3B0aW11cy1zZGtcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wib3B0aW11cy1zZGtcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wib3B0aW11cy1zZGtcIl0gPSBmYWN0b3J5KCk7XG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCJ2YXIgYnJpZGdlID0ge1xuICAgIGRlZmF1bHQ6dGhpcywvLyBmb3IgdHlwZXNjcmlwdFxuICAgIGNhbGw6IGZ1bmN0aW9uIChtZXRob2QsIGFyZ3MsIGNiKSB7XG4gICAgICAgIHZhciByZXQgPSAnJztcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNiID0gYXJncztcbiAgICAgICAgICAgIGFyZ3MgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXJnPXtkYXRhOmFyZ3M9PT11bmRlZmluZWQ/bnVsbDphcmdzfVxuICAgICAgICBpZiAodHlwZW9mIGNiID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBjYk5hbWUgPSAnZHNjYicgKyB3aW5kb3cuZHNjYisrO1xuICAgICAgICAgICAgd2luZG93W2NiTmFtZV0gPSBjYjtcbiAgICAgICAgICAgIGFyZ1snX2RzY2JzdHViJ10gPSBjYk5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgYXJnID0gSlNPTi5zdHJpbmdpZnkoYXJnKVxuXG4gICAgICAgIC8vaWYgaW4gd2VidmlldyB0aGF0IGRzQnJpZGdlIHByb3ZpZGVkLCBjYWxsIVxuICAgICAgICBpZih3aW5kb3cuX2RzYnJpZGdlKXtcbiAgICAgICAgICAgcmV0PSAgX2RzYnJpZGdlLmNhbGwobWV0aG9kLCBhcmcpXG4gICAgICAgIH1lbHNlIGlmKHdpbmRvdy5fZHN3a3x8bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiX2RzYnJpZGdlXCIpIT0tMSl7XG4gICAgICAgICAgIHJldCA9IHByb21wdChcIl9kc2JyaWRnZT1cIiArIG1ldGhvZCwgYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgcmV0dXJuICBKU09OLnBhcnNlKHJldHx8J3t9JykuZGF0YVxuICAgIH0sXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uIChuYW1lLCBmdW4sIGFzeW4pIHtcbiAgICAgICAgdmFyIHEgPSBhc3luID8gd2luZG93Ll9kc2FmIDogd2luZG93Ll9kc2ZcbiAgICAgICAgaWYgKCF3aW5kb3cuX2RzSW5pdCkge1xuICAgICAgICAgICAgd2luZG93Ll9kc0luaXQgPSB0cnVlO1xuICAgICAgICAgICAgLy9ub3RpZnkgbmF0aXZlIHRoYXQganMgYXBpcyByZWdpc3RlciBzdWNjZXNzZnVsbHkgb24gbmV4dCBldmVudCBsb29wXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBicmlkZ2UuY2FsbChcIl9kc2IuZHNpbml0XCIpO1xuICAgICAgICAgICAgfSwgMClcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZ1biA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBxLl9vYnNbbmFtZV0gPSBmdW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxW25hbWVdID0gZnVuXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlZ2lzdGVyQXN5bjogZnVuY3Rpb24gKG5hbWUsIGZ1bikge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyKG5hbWUsIGZ1biwgdHJ1ZSk7XG4gICAgfSxcbiAgICBoYXNOYXRpdmVNZXRob2Q6IGZ1bmN0aW9uIChuYW1lLCB0eXBlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwoXCJfZHNiLmhhc05hdGl2ZU1ldGhvZFwiLCB7bmFtZTogbmFtZSwgdHlwZTp0eXBlfHxcImFsbFwifSk7XG4gICAgfSxcbiAgICBkaXNhYmxlSmF2YXNjcmlwdERpYWxvZ0Jsb2NrOiBmdW5jdGlvbiAoZGlzYWJsZSkge1xuICAgICAgICB0aGlzLmNhbGwoXCJfZHNiLmRpc2FibGVKYXZhc2NyaXB0RGlhbG9nQmxvY2tcIiwge1xuICAgICAgICAgICAgZGlzYWJsZTogZGlzYWJsZSAhPT0gZmFsc2VcbiAgICAgICAgfSlcbiAgICB9XG59O1xuXG4hZnVuY3Rpb24gKCkge1xuICAgIGlmICh3aW5kb3cuX2RzZikgcmV0dXJuO1xuICAgIHZhciBvYiA9IHtcbiAgICAgICAgX2RzZjoge1xuICAgICAgICAgICAgX29iczoge31cbiAgICAgICAgfSxcbiAgICAgICAgX2RzYWY6IHtcbiAgICAgICAgICAgIF9vYnM6IHt9XG4gICAgICAgIH0sXG4gICAgICAgIGRzY2I6IDAsXG4gICAgICAgIGRzQnJpZGdlOiBicmlkZ2UsXG4gICAgICAgIGNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBicmlkZ2UuY2FsbChcIl9kc2IuY2xvc2VQYWdlXCIpXG4gICAgICAgIH0sXG4gICAgICAgIF9oYW5kbGVNZXNzYWdlRnJvbU5hdGl2ZTogZnVuY3Rpb24gKGluZm8pIHtcbiAgICAgICAgICAgIHZhciBhcmcgPSBKU09OLnBhcnNlKGluZm8uZGF0YSk7XG4gICAgICAgICAgICB2YXIgcmV0ID0ge1xuICAgICAgICAgICAgICAgIGlkOiBpbmZvLmNhbGxiYWNrSWQsXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBmID0gdGhpcy5fZHNmW2luZm8ubWV0aG9kXTtcbiAgICAgICAgICAgIHZhciBhZiA9IHRoaXMuX2RzYWZbaW5mby5tZXRob2RdXG4gICAgICAgICAgICB2YXIgY2FsbFN5biA9IGZ1bmN0aW9uIChmLCBvYikge1xuICAgICAgICAgICAgICAgIHJldC5kYXRhID0gZi5hcHBseShvYiwgYXJnKVxuICAgICAgICAgICAgICAgIGJyaWRnZS5jYWxsKFwiX2RzYi5yZXR1cm5WYWx1ZVwiLCByZXQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY2FsbEFzeW4gPSBmdW5jdGlvbiAoZiwgb2IpIHtcbiAgICAgICAgICAgICAgICBhcmcucHVzaChmdW5jdGlvbiAoZGF0YSwgY29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0LmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICByZXQuY29tcGxldGUgPSBjb21wbGV0ZSE9PWZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmlkZ2UuY2FsbChcIl9kc2IucmV0dXJuVmFsdWVcIiwgcmV0KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgZi5hcHBseShvYiwgYXJnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGYpIHtcbiAgICAgICAgICAgICAgICBjYWxsU3luKGYsIHRoaXMuX2RzZik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFmKSB7XG4gICAgICAgICAgICAgICAgY2FsbEFzeW4oYWYsIHRoaXMuX2RzYWYpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL3dpdGggbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBpbmZvLm1ldGhvZC5zcGxpdCgnLicpO1xuICAgICAgICAgICAgICAgIGlmIChuYW1lLmxlbmd0aDwyKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdmFyIG1ldGhvZD1uYW1lLnBvcCgpO1xuICAgICAgICAgICAgICAgIHZhciBuYW1lc3BhY2U9bmFtZS5qb2luKCcuJylcbiAgICAgICAgICAgICAgICB2YXIgb2JzID0gdGhpcy5fZHNmLl9vYnM7XG4gICAgICAgICAgICAgICAgdmFyIG9iID0gb2JzW25hbWVzcGFjZV0gfHwge307XG4gICAgICAgICAgICAgICAgdmFyIG0gPSBvYlttZXRob2RdO1xuICAgICAgICAgICAgICAgIGlmIChtICYmIHR5cGVvZiBtID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsU3luKG0sIG9iKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYnMgPSB0aGlzLl9kc2FmLl9vYnM7XG4gICAgICAgICAgICAgICAgb2IgPSBvYnNbbmFtZXNwYWNlXSB8fCB7fTtcbiAgICAgICAgICAgICAgICBtID0gb2JbbWV0aG9kXTtcbiAgICAgICAgICAgICAgICBpZiAobSAmJiB0eXBlb2YgbSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbEFzeW4obSwgb2IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIGF0dHIgaW4gb2IpIHtcbiAgICAgICAgd2luZG93W2F0dHJdID0gb2JbYXR0cl1cbiAgICB9XG4gICAgYnJpZGdlLnJlZ2lzdGVyKFwiX2hhc0phdmFzY3JpcHRNZXRob2RcIiwgZnVuY3Rpb24gKG1ldGhvZCwgdGFnKSB7XG4gICAgICAgICB2YXIgbmFtZSA9IG1ldGhvZC5zcGxpdCgnLicpXG4gICAgICAgICBpZihuYW1lLmxlbmd0aDwyKSB7XG4gICAgICAgICAgIHJldHVybiAhIShfZHNmW25hbWVdfHxfZHNhZltuYW1lXSlcbiAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAvLyB3aXRoIG5hbWVzcGFjZVxuICAgICAgICAgICB2YXIgbWV0aG9kPW5hbWUucG9wKClcbiAgICAgICAgICAgdmFyIG5hbWVzcGFjZT1uYW1lLmpvaW4oJy4nKVxuICAgICAgICAgICB2YXIgb2I9X2RzZi5fb2JzW25hbWVzcGFjZV18fF9kc2FmLl9vYnNbbmFtZXNwYWNlXVxuICAgICAgICAgICByZXR1cm4gb2ImJiEhb2JbbWV0aG9kXVxuICAgICAgICAgfVxuICAgIH0pXG59KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYnJpZGdlOyIsImltcG9ydCBkc2JyaWRnZSBmcm9tICdkc2JyaWRnZSdcblxuY29uc3QgaW52b2tlRHNCcmlkZ2UgPSAobmFtZSwgcGFyYW1zID0ge30pID0+IHtcbiAgaWYgKCFkc2JyaWRnZSkge1xuICAgIHdpbmRvdy5hbGVydCgnbm8gc3VwcG9ydGVkLCDor7flnKjovabkuLvmg6BBUFDlhoXkvb/nlKgnKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBkc2JyaWRnZS5jYWxsKG5hbWUsIHBhcmFtcywgZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgcmVzID0gSlNPTi5wYXJzZShyZXMpXG4gICAgICAgICAgcmVzLmNvZGUgPSArcmVzLmNvZGVcbiAgICAgICAgICByZXNvbHZlKHJlcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QocmVzKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cblxuY29uc3QgT3B0aW11cyA9IHtcbiAgLyoqXG4gICAqIOWIhuS6q1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIHNoYXJlOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdzaGFyZScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOWFs+mXrXdlYnZpZXdcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBjbG9zZTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnY2xvc2UnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDmi6jmiZPnlLXor51cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICB0ZWxlcGhvbmU6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ3RlbGVwaG9uZScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOWUpOi1t+WOn+eUn+eZu+W9lVxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIGxvZ2luOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdsb2dpbicsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOWUpOi1t+WcsOWbvuWvvOiIqlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIG1hcE5hdmk6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ21hcE5hdmknLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDmlK/ku5jmiJDlip/osIPnlKgg6YCa55+l5Y6f55SfXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgcGF5U3VjY2VzczogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgncGF5U3VjY2VzcycsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOiOt+WPlmFwcOeJiOacrOS/oeaBr1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIGdldEFwcFZlcnNpb246IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2dldEFwcFZlcnNpb24nLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDmiZPlvIDljp/nlJ/pobXpnaLmiJbmlrDnmoR3ZWJ2aWV3IOWPr+aOp+WItuWOn+eUn+WktOaYvuekuuexu+Wei1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIG5ld0FjdGlvbjogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnbmV3QWN0aW9uJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5qCh6aqM55u45YaM5p2D6ZmQXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgaXNIYXZlQ2FtZXJhUGVybWlzc2lvbjogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnaXNIYXZlQ2FtZXJhUGVybWlzc2lvbicsIHBhcmFtcylcbiAgfSxcbiAgd3hOYXRpdmVQYXk6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ3d4TmF0aXZlUGF5JywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog6I635Y+W6auY5b635a6a5L2N5L+h5oGvXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7YW55fVxuICAgKi9cbiAgZ2V0QU1hcExvYzogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZ2V0QU1hcExvYycsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOiOt+WPluWktOmDqOS/oeaBryDnirbmgIHmoI/pq5jluqbjgIHmmK/lkKbkvb/nlKjkuobljp/nlJ/lpLRcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBnZXRXZWJIZWFkSW5mbzogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZ2V0V2ViSGVhZEluZm8nLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDmt7flkIjlvIDlj5Hnibnmrorkuovku7YgcHM6IOmmlumhteekvOWMheS6pOS6klxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGh5YnJpZEV2ZW50OiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdoeWJyaWRFdmVudCcsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOWQjOaEj+makOengeWNj+iurlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGNvbmZpcm1BZ3JlZW1lbnQ6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2NvbmZpcm1BZ3JlZW1lbnQnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDkuI3lkIzmhI/pmpDnp4HljY/orq5cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBkaXNhZ3JlZUFncmVlbWVudDogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZGlzYWdyZWVBZ3JlZW1lbnQnLCBwYXJhbXMpXG4gIH1cbn1cblxuY29uc3QgaW5zdGFsbCA9IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcbiAgaWYgKGluc3RhbGwuaW5zdGFsbGVkKSByZXR1cm5cbiAgVnVlLnByb3RvdHlwZS4kb3AgPSBPcHRpbXVzXG59XG5cbi8qIOaUr+aMgeS9v+eUqOagh+etvueahOaWueW8j+W8leWFpSAqL1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5WdWUpIHtcbiAgaW5zdGFsbCh3aW5kb3cuVnVlKVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGluc3RhbGxcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=