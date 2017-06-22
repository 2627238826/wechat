'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
require('./scoreSearch.css');

var ApiFactory = require('./../../components/ApiFactory.js');




module.exports = React.createClass({

    // 绑定用户
    funAplyUser: function(order) {
        var url = 'scoreSearch/' + this.props.params.userId + '/' + (this.props.params.access_token || 0);
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
                // console.log(_data);
                // 已绑定
                if (_data.wechatStatus == '2') {
                    var param = {
                        userId: _data.userId,
                        access_token: _data.access_token
                    };
                    _that.props.params.access_token = _data.access_token;
                    _that.props.params.userId = _data.userId;
                    _that.funGetUserGoodsPointsList(param);

                } // 未绑定
                else if (_data.wechatStatus == '1') {
                    _that.props.history.pushState(null, "/siginAndSigup/1/0/score009/" + _that.props.params.code)
                }
            }
        })
    },
    //获取积分列表
    funGetUserGoodsPointsList: function(param) {

        var _this = this;

        Tools.fetch({
            url: ApiFactory.patient.getUserGoodsPointsList,
            data: {
                userId: param.userId || '',
                access_token: param.access_token
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            // console.log(_data);
            if (_data) {
                _this.setState({
                    ScoreList: _data || {},
                    isScoreListLoad: true
                })


            }
        })
    },
    getInitialState: function() {

        var _this = this;
        var params = this.props.params;
        return {
            ScoreList: {
                userGoodsPointsList: []
            },
            isScoreListLoad: false
        }
    },
    componentDidMount: function() {
        var params = this.props.params;

        // 没有获取微信code
        if (!params.code || params.code == 0) {
            this.funAplyUser();
        } else {
            this.funChackBindWechat();
        }

        this.setState({
            params: params
        });
        Tools.hackWehcatTitle();

    },
    //打开扫码器
    funOpenScaner: function() {
         this.props.history.pushState(null, "/scanDrugCode/1/0/0" )
        // var _this = this;
        // // Tools.weixin.scanQRCode();
        // wx.scanQRCode({
        //     needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        //     scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        //     success: function(res) {
        //         var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        //         _this.setState({ drugCode: result.split(",")[1] });
        //         _this.funScanDrugCodePoints();

        //     }
        // });
    },
    //检查药监码信息
    funScanDrugCode: function() {
        var _this = this;
        Tools.fetch({
            url: ApiFactory.patient.scanDrugCode,
            data: {
                drugCode: _this.state.drugCode,
                access_token: _this.props.params.access_token
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                _this.funScanDrugCodePoints();
            }
        })

    },
    //检查药监码是否可用
    funScanDrugCodePoints: function() {
        var _this = this;
        Tools.fetch({
            url: ApiFactory.patient.scanDrugCodePoints,
            data: {
                drugCode: _this.state.drugCode,
                 // drugCode: '81170220119325294120',
                access_token: _this.props.params.access_token,
                userId: _this.props.params.userId
            }
        }).then(function(rsp) {
            var resultMsg = '';
            if (rsp.resultCode == 1) {
                var param = {
                    userId: _this.props.params.userId,
                    access_token: _this.props.params.access_token
                };
                 _this.funGetUserGoodsPointsList(param);
            } else {
                resultMsg = rsp.resultMsg;
                _this.props.history.pushState(null, "/scanDrugCodeResult/" + rsp.resultCode + "/" + resultMsg+"/"+_this.props.params.access_token+"/"+_this.props.params.userId);  
            }
        })
    },
    funGetDrugCode: function() {
        //alert(this.state.drugCode);
       
    },
    render: function() {
        var _this = this;

        var isNoticeShow = true;
        // console.log(this.state.ScoreList.userGoodsPointsList.length + " " + this.state.isScoreListLoad);
        if (this.state.ScoreList.userGoodsPointsList.length == 0 && this.state.isScoreListLoad) {
            isNoticeShow = false;
        }  
        return (<div>
              <DocumentTitle title="我的积分" />  
              { isNoticeShow ?
                    <div className="score-lists">
                    {
                        this.state.isScoreListLoad?
                            <div className="score-scaner " onClick={_this.funOpenScaner} ><img className="swing" src="http://group.test.file.dachentech.com.cn//o_1b4aujeok1h6e2n8co12l7193lf?100" alt="扫一扫"/></div>
                        :''
                    }
                    
                    <div className="bd score-list-bd">

                      { this.state.ScoreList.userGoodsPointsList.map( function ( item, index ) {
                          return (
                          <div className="weui_panel weui_panel_access">
                            <div className="weui_panel_bd score-bd-title">
                              <a
                                 href="javascript:void(0);"
                                 className="weui_media_box weui_media_appmsg">
                              
                                <div className="weui_media_bd">
                                  <h4 className="weui_media_title">{ item.title }</h4>
                                  <p className="weui_media_desc"> {item.manufacturer} </p>
                                </div>
                                <div className="weui_cell_ft"> <span className="weui_icon_checked score-num">{ item.leftPointsNum } </span>积分 </div>
                              </a>
                            </div>
                            <div className={item.diagnoseInfos.length==0?'hide':''}> 
                                <div className="score-title"> 
                                    <span >使用积分问诊医生</span> 
                                </div>
                                <div className="bg-white  score-doctor-list">
                                
                                    <div className="score-dl-box" style={{width:4*item.diagnoseInfos.length+'rem'}}>
                                        <ul className="m-t-xs">
                                            {item.diagnoseInfos.map(function(doctor,index){  
                                                return(
                                                             <li className="text-center m-b list-style-none w-precent-20 inline-block">
                                                     <a className="text-dark"  href="http://xg.mediportal.com.cn/health/web/app/downPatient.html" ><img
                                                                                src={doctor.headPicFileName?doctor.headPicFileName:'http://default.test.file.dachentech.com.cn/user/default.jpg' }
                                                                                alt=""
                                                                               
                                                                                className="r-circle" />
                                                    <p className="text-md text-ellipsis score-text-ellipsis">
                                                    {doctor.doctorName} </p> 
                                                    <p className="text-sm text-grey text-ellipsis"> {doctor.oncePoints}积分/次 </p>
                                                  </a>
                                                </li>
                                                    )
                                            })
                                            }
                                        </ul>
                                    </div>
                      
                                </div>
                            </div>

                          </div>
                          )
                        } ) }
                    </div>
                  </div> :
                  <div className='score-lists'>
                  <div className="score-scaner " onClick={_this.funOpenScaner} ><img className="swing" src="http://group.test.file.dachentech.com.cn//o_1b4aujeok1h6e2n8co12l7193lf?100" alt="扫一扫"/></div>
                    <div className="">
                      <div claclassNamess="">
                        <div className=" score-search">
                            <img src="http://drug.test.file.dachentech.com.cn//o_1b4l8ta7g12coqi3msk1ql8g4ae" alt="" className=""/>
                          <p>
                            您还没有获得积分， 快去多攒点积分吧！
                          </p>
                        </div>
                        <p className="socre-notiee">
                          温馨提示： 您可以通过到推荐药店购买药品， 来获得该药品的积分。
                        </p>
                      </div>
                    </div>
                  </div> 
              }
            </div>)
    }
})
