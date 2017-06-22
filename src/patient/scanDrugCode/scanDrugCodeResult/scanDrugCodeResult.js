'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');

var ApiFactory = require('./../../../components/ApiFactory.js');



module.exports = React.createClass({
    componentDidMount: function() {
        wx.ready(function() {
            var url = 'http://' + window.location.host + window.location.pathname + '#/scanDrugCode/1/0/0';

            wx.onMenuShareTimeline({
                title: '扫药送积分，免费问医生', // 分享 标 题
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
    getInitialState: function() {

        var _this = this;
        var params = this.props.params;
        return {
            resultCode: _this.props.params.resultCode,
            resultMsg: _this.props.params.resultMsg
        }
    },
    //打开扫码器
    funOpenScaner: function() {
        var _this = this;
        var params = this.props.params;
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
            _this.setState({ resultCode: rsp.resultCode });

            if (rsp.resultCode == 1) {
                resultMsg = rsp.data.getPoints;
                _this.setState({ resultMsg: resultMsg });
            } else {
                resultMsg = rsp.resultMsg;
                _this.setState({ resultMsg: resultMsg });
            }
            // _this.props.history.pushState(null, "/scanDrugCodeResult/" + rsp.resultCode + "/" + resultMsg + "/" + _this.props.params.access_token + "/" + _this.props.params.userId)

        })

    },
    render: function() {

        var _this = this;
        console.log(this.state.resultCode);
        return (<div>
            <DocumentTitle title="扫码结果" />  
                <div className="scan-code-error">
                    <div className="scan-code-error-img">
                    {_this.state.resultCode != 1?
                        <img src="http://group.test.file.dachentech.com.cn//o_1b4dkb4f412ck1scm1ialr7s1ualf?100" alt=""/>
                        :
                        <img src="http://drug.test.file.dachentech.com.cn//o_1b4j0tkgf152c1fam1r88omvo3k17" alt=""/>       
                          
                    } 
                    </div>
                    <div className="scan-code-error-msg">
                      
                        {_this.state.resultCode == 1?
                            <div className="">
                                <h3 className="">恭喜您，扫码成功！</h3>
                                <h3 className="">获得 <span className=""> +{this.state.resultMsg} </span> 积分奖励</h3>
                                <div onClick={_this.funOpenScaner}  className="scan-drug-code-continue"> 继续扫码 </div>
                            </div>
                           
                            :
                            <h3 className="">{this.state.resultMsg}</h3>
                        }
                        
                    </div> 
                </div> 
            </div>)
    }
})
