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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vcHRpbXVzLXNkay93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vb3B0aW11cy1zZGsvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb3B0aW11cy1zZGsvLi9ub2RlX21vZHVsZXMvZHNicmlkZ2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vb3B0aW11cy1zZGsvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiaW52b2tlRHNCcmlkZ2UiLCJuYW1lIiwicGFyYW1zIiwid2luZG93IiwiYWxlcnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNhbGwiLCJyZXMiLCJKU09OIiwicGFyc2UiLCJjb2RlIiwiT3B0aW11cyIsInNoYXJlIiwiY2xvc2UiLCJ0ZWxlcGhvbmUiLCJsb2dpbiIsIm1hcE5hdmkiLCJwYXlTdWNjZXNzIiwiZ2V0QXBwVmVyc2lvbiIsIm5ld0FjdGlvbiIsImlzSGF2ZUNhbWVyYVBlcm1pc3Npb24iLCJ3eE5hdGl2ZVBheSIsImdldEFNYXBMb2MiLCJnZXRXZWJIZWFkSW5mbyIsImluc3RhbGwiLCJWdWUiLCJvcHRpb25zIiwiaW5zdGFsbGVkIiwicHJvdG90eXBlIiwiJG9wIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7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MUIsV0FBT0YsY0FBYyxDQUFDLGdCQUFELEVBQW1CRSxNQUFuQixDQUFyQjtBQUNEO0FBM0ZhLENBQWhCOztBQThGQSxJQUFNd0IsT0FBTyxHQUFHLFNBQVZBLE9BQVUsQ0FBVUMsR0FBVixFQUFlQyxPQUFmLEVBQXdCO0FBQ3RDLE1BQUlGLE9BQU8sQ0FBQ0csU0FBWixFQUF1QjtBQUN2QkYsS0FBRyxDQUFDRyxTQUFKLENBQWNDLEdBQWQsR0FBb0JsQixPQUFwQjtBQUNELENBSEQ7QUFLQTs7O0FBQ0EsSUFBSSxPQUFPVixNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxNQUFNLENBQUN3QixHQUE1QyxFQUFpRDtBQUMvQ0QsU0FBTyxDQUFDdkIsTUFBTSxDQUFDd0IsR0FBUixDQUFQO0FBQ0Q7O2VBRWM7QUFDYkQsU0FBTyxFQUFQQTtBQURhLEMiLCJmaWxlIjoib3B0aW11cy1zZGsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIm9wdGltdXMtc2RrXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIm9wdGltdXMtc2RrXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIm9wdGltdXMtc2RrXCJdID0gZmFjdG9yeSgpO1xufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwidmFyIGJyaWRnZSA9IHtcbiAgICBkZWZhdWx0OnRoaXMsLy8gZm9yIHR5cGVzY3JpcHRcbiAgICBjYWxsOiBmdW5jdGlvbiAobWV0aG9kLCBhcmdzLCBjYikge1xuICAgICAgICB2YXIgcmV0ID0gJyc7XG4gICAgICAgIGlmICh0eXBlb2YgYXJncyA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYiA9IGFyZ3M7XG4gICAgICAgICAgICBhcmdzID0ge307XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFyZz17ZGF0YTphcmdzPT09dW5kZWZpbmVkP251bGw6YXJnc31cbiAgICAgICAgaWYgKHR5cGVvZiBjYiA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgY2JOYW1lID0gJ2RzY2InICsgd2luZG93LmRzY2IrKztcbiAgICAgICAgICAgIHdpbmRvd1tjYk5hbWVdID0gY2I7XG4gICAgICAgICAgICBhcmdbJ19kc2Nic3R1YiddID0gY2JOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGFyZyA9IEpTT04uc3RyaW5naWZ5KGFyZylcblxuICAgICAgICAvL2lmIGluIHdlYnZpZXcgdGhhdCBkc0JyaWRnZSBwcm92aWRlZCwgY2FsbCFcbiAgICAgICAgaWYod2luZG93Ll9kc2JyaWRnZSl7XG4gICAgICAgICAgIHJldD0gIF9kc2JyaWRnZS5jYWxsKG1ldGhvZCwgYXJnKVxuICAgICAgICB9ZWxzZSBpZih3aW5kb3cuX2Rzd2t8fG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIl9kc2JyaWRnZVwiKSE9LTEpe1xuICAgICAgICAgICByZXQgPSBwcm9tcHQoXCJfZHNicmlkZ2U9XCIgKyBtZXRob2QsIGFyZyk7XG4gICAgICAgIH1cblxuICAgICAgIHJldHVybiAgSlNPTi5wYXJzZShyZXR8fCd7fScpLmRhdGFcbiAgICB9LFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbiAobmFtZSwgZnVuLCBhc3luKSB7XG4gICAgICAgIHZhciBxID0gYXN5biA/IHdpbmRvdy5fZHNhZiA6IHdpbmRvdy5fZHNmXG4gICAgICAgIGlmICghd2luZG93Ll9kc0luaXQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5fZHNJbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vbm90aWZ5IG5hdGl2ZSB0aGF0IGpzIGFwaXMgcmVnaXN0ZXIgc3VjY2Vzc2Z1bGx5IG9uIG5leHQgZXZlbnQgbG9vcFxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYnJpZGdlLmNhbGwoXCJfZHNiLmRzaW5pdFwiKTtcbiAgICAgICAgICAgIH0sIDApXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmdW4gPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgcS5fb2JzW25hbWVdID0gZnVuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcVtuYW1lXSA9IGZ1blxuICAgICAgICB9XG4gICAgfSxcbiAgICByZWdpc3RlckFzeW46IGZ1bmN0aW9uIChuYW1lLCBmdW4pIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlcihuYW1lLCBmdW4sIHRydWUpO1xuICAgIH0sXG4gICAgaGFzTmF0aXZlTWV0aG9kOiBmdW5jdGlvbiAobmFtZSwgdHlwZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKFwiX2RzYi5oYXNOYXRpdmVNZXRob2RcIiwge25hbWU6IG5hbWUsIHR5cGU6dHlwZXx8XCJhbGxcIn0pO1xuICAgIH0sXG4gICAgZGlzYWJsZUphdmFzY3JpcHREaWFsb2dCbG9jazogZnVuY3Rpb24gKGRpc2FibGUpIHtcbiAgICAgICAgdGhpcy5jYWxsKFwiX2RzYi5kaXNhYmxlSmF2YXNjcmlwdERpYWxvZ0Jsb2NrXCIsIHtcbiAgICAgICAgICAgIGRpc2FibGU6IGRpc2FibGUgIT09IGZhbHNlXG4gICAgICAgIH0pXG4gICAgfVxufTtcblxuIWZ1bmN0aW9uICgpIHtcbiAgICBpZiAod2luZG93Ll9kc2YpIHJldHVybjtcbiAgICB2YXIgb2IgPSB7XG4gICAgICAgIF9kc2Y6IHtcbiAgICAgICAgICAgIF9vYnM6IHt9XG4gICAgICAgIH0sXG4gICAgICAgIF9kc2FmOiB7XG4gICAgICAgICAgICBfb2JzOiB7fVxuICAgICAgICB9LFxuICAgICAgICBkc2NiOiAwLFxuICAgICAgICBkc0JyaWRnZTogYnJpZGdlLFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYnJpZGdlLmNhbGwoXCJfZHNiLmNsb3NlUGFnZVwiKVxuICAgICAgICB9LFxuICAgICAgICBfaGFuZGxlTWVzc2FnZUZyb21OYXRpdmU6IGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgICAgICAgICB2YXIgYXJnID0gSlNPTi5wYXJzZShpbmZvLmRhdGEpO1xuICAgICAgICAgICAgdmFyIHJldCA9IHtcbiAgICAgICAgICAgICAgICBpZDogaW5mby5jYWxsYmFja0lkLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZiA9IHRoaXMuX2RzZltpbmZvLm1ldGhvZF07XG4gICAgICAgICAgICB2YXIgYWYgPSB0aGlzLl9kc2FmW2luZm8ubWV0aG9kXVxuICAgICAgICAgICAgdmFyIGNhbGxTeW4gPSBmdW5jdGlvbiAoZiwgb2IpIHtcbiAgICAgICAgICAgICAgICByZXQuZGF0YSA9IGYuYXBwbHkob2IsIGFyZylcbiAgICAgICAgICAgICAgICBicmlkZ2UuY2FsbChcIl9kc2IucmV0dXJuVmFsdWVcIiwgcmV0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNhbGxBc3luID0gZnVuY3Rpb24gKGYsIG9iKSB7XG4gICAgICAgICAgICAgICAgYXJnLnB1c2goZnVuY3Rpb24gKGRhdGEsIGNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldC5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgcmV0LmNvbXBsZXRlID0gY29tcGxldGUhPT1mYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJpZGdlLmNhbGwoXCJfZHNiLnJldHVyblZhbHVlXCIsIHJldClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGYuYXBwbHkob2IsIGFyZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmKSB7XG4gICAgICAgICAgICAgICAgY2FsbFN5bihmLCB0aGlzLl9kc2YpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhZikge1xuICAgICAgICAgICAgICAgIGNhbGxBc3luKGFmLCB0aGlzLl9kc2FmKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy93aXRoIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gaW5mby5tZXRob2Quc3BsaXQoJy4nKTtcbiAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGg8MikgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHZhciBtZXRob2Q9bmFtZS5wb3AoKTtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZXNwYWNlPW5hbWUuam9pbignLicpXG4gICAgICAgICAgICAgICAgdmFyIG9icyA9IHRoaXMuX2RzZi5fb2JzO1xuICAgICAgICAgICAgICAgIHZhciBvYiA9IG9ic1tuYW1lc3BhY2VdIHx8IHt9O1xuICAgICAgICAgICAgICAgIHZhciBtID0gb2JbbWV0aG9kXTtcbiAgICAgICAgICAgICAgICBpZiAobSAmJiB0eXBlb2YgbSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbFN5bihtLCBvYik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb2JzID0gdGhpcy5fZHNhZi5fb2JzO1xuICAgICAgICAgICAgICAgIG9iID0gb2JzW25hbWVzcGFjZV0gfHwge307XG4gICAgICAgICAgICAgICAgbSA9IG9iW21ldGhvZF07XG4gICAgICAgICAgICAgICAgaWYgKG0gJiYgdHlwZW9mIG0gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxBc3luKG0sIG9iKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBhdHRyIGluIG9iKSB7XG4gICAgICAgIHdpbmRvd1thdHRyXSA9IG9iW2F0dHJdXG4gICAgfVxuICAgIGJyaWRnZS5yZWdpc3RlcihcIl9oYXNKYXZhc2NyaXB0TWV0aG9kXCIsIGZ1bmN0aW9uIChtZXRob2QsIHRhZykge1xuICAgICAgICAgdmFyIG5hbWUgPSBtZXRob2Quc3BsaXQoJy4nKVxuICAgICAgICAgaWYobmFtZS5sZW5ndGg8Mikge1xuICAgICAgICAgICByZXR1cm4gISEoX2RzZltuYW1lXXx8X2RzYWZbbmFtZV0pXG4gICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgLy8gd2l0aCBuYW1lc3BhY2VcbiAgICAgICAgICAgdmFyIG1ldGhvZD1uYW1lLnBvcCgpXG4gICAgICAgICAgIHZhciBuYW1lc3BhY2U9bmFtZS5qb2luKCcuJylcbiAgICAgICAgICAgdmFyIG9iPV9kc2YuX29ic1tuYW1lc3BhY2VdfHxfZHNhZi5fb2JzW25hbWVzcGFjZV1cbiAgICAgICAgICAgcmV0dXJuIG9iJiYhIW9iW21ldGhvZF1cbiAgICAgICAgIH1cbiAgICB9KVxufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJyaWRnZTsiLCJpbXBvcnQgZHNicmlkZ2UgZnJvbSAnZHNicmlkZ2UnXG5cbmNvbnN0IGludm9rZURzQnJpZGdlID0gKG5hbWUsIHBhcmFtcyA9IHt9KSA9PiB7XG4gIGlmICghZHNicmlkZ2UpIHtcbiAgICB3aW5kb3cuYWxlcnQoJ25vIHN1cHBvcnRlZCwg6K+35Zyo6L2m5Li75oOgQVBQ5YaF5L2/55SoJylcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgZHNicmlkZ2UuY2FsbChuYW1lLCBwYXJhbXMsIGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgIHJlcyA9IEpTT04ucGFyc2UocmVzKVxuICAgICAgICAgIHJlcy5jb2RlID0gK3Jlcy5jb2RlXG4gICAgICAgICAgcmVzb2x2ZShyZXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KHJlcylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG5cbmNvbnN0IE9wdGltdXMgPSB7XG4gIC8qKlxuICAgKiDliIbkuqtcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBzaGFyZTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnc2hhcmUnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDlhbPpl613ZWJ2aWV3XG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgY2xvc2U6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2Nsb3NlJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5ouo5omT55S16K+dXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgdGVsZXBob25lOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCd0ZWxlcGhvbmUnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDllKTotbfljp/nlJ/nmbvlvZVcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBsb2dpbjogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnbG9naW4nLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDllKTotbflnLDlm77lr7zoiKpcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBtYXBOYXZpOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdtYXBOYXZpJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5pSv5LuY5oiQ5Yqf6LCD55SoIOmAmuefpeWOn+eUn1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIHBheVN1Y2Nlc3M6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ3BheVN1Y2Nlc3MnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5ZhcHDniYjmnKzkv6Hmga9cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBnZXRBcHBWZXJzaW9uOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdnZXRBcHBWZXJzaW9uJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5omT5byA5Y6f55Sf6aG16Z2i5oiW5paw55qEd2VidmlldyDlj6/mjqfliLbljp/nlJ/lpLTmmL7npLrnsbvlnotcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBuZXdBY3Rpb246IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ25ld0FjdGlvbicsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOagoemqjOebuOWGjOadg+mZkFxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIGlzSGF2ZUNhbWVyYVBlcm1pc3Npb246IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2lzSGF2ZUNhbWVyYVBlcm1pc3Npb24nLCBwYXJhbXMpXG4gIH0sXG4gIHd4TmF0aXZlUGF5OiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCd3eE5hdGl2ZVBheScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOiOt+WPlumrmOW+t+WumuS9jeS/oeaBr1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIGdldEFNYXBMb2M6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2dldEFNYXBMb2MnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5blpLTpg6jkv6Hmga8g54q25oCB5qCP6auY5bqm44CB5piv5ZCm5L2/55So5LqG5Y6f55Sf5aS0XG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZ2V0V2ViSGVhZEluZm86IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2dldFdlYkhlYWRJbmZvJywgcGFyYW1zKVxuICB9XG59XG5cbmNvbnN0IGluc3RhbGwgPSBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XG4gIGlmIChpbnN0YWxsLmluc3RhbGxlZCkgcmV0dXJuXG4gIFZ1ZS5wcm90b3R5cGUuJG9wID0gT3B0aW11c1xufVxuXG4vKiDmlK/mjIHkvb/nlKjmoIfnrb7nmoTmlrnlvI/lvJXlhaUgKi9cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVnVlKSB7XG4gIGluc3RhbGwod2luZG93LlZ1ZSlcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBpbnN0YWxsXG59XG4iXSwic291cmNlUm9vdCI6IiJ9