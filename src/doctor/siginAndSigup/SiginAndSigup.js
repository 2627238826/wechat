'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var History = ReactRouter.History;
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var ApiFactory = require('./../../components/ApiFactory.js');


module.exports = React.createClass({
    mixins: [LinkedStateMixin],
    // 绑定用户
    funAplyUser: function(order) {

        var url = 'siginAndSigup/' + this.props.params.doctorId + '/' + (this.props.params.packId || 0) + '/' + (this.props.params.packType || 0);
        Tools.weixin.applyGetUserInfo({
            state: url,
        })
    },
    // 检查改微信号是否已绑定
    funChackBindWechat: function() {
        var _that = this;
        Tools.fetch({
            url: ApiFactory.weixin.getWeChatStatus4MP,
            data: {
                code: _that.props.params.code,
                userType: 1
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                  // 获取用户是否绑定了公众号
                    var params = _that.props.params;
                    params.wechatStatus=_data.wechatStatus;
                    _that.setState({
                        params: params 
                    });
                // 已绑定
                if (_data.wechatStatus == 2) {
                    //判断是否是从我的积分进来
                    if(_that.props.params.packType=="score009"){
                        _that.props.history.pushState(null, '/scoreSearch/1/0/'+_that.state.params.code); 
                    } 
                    //判断是否是从扫码积分进来
                    else if(_that.props.params.packType=="scanCode009"){
                        _that.props.history.pushState(null, '/scanDrugCode/1/0/'+_that.state.params.code); 
                    } //判断是否是从患者注册进来
                    else if(_that.props.params.packType=="patient009"){
                        _that.props.history.pushState(null, 'patientSigupSuccess/绑定成功/您已成功绑定手机号码！');
                    }else if(_that.props.params.packType=="selectPatient009"){
                        _that.props.history.pushState(null,'selectPatient/'+_that.props.params.doctorId+'/'+_data.access_token+'/'+_that.state.params.code);
                    }else{
                         _that.props.history.pushState(null,
                        '/editorOrderInfo/' +
                        _that.props.params.doctorId + '/' +
                        (_that.props.params.packId || 0) + '/' +
                        (_that.props.params.packType || 0) + '/' +
                        _data.access_token)
                    }
                   
                }
            }
        })
    },
    // 注册并登录
    funLoginAndLogup: function() {

        var _that = this;

        // 验证验证码
        (function funVerifyCaptcha() {
            Tools.fetch({
                url: ApiFactory.common.verifyCode,
                data: {
                    telephone: _that.state.phone,
                    randcode: _that.state.code
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    funLoginAndLogup();
                }
            })
        })();

        // 提交
        function funLoginAndLogup() {
 
            Tools.fetch({
                url: ApiFactory.common.loginByWeChat4MP,
                data: {
                    telephone: _that.state.phone,
                    userType: 1,
                    code: _that.state.params.code
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    // editorOrderInfo/:doctorId/:packId/:packType/:access_token/:patientId/:telephone
                    //判断是否是从我的积分进来
                     if(_that.props.params.packType=="score009"){
                        _that.props.history.pushState(null, '/scoreSearch/1/0/'+_that.state.params.code) ;
                    }else if(_that.props.params.packType=="scanCode009"){
                        _that.props.history.pushState(null, '/scanDrugCode/1/0/'+_that.state.params.code) ;
                    }//判断是否是从患者注册进来
                    else if(_that.props.params.packType=="patient009"){
                        _that.props.history.pushState(null, 'patientSigupSuccess/绑定成功/您已成功绑定手机号码！');
                    } else if (_that.props.params.packType=="selectPatient009"){
                        if(_data.user && _data.user.rename == 1) { // 需要修改名字
                            _that.props.history.pushState(null,
                            '/patientRename/' +
                            _that.props.params.doctorId + '/' +
                            _that.state.params.code + '/' +
                            _that.props.params.packType + '/' +
                            _data.access_token)
                        } else {
                            _that.props.history.pushState(null,
                            '/selectPatient/' +
                            _that.props.params.doctorId + '/' +
                            _data.access_token + '/' +
                            _that.state.params.code)
                        }
                    } else {
                        if(_data.user && _data.user.rename == 1) { // 需要修改名字
                            _that.props.history.pushState(null,
                            '/patientRename/' +
                            _that.props.params.doctorId + '/' +
                            (_that.props.params.packId || 0) + '/' +
                            (_that.props.params.packType || 0) + '/' +
                            _data.access_token)
                        } else {
                            _that.props.history.pushState(null,
                            '/editorOrderInfo/' +
                            _that.props.params.doctorId + '/' +
                            (_that.props.params.packId || 0) + '/' +
                            (_that.props.params.packType || 0) + '/' +
                            _data.access_token)
                        }
                    }
             
                }
            })
        };

    },
    // 倒数时间
    funSetTime: function(thisTime) {

        var time = (this.state.time || thisTime || 0) - 1;
        if (time == -1) return;

        this.setState({
            time: time
        })

        setTimeout(this.funSetTime, 1000);
    },
    // 获取短信验证码
    funGetSmsCode: function(e) {
        
        var re = /^1\d{10}$/;
        if (this.state.time) return;

        var _that = this;

        if (!this.refs.phone.value || this.refs.phone.value.length < 11||!re.test(this.refs.phone.value)) {
             Tools.tipDialog('请正确输入手机号')
            return;
        }

        this.funCheckWeixin().then(function(rsp) {

            var _data = Tools.dealResponse(rsp);

            if (_data.isBindWechat == 1) {

                Tools.tipDialog('该手机号已绑定另一个微信账号，请更换手机号码。');

            } else {
                funSendMsg();
            }

        })

        function funSendMsg() {

            Tools.tipDialog('短信已发送，请注意查收。');

            Tools.fetch({
                url: ApiFactory.common.getSMSCode,
                data: {
                    telephone: _that.refs.phone.value
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    // console.log('发送成功');
                    _that.funSetTime(61);
                }
            }) 
        };


    },
    funCheckWeixin: function() {

        return Tools.fetch({
            url: ApiFactory.weixin.isBindWechat,
            data: {
                telephone: this.refs.phone.value
            }
        });

    },
    funGetVoiceCode: function() {
        var _that = this; 

        var re = /^1\d{10}$/;

        if (this.state.time && this.state.time.length > 0) {
            return;
        }

        if (!this.refs.phone.value || this.refs.phone.value.length < 11||!re.test(this.refs.phone.value)) {
            Tools.tipDialog('请正确输入手机号')
            return;
        }

        Tools.tipDialog('语音已发送，请注意查收。');

        Tools.fetch({
            url: ApiFactory.common.getVoiceCode,
            data: {
                telephone: this.refs.phone.value
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                _that.funSetTime(61);
            }
        })
    },
    componentWillMount: function() {

        var params = this.props.params;

        // 没有获取微信code
        if (!params.code || params.code == 0) {
            this.funAplyUser();
        } else {
            this.funChackBindWechat();
        }

        this.setState({
            params: params
        })

    },
    getInitialState: function() {

        return {
            phone: '',
            code: '',
            time: 0,
            params: {}
        }

    },
    componentDidMount: function() {
        Tools.hackWehcatTitle();
    },
    render: function() {
        var _that = this;

        return (
            <div className="text-center">
                <DocumentTitle title="注册/登录"/>
               
                  <div className={this.props.params.code==0||this.props.params.wechatStatus!=1?'hide':''}>
                        <div className="weui_cells weui_cells_form m-t-md">
                            <div className="weui_cell">
                                <div className="weui_cell_bd weui_cell_primary">
                                    <input ref="phone" className="weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码" valueLink={this.linkState('phone')}/>
                                </div>
                            </div>
                            <div className="weui_cell weui_vcode">
                                <div className="weui_cell_bd weui_cell_primary">
                                    <input ref="code" className="weui_input" type="text" placeholder="请输入短信验证码" disabled={!this.state.phone||this.state.phone.length<11} valueLink={this.linkState('code')}/>
                                </div>
                                <div className="weui_cell_ft">
                                    <button className="weui_btn weui_btn_mini weui_btn_default m-t-xs m-b-xs m-r-xs" onClick={this.funGetSmsCode.bind(this)} disabled={!this.state.phone||this.state.phone.length<11||this.state.time>0}>{this.state.time?this.state.time+'秒倒计时结束':'获取验证码'}</button>
                                </div>
                            </div>
                        </div>
                        <div className="p-md">
                            <button className="weui_btn weui_btn_primary" onClick={this.funLoginAndLogup} disabled={!this.state.phone||this.state.phone.length<11||!this.state.code||this.state.code.length<4}>确定</button>
                        </div>
                        <div className="text-center">
                            收不到验证码？
                            <a href="javascript:void(0)" className="text-underline text-green" 
                                style={this.state.time>0 && this.state.time<61 ? {color: '#333'} : {}}
                                onClick={this.funGetVoiceCode}>试试语音获取</a>
                        </div>
                  </div> 
                 
            </div>
        )
    }
})
