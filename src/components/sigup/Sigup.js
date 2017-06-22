'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var ApiFactory = require('./../ApiFactory.js');

var ReactWeui = require('react-weui');
var Dialog = ReactWeui.Dialog;
var Confirm = Dialog.Confirm;

module.exports = React.createClass({
    mixins: [LinkedStateMixin],
    // 绑定用户
    funAplyUser: function() {

        var url = 'singup/' + this.props.params.userType
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
                userType: _that.props.params.userType
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                // 已绑定
                if (_data.wechatStatus == 2) {
                    
                    _that.props.history.pushState(null, 'sigupSuccess/' + _that.props.params.userType + '/您已注册，请点击立即体验下载App。');
                }
            }
        })
    },
    funSingup: function() {

        var _that = this;

        // 验证验证码
        (function funVerifyCaptcha(phone, code) {
            Tools.fetch({
                url: ApiFactory.common.verifyCode,
                data: {
                    telephone: phone,
                    randcode: code
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    funSubmit();
                }
            })
        })(_that.state.phone, _that.state.code);

        // 注册
        function funSubmit() {
            Tools.fetch({
                url: ApiFactory.common.registerByWechat,
                data: {
                    'telephone': _that.state.phone,
                    'password': _that.state.pwd,
                    'userType': _that.props.params.userType,
                    'code': _that.props.params.code
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _that.props.history.pushState(null, 'sigupSuccess/' + 3 + '/注册成功');
                }
            })
        };

    },
    funVerifyPhone: function(fun) {

        var _that = this;

        if (!_that.state.phone || _that.state.phone.length < 11) {
            Tools.tipDialog('请正确输入手机号')
            return;
        }

        Tools.fetch({
            url: ApiFactory.common.verifyTelephone,
            data: {
                telephone: _that.state.phone,
                userType: _that.props.params.userType
            }
        }).then(function(rsp) {
            if (rsp && rsp.resultCode == 1) {

                fun(_that.state.phone, _that.props.params.userType);

            } else if (rsp && rsp.resultMsg) {

                if (rsp.resultMsg == '该手机号码已注册') {

                    var confirmDesr = '';
                    if (_that.props.params.userType == 1) {
                        confirmDesr = '您好，您的手机号已经注册，可以直接登录玄关健康患者端APP';
                    } else if (_that.props.params.userType == 3) {
                        confirmDesr = '您好，您的手机号已经注册，可以直接登录医生圈APP';
                    }

                    _that.setState({
                        showConfirm: true,
                        confirmDesr: confirmDesr
                    })

                } else {

                    Tools.tipDialog(rsp.resultMsg);
                }
            }
        })

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
    funGetSmsCode: function() {
        var _that = this;

        // 校验手机号
        this.funVerifyPhone(function(telephone, userType) {
            funSendSms(telephone, userType);
        });

        // 发送短信
        function funSendSms(telephone, userType) {

            Tools.tipDialog('短信已发送，请注意查收。');

            Tools.fetch({
                url: ApiFactory.common.getSMSCode,
                data: {
                    telephone: telephone
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _that.funSetTime(61);
                }
            })
        };
    },
    funGetVoiceCode: function() {
        var _that = this;

        // 校验手机号
        this.funVerifyPhone(function(telephone, userType) {
            funSendVSms(telephone, userType);
        });

        // 发送语音短信
        function funSendVSms(telephone, userType) {

            Tools.tipDialog('语音已发送，请注意查收。');

            Tools.fetch({
                url: ApiFactory.common.getVoiceCode,
                data: {
                    telephone: telephone
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _that.funSetTime(61);
                }
            })
        };
    },
    componentDidMount: function() {

        var params = this.props.params;
        // 没有获取微信code
        if (!params.code || params.code == 0) {
            this.funAplyUser();
        }
        // 判断是否已经绑定注册
        else {
            this.funChackBindWechat();
        }

    },
    getInitialState: function() {
        var _that = this;

        return {
            phone: '',
            code: '',
            pwd: '',
            time: 0,
            confirm: {
                title: '该手机号码已注册',
                buttons: [{
                    type: 'default',
                    label: '取消',
                    onClick: function() {
                        _that.setState({
                            showConfirm: false
                        })
                    }
                }, {
                    type: 'primary',
                    label: '下载',
                    onClick: function() {
                        if (_that.props.params.userType == 1) {
                            // _that.props.history.pushState(null, 'patientDownApp');
                            window.location.href = 'http://xg.mediportal.com.cn/health/web/app/downPatient.html?a=1';
                        } else if (_that.props.params.userType == 3) {
                            // _that.props.history.pushState(null, 'doctorDownApp');
                            // window.location.href = 'http://xg.mediportal.com.cn/health/web/app/downDoctor.html?a=1';
                            window.location.href = 'http://xg.mediportal.com.cn/health/web/app/downloadDoctorApp.html?a=1';
                        }
                    }
                }]
            },
            showConfirm: false,
            confirmDesr: ''
        }
    },
    render: function() {
        return (
            <div className="text-center">
                <DocumentTitle title="注册"/>
                <div className="weui_cells weui_cells_form m-t-md">
                    <div className="weui_cell">
                        <div className="weui_cell_bd weui_cell_primary">
                            <input ref="phone" className="weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码" valueLink={this.linkState('phone')}/>
                        </div>
                    </div>
                    <div className="weui_cell weui_vcode">
                        <div className="weui_cell_bd weui_cell_primary">
                            <input ref="code" className="weui_input" type="text" placeholder="请输入短信验证码" valueLink={this.linkState('code')} />
                        </div>
                        <div className="weui_cell_ft">
                            <button className="weui_btn weui_btn_mini weui_btn_default m-t-xs m-b-xs m-r-xs" onClick={this.funGetSmsCode} disabled={!this.state.phone||this.state.phone.length<11||this.state.time>0}>{this.state.time?this.state.time+'秒倒计时结束':'获取验证码'}</button>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_bd weui_cell_primary">
                            <input ref="pwd" className="weui_input" type="text" placeholder="请输入密码" valueLink={this.linkState('pwd')}/>
                        </div>
                    </div>
                </div>
                <div className="p-md">
                    <button className="weui_btn weui_btn_primary" disabled={!this.state.phone||this.state.phone.length<11||!this.state.code||this.state.code.length<4||!this.state.pwd||this.state.pwd.length<6} onClick={this.funSingup}>提交</button>
                </div>
                <div className="text-center">
                    收不到验证码？<a href="javascript:void(0)" className="text-underline text-green" onClick={this.funGetVoiceCode}>试试语音获取</a>
                </div>
                 <Confirm 
                    show={this.state.showConfirm}
                    title={this.state.confirm.title} 
                    buttons={this.state.confirm.buttons}>
                        {this.state.confirmDesr}
                </Confirm>
            </div>
        )
    }
})
