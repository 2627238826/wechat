'use strict';

require('./feedback.css');
var React = require('react');
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../components/ApiFactory.js');


module.exports = React.createClass({

    getInitialState: function() {
        Tools.weixin.init().then(function (_wx) {
            _wx.ready(function () {
                _wx.hideOptionMenu();
            })
        });

        return {
            content: '',
            phone: '',
            isShowToast: false,
        };
    },

    // 获得授权
    funAplyUser: function() {
        var url = 'feedback';
        Tools.weixin.applyGetUserInfo({
            state: url,
        })
    },

    componentDidMount: function() {
        var params = this.props.params;
        // 没有获取微信code
        if (!params.code || params.code == 0) {
            this.funAplyUser();
        }
        Tools.hackWehcatTitle();
    },

    // 提交
    handleSubmit: function () {
        var content = this.state.content;
        var phone = this.state.phone;

        if (!content) {
            Tools.tipDialog('反馈内容不能为空');
            return ;
        }

        if (!phone) {
            Tools.tipDialog('手机号码不能为空');
            return ;
        }

        Tools.fetch({
            url: ApiFactory.feedback,
            data: {
                code: this.props.params.code,
                phone: phone,
                content: content,
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                this.showToast();
                window.setTimeout(function() {
                    Tools.weixin.init().then(function (_wx) {
                        _wx.ready(function () {
                            _wx.closeWindow();
                        })
                    });
                }, 1000);
            }
        }.bind(this));
    },

    // 显示Toast提示
    showToast: function () {
        this.setState({
            isShowToast: true,
        });

        this.toastTimer = window.setTimeout(function () {
            this.setState({
                isShowToast: false,
            });
        }.bind(this), 1000);
    },

    // 处理输入内容
    handleInput: function (type, event) {
        var temp = {};
        temp[type] = type == 'phone' ? event.target.value.replace(/^[^1]|\D*$/g, '') : event.target.value;
        this.setState(temp);
    },

    componentWillUnmount: function () {
        this.toastTimer && window.clearTimeout(this.toastTimer);
    },

    render: function() {
        var params = this.props.params;
        return (
            <div className="advice-feedback" style={styles.container}>
                {
                    params.code && params.code != 0 &&
                        <div>
                            <DocumentTitle title="意见反馈" />

                            <div style={styles.title}>
                                意见反馈
                            </div>

                            <div style={styles.content}>
                                <div style={styles.textCon} className="weui_cells weui_cells_form">
                                    <div className="weui_cell">
                                        <div className="feedback-flex">
                                            <textarea
                                                onChange={this.handleInput.bind(this, 'content')}
                                                value={this.state.content}
                                                style={styles.background}
                                                className="weui_textarea"
                                                maxLength={100}
                                                placeholder="我们懂得聆听，知错就改，您的意见是"
                                                rows="6" />
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.background} className="weui_cells">
                                    <div className="weui_cell">
                                        <div className="feedback-flex">
                                            <input
                                                type="number "
                                                onChange={this.handleInput.bind(this, 'phone')}
                                                value={this.state.phone}
                                                className="weui_input"
                                                maxLength={11}
                                                placeholder="请留下手机号，以便我们联系您（必填）" />
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.marginTop}>
                                    <a onClick={this.handleSubmit.bind(this)} className="weui_btn weui_btn_primary">提交</a>
                                </div>

                                <div style={styles.marginTop}>
                                    客服电话：<span style={{margin: '0 2px 0 0', color: '#4C7CB1'}}>400-618-8886</span>(工作时间9:00-19:00)
                                </div>
                            </div>

                            <div id="toast" style={{display: this.state.isShowToast ? 'block' : 'none'}}>
                                <div className="weui_mask_transparent"></div>
                                <div className="weui_toast">
                                    <i className="weui_icon_toast" />
                                    <p className="weui_toast_content">提交成功</p>
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }

});

var styles = {
    container: {
        width: '100%',
        height: '100%',
        background: '#f1f1f1'
    },
    title: {
        background: '#fff',
        fontSize: '18px',
        padding: '15px',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    content: {
        padding: '15px',
    },
    background: {
        background: '#e0e0e0',
    },
    textCon: {
        background: '#e0e0e0',
        margin: 0
    },
    marginTop: {
        marginTop: '10px'
    }
};
