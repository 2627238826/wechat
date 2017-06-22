'use strict';

// hack 华为荣耀6 fetch Promise is not defined
require('es6-promise');
require('whatwg-fetch');
var ApiFactory = require('./ApiFactory.js');

//获取url参数
function _paramArry() {

    var theRequest = {};

    var hash = location.hash;

    hash = hash.split("#/")[1];
    if (hash.indexOf('?') != -1) {
        var str = hash.split("?")[1];
        var strs = str.split("&");
        for (var i = strs.length - 1; i >= 0; i--) {
            var key = strs[i].split("=")[0];
            var velue = strs[i].split("=")[1];
            theRequest[key] = decodeURI(velue);
        }
    }

    var search = location.search;
    if (search.indexOf('?') != -1) {
        var str = search.substr(1);
        var strs = str.split("&");
        for (var i = strs.length - 1; i >= 0; i--) {
            var key = strs[i].split("=")[0];
            var velue = strs[i].split("=")[1];
            theRequest[key] = decodeURI(velue);
        }
    }
    return theRequest;
};

function _objToParamUrl(obj) {
    // obj 转成 参数url
    var bodyStr = '';
    for (var key in obj) {
        if (bodyStr != '') {
            bodyStr += '&';
        }
        bodyStr += key + '=' + encodeURIComponent(obj[key]);
    }

    return bodyStr;
};

//识别设备
function _discernDevice() {
    var agent = navigator.userAgent.toLowerCase();
    var device = {};
    if (agent.match(/MicroMessenger/i) == "micromessenger") {
        device.app = 'weixin'; //在微信中打开
    } else if (agent.match(/QQ\//i) == "qq/") {
        device.app = 'qq'; //在QQ打开
    } else if (agent.match(/WeiBo/i) == "weibo") {
        device.app = 'weibo'; //在新浪微博客户端打开
    }

    if (agent.indexOf('android') != -1) {
        device.platform = 'Android';
    } else if (agent.indexOf('iphone') != -1) {
        device.platform = 'iOS';
    }

    return device;
}


// fetch请求封装
function _fetch(config) {

    if (!config.url) {
        return console.warn('缺少请求地址url');
    }

    // 开启加载动画
    _loadingToggle(true);

    var bodyStr = _objToParamUrl(config.data);

    var _fetch = fetch(
            config.url, {
                method: config.type || 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Web-Agent': 'Wechat/0/H5'
                },
                body: bodyStr
            })
        .then(function(response) {

            // 关闭加载动画
            _loadingToggle(false);

            return response.json();
        }).catch(function(ex) {
            console.log('接口出错', ex)
        });

    return _fetch;

};

// 处理请求返回的数据
function _dealResponse(rsp) {
    if (rsp && rsp.resultCode == 1) {
        return rsp.data || true
    }
    if (rsp && rsp.resultMsg) {
        _tipDialog(rsp.resultMsg)
    }
    return false
};

// 阻止冒泡
function _stopBubble(isCancel, e) {

    if (isCancel) {
        e.preventDefault();
    }
};

// hack微信 
// hackiOS微信标题修改无效
function _hackWehcatTitle() {
    var iframe = document.createElement('iframe');
    iframe.src = "/favicon.ico";
    iframe.onload = function() {
        setTimeout(function() {
            document.getElementById('body').removeChild(iframe);
        }, 0);
    }
    document.getElementById('body').appendChild(iframe);
}


// 加载数据的提示窗口
var loadingToggleElem = null;

function _loadingToggle(isLoading) {

    // <!-- loading toast -->
    var tamplate = '\
        <div class="weui_loading_toast">\
            <div class="weui_mask_transparent"></div>\
            <div class="weui_toast">\
                <div class="weui_loading">\
                    <div class="weui_loading_leaf weui_loading_leaf_0"></div>\
                    <div class="weui_loading_leaf weui_loading_leaf_1"></div>\
                    <div class="weui_loading_leaf weui_loading_leaf_2"></div>\
                    <div class="weui_loading_leaf weui_loading_leaf_3"></div>\
                    <div class="weui_loading_leaf weui_loading_leaf_4"></div>\
                    <div class="weui_loading_leaf weui_loading_leaf_5"></div>\
                    <div class="weui_loading_leaf weui_loading_leaf_6"></div>\
                    <div class="weui_loading_leaf weui_loading_leaf_7"></div>\
                    <div class="weui_loading_leaf weui_loading_leaf_8"></div>\
                    <div class="weui_loading_leaf weui_loading_leaf_9"></div>\
                    <div class="weui_loading_leaf weui_loading_leaf_10"></div>\
                    <div class="weui_loading_leaf weui_loading_leaf_11"></div>\
                </div>\
                <p class="weui_toast_content">数据加载中</p>\
            </div>\
        </div>\
    ';

    if (!loadingToggleElem) {
        loadingToggleElem = document.createElement('div');
        loadingToggleElem.innerHTML = tamplate;
        document.getElementById('body').appendChild(loadingToggleElem);
    };

    if (isLoading) {
        loadingToggleElem.style.display = 'block';
    } else {
        loadingToggleElem.style.display = 'none';
    };

};

// 错误的提示窗口
var tipDialogElem = null;

function _tipDialog(tipText) {

    removeElem();

    var tamplate = '\
        <div class="weui_loading_toast">\
            <div class="weui_mask_transparent"></div>\
            <div class="weui_toast disaplay-table">\
                <span class="display-table-cell v-align-middle p-md">' + (tipText || '提示') + '</span>\
            </div>\
        </div>\
    ';

    addElem();

    setTimeout(function() {
        removeElem();
    }, 2000);

    function addElem() {
        if (!tipDialogElem) {
            tipDialogElem = document.createElement('div');
            tipDialogElem.innerHTML = tamplate;
            document.getElementById('body').appendChild(tipDialogElem);
            tipDialogElem.style.display = 'block';
        };
    };

    function removeElem() {
        if (tipDialogElem) {
            document.getElementById('body').removeChild(tipDialogElem);
            tipDialogElem = null;
        }
    };

};

