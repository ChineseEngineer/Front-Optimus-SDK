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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vcHRpbXVzLXNkay93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vb3B0aW11cy1zZGsvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb3B0aW11cy1zZGsvLi9ub2RlX21vZHVsZXMvZHNicmlkZ2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vb3B0aW11cy1zZGsvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiaW52b2tlRHNCcmlkZ2UiLCJuYW1lIiwicGFyYW1zIiwid2luZG93IiwiYWxlcnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNhbGwiLCJyZXMiLCJKU09OIiwicGFyc2UiLCJjb2RlIiwiT3B0aW11cyIsInNoYXJlIiwiY2xvc2UiLCJ0ZWxlcGhvbmUiLCJsb2dpbiIsIm1hcE5hdmkiLCJwYXlTdWNjZXNzIiwiZ2V0QXBwVmVyc2lvbiIsIm5ld0FjdGlvbiIsImlzSGF2ZUNhbWVyYVBlcm1pc3Npb24iLCJ3eE5hdGl2ZVBheSIsImdldEFNYXBMb2MiLCJpbnN0YWxsIiwiVnVlIiwib3B0aW9ucyIsImluc3RhbGxlZCIsInByb3RvdHlwZSIsIiRvcCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QjtBQUN0QyxNQUFJRixPQUFPLENBQUNHLFNBQVosRUFBdUI7QUFDdkJGLEtBQUcsQ0FBQ0csU0FBSixDQUFjQyxHQUFkLEdBQW9CakIsT0FBcEI7QUFDRCxDQUhEO0FBS0E7OztBQUNBLElBQUksT0FBT1YsTUFBUCxLQUFrQixXQUFsQixJQUFpQ0EsTUFBTSxDQUFDdUIsR0FBNUMsRUFBaUQ7QUFDL0NELFNBQU8sQ0FBQ3RCLE1BQU0sQ0FBQ3VCLEdBQVIsQ0FBUDtBQUNEOztlQUVjO0FBQ2JELFNBQU8sRUFBUEE7QUFEYSxDIiwiZmlsZSI6Im9wdGltdXMtc2RrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJvcHRpbXVzLXNka1wiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJvcHRpbXVzLXNka1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJvcHRpbXVzLXNka1wiXSA9IGZhY3RvcnkoKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsInZhciBicmlkZ2UgPSB7XG4gICAgZGVmYXVsdDp0aGlzLC8vIGZvciB0eXBlc2NyaXB0XG4gICAgY2FsbDogZnVuY3Rpb24gKG1ldGhvZCwgYXJncywgY2IpIHtcbiAgICAgICAgdmFyIHJldCA9ICcnO1xuICAgICAgICBpZiAodHlwZW9mIGFyZ3MgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2IgPSBhcmdzO1xuICAgICAgICAgICAgYXJncyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHZhciBhcmc9e2RhdGE6YXJncz09PXVuZGVmaW5lZD9udWxsOmFyZ3N9XG4gICAgICAgIGlmICh0eXBlb2YgY2IgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGNiTmFtZSA9ICdkc2NiJyArIHdpbmRvdy5kc2NiKys7XG4gICAgICAgICAgICB3aW5kb3dbY2JOYW1lXSA9IGNiO1xuICAgICAgICAgICAgYXJnWydfZHNjYnN0dWInXSA9IGNiTmFtZTtcbiAgICAgICAgfVxuICAgICAgICBhcmcgPSBKU09OLnN0cmluZ2lmeShhcmcpXG5cbiAgICAgICAgLy9pZiBpbiB3ZWJ2aWV3IHRoYXQgZHNCcmlkZ2UgcHJvdmlkZWQsIGNhbGwhXG4gICAgICAgIGlmKHdpbmRvdy5fZHNicmlkZ2Upe1xuICAgICAgICAgICByZXQ9ICBfZHNicmlkZ2UuY2FsbChtZXRob2QsIGFyZylcbiAgICAgICAgfWVsc2UgaWYod2luZG93Ll9kc3drfHxuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJfZHNicmlkZ2VcIikhPS0xKXtcbiAgICAgICAgICAgcmV0ID0gcHJvbXB0KFwiX2RzYnJpZGdlPVwiICsgbWV0aG9kLCBhcmcpO1xuICAgICAgICB9XG5cbiAgICAgICByZXR1cm4gIEpTT04ucGFyc2UocmV0fHwne30nKS5kYXRhXG4gICAgfSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24gKG5hbWUsIGZ1biwgYXN5bikge1xuICAgICAgICB2YXIgcSA9IGFzeW4gPyB3aW5kb3cuX2RzYWYgOiB3aW5kb3cuX2RzZlxuICAgICAgICBpZiAoIXdpbmRvdy5fZHNJbml0KSB7XG4gICAgICAgICAgICB3aW5kb3cuX2RzSW5pdCA9IHRydWU7XG4gICAgICAgICAgICAvL25vdGlmeSBuYXRpdmUgdGhhdCBqcyBhcGlzIHJlZ2lzdGVyIHN1Y2Nlc3NmdWxseSBvbiBuZXh0IGV2ZW50IGxvb3BcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGJyaWRnZS5jYWxsKFwiX2RzYi5kc2luaXRcIik7XG4gICAgICAgICAgICB9LCAwKVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnVuID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIHEuX29ic1tuYW1lXSA9IGZ1bjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHFbbmFtZV0gPSBmdW5cbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVnaXN0ZXJBc3luOiBmdW5jdGlvbiAobmFtZSwgZnVuKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXIobmFtZSwgZnVuLCB0cnVlKTtcbiAgICB9LFxuICAgIGhhc05hdGl2ZU1ldGhvZDogZnVuY3Rpb24gKG5hbWUsIHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbChcIl9kc2IuaGFzTmF0aXZlTWV0aG9kXCIsIHtuYW1lOiBuYW1lLCB0eXBlOnR5cGV8fFwiYWxsXCJ9KTtcbiAgICB9LFxuICAgIGRpc2FibGVKYXZhc2NyaXB0RGlhbG9nQmxvY2s6IGZ1bmN0aW9uIChkaXNhYmxlKSB7XG4gICAgICAgIHRoaXMuY2FsbChcIl9kc2IuZGlzYWJsZUphdmFzY3JpcHREaWFsb2dCbG9ja1wiLCB7XG4gICAgICAgICAgICBkaXNhYmxlOiBkaXNhYmxlICE9PSBmYWxzZVxuICAgICAgICB9KVxuICAgIH1cbn07XG5cbiFmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHdpbmRvdy5fZHNmKSByZXR1cm47XG4gICAgdmFyIG9iID0ge1xuICAgICAgICBfZHNmOiB7XG4gICAgICAgICAgICBfb2JzOiB7fVxuICAgICAgICB9LFxuICAgICAgICBfZHNhZjoge1xuICAgICAgICAgICAgX29iczoge31cbiAgICAgICAgfSxcbiAgICAgICAgZHNjYjogMCxcbiAgICAgICAgZHNCcmlkZ2U6IGJyaWRnZSxcbiAgICAgICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJyaWRnZS5jYWxsKFwiX2RzYi5jbG9zZVBhZ2VcIilcbiAgICAgICAgfSxcbiAgICAgICAgX2hhbmRsZU1lc3NhZ2VGcm9tTmF0aXZlOiBmdW5jdGlvbiAoaW5mbykge1xuICAgICAgICAgICAgdmFyIGFyZyA9IEpTT04ucGFyc2UoaW5mby5kYXRhKTtcbiAgICAgICAgICAgIHZhciByZXQgPSB7XG4gICAgICAgICAgICAgICAgaWQ6IGluZm8uY2FsbGJhY2tJZCxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGYgPSB0aGlzLl9kc2ZbaW5mby5tZXRob2RdO1xuICAgICAgICAgICAgdmFyIGFmID0gdGhpcy5fZHNhZltpbmZvLm1ldGhvZF1cbiAgICAgICAgICAgIHZhciBjYWxsU3luID0gZnVuY3Rpb24gKGYsIG9iKSB7XG4gICAgICAgICAgICAgICAgcmV0LmRhdGEgPSBmLmFwcGx5KG9iLCBhcmcpXG4gICAgICAgICAgICAgICAgYnJpZGdlLmNhbGwoXCJfZHNiLnJldHVyblZhbHVlXCIsIHJldClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjYWxsQXN5biA9IGZ1bmN0aW9uIChmLCBvYikge1xuICAgICAgICAgICAgICAgIGFyZy5wdXNoKGZ1bmN0aW9uIChkYXRhLCBjb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXQuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHJldC5jb21wbGV0ZSA9IGNvbXBsZXRlIT09ZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyaWRnZS5jYWxsKFwiX2RzYi5yZXR1cm5WYWx1ZVwiLCByZXQpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBmLmFwcGx5KG9iLCBhcmcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZikge1xuICAgICAgICAgICAgICAgIGNhbGxTeW4oZiwgdGhpcy5fZHNmKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWYpIHtcbiAgICAgICAgICAgICAgICBjYWxsQXN5bihhZiwgdGhpcy5fZHNhZik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vd2l0aCBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGluZm8ubWV0aG9kLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUubGVuZ3RoPDIpIHJldHVybjtcbiAgICAgICAgICAgICAgICB2YXIgbWV0aG9kPW5hbWUucG9wKCk7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWVzcGFjZT1uYW1lLmpvaW4oJy4nKVxuICAgICAgICAgICAgICAgIHZhciBvYnMgPSB0aGlzLl9kc2YuX29icztcbiAgICAgICAgICAgICAgICB2YXIgb2IgPSBvYnNbbmFtZXNwYWNlXSB8fCB7fTtcbiAgICAgICAgICAgICAgICB2YXIgbSA9IG9iW21ldGhvZF07XG4gICAgICAgICAgICAgICAgaWYgKG0gJiYgdHlwZW9mIG0gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxTeW4obSwgb2IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9icyA9IHRoaXMuX2RzYWYuX29icztcbiAgICAgICAgICAgICAgICBvYiA9IG9ic1tuYW1lc3BhY2VdIHx8IHt9O1xuICAgICAgICAgICAgICAgIG0gPSBvYlttZXRob2RdO1xuICAgICAgICAgICAgICAgIGlmIChtICYmIHR5cGVvZiBtID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsQXN5bihtLCBvYik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgYXR0ciBpbiBvYikge1xuICAgICAgICB3aW5kb3dbYXR0cl0gPSBvYlthdHRyXVxuICAgIH1cbiAgICBicmlkZ2UucmVnaXN0ZXIoXCJfaGFzSmF2YXNjcmlwdE1ldGhvZFwiLCBmdW5jdGlvbiAobWV0aG9kLCB0YWcpIHtcbiAgICAgICAgIHZhciBuYW1lID0gbWV0aG9kLnNwbGl0KCcuJylcbiAgICAgICAgIGlmKG5hbWUubGVuZ3RoPDIpIHtcbiAgICAgICAgICAgcmV0dXJuICEhKF9kc2ZbbmFtZV18fF9kc2FmW25hbWVdKVxuICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgIC8vIHdpdGggbmFtZXNwYWNlXG4gICAgICAgICAgIHZhciBtZXRob2Q9bmFtZS5wb3AoKVxuICAgICAgICAgICB2YXIgbmFtZXNwYWNlPW5hbWUuam9pbignLicpXG4gICAgICAgICAgIHZhciBvYj1fZHNmLl9vYnNbbmFtZXNwYWNlXXx8X2RzYWYuX29ic1tuYW1lc3BhY2VdXG4gICAgICAgICAgIHJldHVybiBvYiYmISFvYlttZXRob2RdXG4gICAgICAgICB9XG4gICAgfSlcbn0oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBicmlkZ2U7IiwiaW1wb3J0IGRzYnJpZGdlIGZyb20gJ2RzYnJpZGdlJ1xuXG5jb25zdCBpbnZva2VEc0JyaWRnZSA9IChuYW1lLCBwYXJhbXMgPSB7fSkgPT4ge1xuICBpZiAoIWRzYnJpZGdlKSB7XG4gICAgd2luZG93LmFsZXJ0KCdubyBzdXBwb3J0ZWQsIOivt+WcqOi9puS4u+aDoEFQUOWGheS9v+eUqCcpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGRzYnJpZGdlLmNhbGwobmFtZSwgcGFyYW1zLCBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICByZXMgPSBKU09OLnBhcnNlKHJlcylcbiAgICAgICAgICByZXMuY29kZSA9ICtyZXMuY29kZVxuICAgICAgICAgIHJlc29sdmUocmVzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdChyZXMpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuXG5jb25zdCBPcHRpbXVzID0ge1xuICAvKipcbiAgICog5YiG5LqrXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgc2hhcmU6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ3NoYXJlJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5YWz6Zetd2Vidmlld1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIGNsb3NlOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdjbG9zZScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOaLqOaJk+eUteivnVxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIHRlbGVwaG9uZTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgndGVsZXBob25lJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5ZSk6LW35Y6f55Sf55m75b2VXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgbG9naW46IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2xvZ2luJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5ZSk6LW35Zyw5Zu+5a+86IiqXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgbWFwTmF2aTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnbWFwTmF2aScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOaUr+S7mOaIkOWKn+iwg+eUqCDpgJrnn6Xljp/nlJ9cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBwYXlTdWNjZXNzOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdwYXlTdWNjZXNzJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog6I635Y+WYXBw54mI5pys5L+h5oGvXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0QXBwVmVyc2lvbjogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZ2V0QXBwVmVyc2lvbicsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOaJk+W8gOWOn+eUn+mhtemdouaIluaWsOeahHdlYnZpZXcg5Y+v5o6n5Yi25Y6f55Sf5aS05pi+56S657G75Z6LXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgbmV3QWN0aW9uOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCduZXdBY3Rpb24nLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDmoKHpqoznm7jlhozmnYPpmZBcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBpc0hhdmVDYW1lcmFQZXJtaXNzaW9uOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdpc0hhdmVDYW1lcmFQZXJtaXNzaW9uJywgcGFyYW1zKVxuICB9LFxuICB3eE5hdGl2ZVBheTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnd3hOYXRpdmVQYXknLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5bpq5jlvrflrprkvY3kv6Hmga9cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHthbnl9XG4gICAqL1xuICBnZXRBTWFwTG9jOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdnZXRBTWFwTG9jJywgcGFyYW1zKVxuICB9XG59XG5cbmNvbnN0IGluc3RhbGwgPSBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XG4gIGlmIChpbnN0YWxsLmluc3RhbGxlZCkgcmV0dXJuXG4gIFZ1ZS5wcm90b3R5cGUuJG9wID0gT3B0aW11c1xufVxuXG4vKiDmlK/mjIHkvb/nlKjmoIfnrb7nmoTmlrnlvI/lvJXlhaUgKi9cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVnVlKSB7XG4gIGluc3RhbGwod2luZG93LlZ1ZSlcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBpbnN0YWxsXG59XG4iXSwic291cmNlUm9vdCI6IiJ9