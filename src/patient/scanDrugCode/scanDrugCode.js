/**
 * Created by cyl on 2016/10/15.
 */
'use strict';
var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
require('./scanDrugCode.css');
var ApiFactory = require('./../../components/ApiFactory.js');


module.exports = React.createClass({
    getInitialState: function() {
        return {
            otherChannelsGoodsList:[]
        }
    },
    componentDidMount: function() {
        if (!this.props.params.code || this.props.params.code == 0) {
            var url = 'scanDrugCode/' + this.props.params.userId + '/' + (this.props.params.access_token || 0);
            Tools.weixin.applyGetUserInfo({
                state: url,
                scope: 'snsapi_base'
            });

        }else{
            this.funGetOtherChannelsGoods();
        }


        wx.ready(function() {
            var url = 'http://' + window.location.host + window.location.pathname + '#/scanDrugCode/1/0/0';
            wx.onMenuShareTimeline({
                title: '扫药送积分，免费问医生', // 分 享 标题
                link: url, // 分享链接
                imgUrl: 'http://drug.test.file.dachentech.com.cn//o_1b4lh7rpn1calrld1l6ot3gs3pe', // 分享图标
                success: function() {},
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareAppMessage({
                title: '扫药送积分，免费问医生', // 分享标题
                desc: '扫描药盒上的药监码可以获得积分啦！累计积分可以免费问医生，还在等什么，赶快来领取吧!', // 分享描述
                link: url, // 分享链接
                imgUrl: 'http://drug.test.file.dachentech.com.cn//o_1b4lh7rpn1calrld1l6ot3gs3pe', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQQ({
                title: '扫药送积分，免费问医生', // 分享标题
                desc: '扫描药盒上的药监码可以获得积分啦！累计积分可以免费问医生，还在等什么，赶快来领取吧!', // 分享描述
                link: url, // 分享链接
                imgUrl: 'http://drug.test.file.dachentech.com.cn//o_1b4lh7rpn1calrld1l6ot3gs3pe', // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareWeibo({
                title: '扫药送积分，免费问医生', // 分享标题
                desc: '扫描药盒上的药监码可以获得积分啦！累计积分可以免费问医生，还在等什么，赶快来领取吧!', // 分享描述
                link: url, // 分享链接
                imgUrl: 'http://drug.test.file.dachentech.com.cn//o_1b4lh7rpn1calrld1l6ot3gs3pe', // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQZone({
                title: '扫药送积分，免费问医生', // 分享标题
                desc: '扫描药盒上的药监码可以获得积分啦！累计积分可以免费问医生，还在等什么，赶快来领取吧!', // 分享描述
                link: url, // 分享链接
                imgUrl: 'http://drug.test.file.dachentech.com.cn//o_1b4lh7rpn1calrld1l6ot3gs3pe', // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });
        });
        Tools.hackWehcatTitle();
    },
    // 绑定用户
    funAplyUser: function(order) {
        var url = 'scanDrugCode/' + this.props.params.userId + '/' + (this.props.params.access_token || 0);
        Tools.weixin.applyGetUserInfo({
            state: url,
        })
    },
    // 检查改微信号是否已绑定
    funChackBindWechat: function(callback) {
        var _this = this;
        Tools.fetch({
            url: ApiFactory.weixin.getWeChatStatus4MP,
            data: {
                code: _this.props.params.code,
                userType: 1
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                // 已绑定
                if (_data.wechatStatus == '2') {
                    var param = {
                        userId: _data.userId,
                        access_token: _data.access_token
                    };
                    _this.props.params.access_token = _data.access_token;
                    _this.props.params.userId = _data.userId;
                    callback();
                } // 未绑定
                else if (_data.wechatStatus == '1') {
                    _this.props.history.pushState(null, "/siginAndSigup/1/0/scanCode009/" + _this.props.params.code)
                }
            }
        })
    },
    //检查用户是否已经关注公众号
    funCheckUserIsSubscribe: function() {
        var _this = this;
        if (!this.props.params.code || this.props.params.code == 0) {
            var url = 'scanDrugCode/' + this.props.params.userId + '/' + (this.props.params.access_token || 0);
            Tools.weixin.applyGetUserInfo({
                state: url,
                scope: 'snsapi_base'
            });
        } else {
            Tools.fetch({
                url: ApiFactory.common.isSubscribe,
                data: {
                    code: this.props.params.code
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data.subscribe == 0) {
                    Tools.tipDialog('请先关注玄关健康公众号！')
                    return;
                } else {
                    _this.funOpenScaner();
                }
            });
        }
    },
    //打开扫码器
    funOpenScaner: function() {
        var _this = this;
        var params = this.props.params;
        // 没有获取微信code
        if (!params.code || params.code == 0) {
            this.funAplyUser();
        } else {
            this.funChackBindWechat(function() {
                // Tools.weixin.scanQRCode(); 
                wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function(res) {
                        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                        _this.setState({ drugCode: result.split(",")[1] });
                        _this.funScanDrugCode();
                    }
                });
            });
        }
    },
    //检查药监码信息
    funScanDrugCode: function() {
        var _this = this;
        Tools.fetch({
            url: ApiFactory.patient.scanDrugCodePoints,
            data: {
                drugCode: _this.state.drugCode,
                // drugCode: '81170220119325294120',
                userId: _this.props.params.userId,
                access_token: _this.props.params.access_token
            }
        }).then(function(rsp) {
            var resultMsg = '';
            if (rsp.resultCode == 1) {
                resultMsg = rsp.data.getPoints;
            } else {
                resultMsg = rsp.resultMsg;
            }
            _this.props.history.pushState(null, "/scanDrugCodeResult/" + rsp.resultCode + "/" + resultMsg + "/" + _this.props.params.access_token + "/" + _this.props.params.userId)

        })
    },
    //检查药监码是否可用 
    funScanDrugCodePoints: function() {
        var _this = this;
        Tools.fetch({
            url: ApiFactory.patient.scanDrugCodePoints,
            data: {
                drugCode: _this.state.drugCode,
                access_token: _this.props.params.access_token,
                userId: _this.props.params.userId
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                var param = {
                    userId: _this.props.params.userId,
                    access_token: _this.props.params.access_token
                };
            }
        })
    },

    //获取开通了“其他渠道获得积分”的品种
    funGetOtherChannelsGoods: function(param) {
        var _this = this;

        Tools.fetch({
            url: ApiFactory.patient.getOtherChannelsGoods
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            // console.log(_data);
            if (_data) {
                _this.setState({
                    otherChannelsGoodsList: _data || []
                })
                console.log(_this.state.otherChannelsGoodsList);

            }
        })
    },

    render: function() {

        var _this = this;
        var isShow = false;
        if (!this.props.params.code || this.props.params.code == 0) {
            isShow = false;
        } else {
            isShow = true;
        }

        return (<div>
                <DocumentTitle title="扫药送积分" />
                { isShow?
                    <div className="scan-drug-code-content">
                        <div className="scan-drug-code-div">
                            <img src="http://drug.test.file.dachentech.com.cn/o_1b4itotg0fsmnmu1dn2icr1l0u9" alt="" className=""/>
                        </div>
                        <div className="scan-drug-code-div">
                            <img onClick={_this.funCheckUserIsSubscribe} src="http://drug.test.file.dachentech.com.cn//o_1b4itq520btmq7v2me1m951dk0e" alt="" className="scan-drug-code-btn"/>
                            <div className="scan-drug-good-list">
                                <ul>
                                    {
                                        _this.state.otherChannelsGoodsList.map(function (item,index) {
                                            return(
                                                <li >
                                                    {item?
                                                        <div className="">
                                                            <div className="scan-drug-good-list-img">
                                                                <img src={item?item.imageUrl:''} alt=""/>
                                                            </div>
                                                            <div className="scan-drug-good-list-content">
                                                                <h3 className="">{item?item.title:''}</h3>
                                                                <h4 className="">
                                                                    <span>{item?item.specification:''}</span>
                                                                    <span>{item?item.packSpecification:''}</span>
                                                                </h4>
                                                                <h4 className="">{item?item.manufacturer:''}</h4>
                                                            </div>
                                                        </div>
                                                        :''
                                                    }
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="scan-drug-code-div">
                            <p>想要参与，赶快来扫描家里的药盒子吧！</p>
                            <p>1.打开玄关健康公众号</p>
                            <p>2.进入【个人中心】-【扫药送积分】</p>
                            <p>3.扫描药盒上8开头的20位“中国药品电子监管码”</p>
                            <img src="http://group.test.file.dachentech.com.cn//o_1bd3paoous1el0p10f112vbuple?100" alt="" className=""/>
                            <p>即有机会获得积分奖励，您可以通过累积积分，使用积分免费问诊医生，足不出门便能享受免费安全的医疗服务等。</p>
                        </div>
                        <div className="scan-drug-code-div">
                            <img onClick={_this.funCheckUserIsSubscribe}  src="http://drug.test.file.dachentech.com.cn//o_1b4itsb2v11gg10a4b9g17fj18pkt" alt="" className="scan-drug-code-btn2"/>
                        </div>
                        <div className="scan-drug-code-div">
                            <img src="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQFx7zwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAydHcwTnhmV3phTl8xMDAwME0wN3oAAgR4SFtYAwQAAAAA" alt="" className="scan-drug-code-ew"/>
                            <h3 className="">长按“识别二维码”，关注更多健康</h3>
                        </div>
                    </div>
                    :''
                }
            </div>
        )
    }
})