//询问提示
function _alertModal(tipText, btnText, url) {
    removeElem();
    var tamplate = '\
        <div class="weui_loading_toast weui-dialog">\
            <div class="weui_mask_transparent"></div>\
            <div class="weui_toast disaplay-table m-h-5">\
                <div class=" v-align-middle p-md b-b-1 break_word">' + (tipText || '提示') + '</div>\
                <div class="m-t-xxs m-b-xxs">\
                    <a href="javascript:;" id="funOk" class="text-white">' + (btnText||'好') + '</a>\
                </div>\
            </div>\
        </div>\
    ';

    addElem();

    function addElem() {
        if (!tipDialogElem) {
            tipDialogElem = document.createElement('div');
            tipDialogElem.innerHTML = tamplate;
            document.getElementById('body').appendChild(tipDialogElem);
            tipDialogElem.style.display = 'block';
            document.getElementById('funOk').onclick = function showmsg() {
                removeElem();
                if (url) {
                    window.location.href = url;
                };
            }
        };
    };

    function removeElem() {
        if (tipDialogElem) {
            document.getElementById('body').removeChild(tipDialogElem);
            tipDialogElem = null;
        }
    };
}

// ==================================微信sdk接口============================
var _weixin = {};
// 缓存初始化微信sdk的对象
var _thatwx = {};

// 获取原微信对象
_weixin.getWeixin = function() {
    return _thatwx;
};

// 微信配置
_weixin.config = function(config) {
    wx.config({
        debug: config.debug || false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: config.appId, // 必填，公众号的唯一标识
        timestamp: config.timestamp, // 必填，生成签名的时间戳
        nonceStr: config.nonceStr, // 必填，生成签名的随机串
        signature: config.signature, // 必填，签名，见附录1
        jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'onVoicePlayEnd',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'translateVoice',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ]
            // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    // 返回配置参数
    _thatwx = wx;
    _thatwx._config = config;
    return _thatwx;

    // wx.ready(function() {
    //     // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    //     // console.log('微信sdk验证成功');
    //     getNetType();
    // });
    // wx.error(function(res) {
    //     // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    //     console.log('微信sdk验证失败', res);
    // });

};

// 设置微信sdk
_weixin.init = function(config) {
    if (!config) config = {};
    return _fetch({
        data: config.data || {
            url: location.href.split('#')[0]
        },
        url: config.url || ApiFactory.weixin.getConfig
    }).then(function(response) {
        if (!response || !response.data) {
            console.warn('接口出错')
            return null;
        }
        var _wx = _weixin.config(response.data);
        //隐藏功能：分享QQ、分享QQ空间、微博、在QQ浏览器中打开、在safari浏览器中打开，阅读模式
        // _wx.hideMenuItems({
        //     menuList: ['menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:share:weiboApp', 'menuItem:readMode']
        // });

        _wx.ready(function(){
            //批量隐藏功能
            _wx.hideMenuItems({
                menuList: ['menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:share:weiboApp', 'menuItem:readMode']
            });
        });
        
        return _wx;
    })
};

// 申请获取微信用户信息
_weixin.applyGetUserInfo = function _applyGetUserInfo(config) {


    if (!_thatwx._config) {

        _weixin.init({
            url: ApiFactory.weixin.getConfig,
            data: {
                url: location.href.split('#')[0]
            }
        }).then(function(weixin) {
            _applyGetUserInfo(config);
        })

        return;
    }

    // state编码转换
    if (!config.state) {
        return console.warn('缺少参数:' + state);
    };
    //是否通过静默授权
    var scope='snsapi_userinfo'
    if(config.scope=='snsapi_base'){
        scope='snsapi_base';
    } 
    // alert(scope);
    
    config.state = 'http://' + window.location.host + window.location.pathname + '#/' + config.state;

    // 编码转换 decodeURIComponent(striing)解析
    config.state = encodeURIComponent(config.state);

    if (!config.state.length > 128) {
        return alert('state 过长(只允许长度为128字节)')
    }

    // config.redirect_uri = 'http://www.mediportal.com.cn/wechat/web/#/WeixinCallbackDomain';
    config.redirect_uri = window.location.protocol + '//' + window.location.host + window.location.pathname + '#/WeixinCallbackDomain';
    config.redirect_uri = encodeURIComponent(config.redirect_uri);
    
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + _thatwx._config.appId + '&redirect_uri=' + config.redirect_uri + '&response_type=code&scope='+scope+'&state=' + config.state + '#wechat_redirect';
    window.location.href = url;

};

// 获取微信用户信息(必须先申请才能调用-applyGetUserInfo)
_weixin.getUserInfo = function(config) {
    return _fetch({
        url: ApiFactory.weixin.getUserInfo,
        data: {
            code: config.code
        }
    }).then(function(response) {
        return response;
    })
};
_weixin.scanQRCode = function() {

    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function(res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            return result;
        }
    });
};


// 自定义工具箱
window.Tools = {
    fetch: _fetch,
    dealResponse: _dealResponse,
    weixin: _weixin,
    paramArry: _paramArry,
    objToParamUrl: _objToParamUrl,
    loadingToggle: _loadingToggle,
    stopBubble: _stopBubble,
    tipDialog: _tipDialog,
    discernDevice: _discernDevice,
    hackWehcatTitle: _hackWehcatTitle,
    alertModal: _alertModal
};


module.exports = window.Tools;