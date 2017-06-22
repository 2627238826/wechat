'use strict';

require('./storeDetails.css');

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../components/ApiFactory.js');


module.exports = React.createClass({
    //初始化
    getInitialState: function() {
        return {
            storeDetailData:[],
            activityList:[],
            relevantGoods:[],
            code:0
        }
    },
    componentDidMount: function() {
        var params = this.props.params;
        if(!params.code || params.code == 0){
            this.funAplyUser();
        }else {
            this.funChackBindWechat();
        }
        this.setState({
            params: params
        });
        Tools.hackWehcatTitle();
    },
    // 绑定用户
    funAplyUser: function(order) {
        var url = 'storeDetails/' + (this.props.params.access_token||0)+'/'+this.props.params.id;
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
                 console.log(_data+'1111111111111111111111111111111111111111111');
                // 已绑定
                if (_data.wechatStatus == '2') {
                    var param = {
                        access_token: _data.access_token
                    };
                    _that.props.params.access_token = _data.access_token;
                    _that.setState({
                        code: _that.props.params.code,
                    })
                    _that.funGetStoreDetailData(param);

                } // 未绑定
                else if (_data.wechatStatus == '1') {
                    _that.props.history.pushState(null, "/siginAndSigup/1/0/score009/" + _that.props.params.code)
                }
            }
        })
    },
    funGetStoreDetailData:function(param){
        // 获取药店购药提醒详情
        var _that = this;
        var params = this.props.params;
        (function getStoreDetailData() {
            Tools.fetch({
                url: ApiFactory.patient.getReminder,
                data: {
                    access_token: param.access_token,
                    id: params.id,
                    latitude:'',
                    longitude:''
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _that.setState({
                        storeDetailData: _data,
                        activityList:_data.activityList ||[],
                        relevantGoods:_data.relevantGoods ||[]
                    })
                }
            })
        })();
    },
    goPrivilegeState:function () {
        var _that = this;
        _that.props.history.pushState(null, "/privilegeState/"+_that.props.params.access_token+"/"+_that.props.params.id)
    },
    downApp:function () {
         location.href= window.location.protocol+"//"+ window.location.host +"/health/web/app/downPatient.html?winzoom=1";
        //location.href= window.location.protocol+"//"+ window.location.host +"/drug/web/dev/content/htmlPages/downDrugStore.html";
    },

    render: function() {
        var _this =this;
        return (
            <div>
                <DocumentTitle title="药店详情"/>
                {this.state.code ==0?'':
                    <div>
                        <div className="weui_cells store_storehead store_mt0">
                            <a className="weui_cell">
                                <div className="weui_cell_hd store_mr10">
                                    <img src={this.state.storeDetailData.drugStorelogo} alt="icon" className="store_storeimg"></img>
                                </div>
                                <div className="weui_cell_bd weui_cell_primary store_storename store_textNowrap">
                                    <p className={this.state.storeDetailData.medicalInsurance==1&&this.state.storeDetailData.doorService==1?"store_storeFont14 store_textNowrap store_w54 store_mt2 store_floatl":"store_storeFont14 store_textNowrap store_w70 store_mt2 store_floatl"}>{this.state.storeDetailData.drugStoreName}</p>
                                    {this.state.storeDetailData.medicalInsurance==1?<span className="store_ybState store_ml5">医保</span>:''}
                                    {this.state.storeDetailData.doorService==1?<span className="store_syState store_ml5">送药</span>:''}
                                    <br/>
                                    <p className="store_storeFont12 store_mt5">{this.state.storeDetailData.businessText}</p>
                                </div>
                                <div className="weui_cell_ft">
                                    {this.state.storeDetailData.existsPubAcct ==0?'':<div className="store_storeCaht" onClick={_this.downApp}></div>}
                                    {this.state.storeDetailData.existsPubAcct ==0?'':<span className="store_storeFont14 store_storeColorW">在线咨询</span>}
                                </div>
                            </a>
                        </div>

                        <div className="weui_cells store_storehead store_mt0">
                            <a className="weui_cell store_storeCellB" href="javascript:;">
                                <div className="weui_cell_hd store_mr10">
                                    <div className="store_storeLocaltion"></div>
                                </div>
                                <div className="weui_cell_bd weui_cell_primary store_storename store_textNowrap">
                                    {!this.state.storeDetailData.address?<p className="store_storeFont14 store_storeColorG store_textNowrap">未填写联系地址</p>:<p className="store_storeFont14 store_storeColorB store_textNowrap">{this.state.storeDetailData.address}</p>}
                                </div>
                                <div className="weui_cell_ft"></div>
                            </a>

                            <a className="weui_cell store_storeCellB" href={!this.state.storeDetailData.contactPhone?'javascript:;':'tel:'+this.state.storeDetailData.contactPhone}>
                                <div className="weui_cell_hd store_mr10">
                                    <div className="store_storePhone"></div>
                                </div>
                                <div className="weui_cell_bd weui_cell_primary store_storename">
                                    {!this.state.storeDetailData.contactPhone?<p className="store_storeFont14 store_storeColorG">未填写联系电话</p>:<tel className="store_storeFont14 store_storeColorB">{this.state.storeDetailData.contactPhone}</tel>}
                                </div>
                                <div className="weui_cell_ft"></div>
                            </a>

                            <a className="weui_cell store_storeCellB" href="javascript:;">
                                <div className="weui_cell_hd store_mr10">
                                    <div className="store_storeTime"></div>
                                </div>
                                <div className="weui_cell_bd weui_cell_primary store_storename">
                                    {!this.state.storeDetailData.openingTime?<p className="store_storeFont14 store_storeColorG">未设置营业时间</p>:<p className="store_storeFont14 store_storeColorB">{this.state.storeDetailData.openingTime}-{this.state.storeDetailData.closingTime}</p>}
                                </div>
                                <div className="weui_cell_ft"></div>
                            </a>
                        </div>

                        {this.state.activityList.length <=0?'':<div className="weui_cells weui_cells_access">
                            <a className="weui_cell" onClick={_this.goPrivilegeState}>
                                <div className="weui_cell_hd top0">
                                    <div className="store_storeFavorable"></div>
                                </div>
                                <div className="weui_cell_bd weui_cell_primary store_ml35 store_textNowrap">
                                    <strong className="store_storeFont16">优惠活动</strong><span className="store_storeColorO">（共{this.state.activityList.length}个活动）</span>
                                    {
                                        this.state.activityList.map(function (item, index) {
                                            if(index<2){
                                                var startDate =item.startDate.split('-')[1] +'.'+item.startDate.split('-')[2];
                                                var endDate =item.endDate.split('-')[1] +'.'+item.endDate.split('-')[2];
                                                return(
                                                    <p className="store_storeFont12 store_storeColorB store_mt5 store_textNowrap">{startDate}-{endDate} {item.activityName}</p>
                                                )
                                            }
                                        })
                                    }
                                </div>
                                <div className="weui_cell_ft"></div>
                            </a>
                        </div>}


                        <div className="store_storeFont14 store_storeColorG store_mt5 store_ml20">药品信息</div>
                        <div className="weui_cells store_mt5">
                            <a className="weui_cell">
                                <div className="weui_cell_hd store_mr10">
                                    <img src={this.state.storeDetailData.goodsImageUrl} alt="icon" className="store_storeimg"></img>
                                </div>
                                <div className="weui_cell_bd weui_cell_primary store_textNowrap">
                                    <p className="store_storeFont14 store_storeColorB store_mt5 store_wordwrap">{this.state.storeDetailData.title}</p>
                                    <p className="store_storeFont12 store_storeColorG store_mt5 store_textNowrap">{this.state.storeDetailData.specification} {this.state.storeDetailData.packSpecification}</p>
                                    <p className="store_storeFont12 store_storeColorG store_mt5 store_textNowrap">{this.state.storeDetailData.manufacturer}</p>
                                </div>
                                <div className="weui_cell_ft">
                                    <strong className="store_storeFont20 store_storeColorB">{Number(this.state.storeDetailData.price ||0)==0?'':'￥'+Number(this.state.storeDetailData.price)/100}</strong>
                                    <p className="store_storeFont14 store_storeColorG"><del>{Number(this.state.storeDetailData.originalPrice ||0)==0?'':'￥'+Number(this.state.storeDetailData.originalPrice)/100}</del></p>
                                </div>
                            </a>
                            <p className={this.state.storeDetailData.certState ==9 || this.state.storeDetailData.hasPoints ==1?"store_mb15":''}>
                                {this.state.storeDetailData.certState ==9 || this.state.storeDetailData.hasPoints ==1?<span className="store_ml20 store_mr20 store_storeFont12 store_storeColorO">特色标签:</span>:''}
                                {this.state.storeDetailData.certState ==9?<span className="store_ml5 store_certState">厂家认证</span>:''}
                                {this.state.storeDetailData.hasPoints ==1?<span className="store_ml5 store_certState">积分</span>:''}
                            </p>
                        </div>

                        {this.state.relevantGoods.length>0?<div className="store_storeFont14 store_storeColorG store_mt5 store_ml20">为你推荐</div>:''}
                        <div className="weui_cells store_mt5">
                            {
                                this.state.relevantGoods.map(function (item, index) {
                                    return (
                                        <div className="store_storeBt">
                                            <a className="weui_cell">
                                                <div className="weui_cell_hd store_mr10">
                                                    <img src={!item.imageUrl?'http://default.test.file.dachentech.com.cn/drug/drugImage_3x.png':item.imageUrl} alt="icon" className="store_storeimg"></img>
                                                </div>
                                                <div className="weui_cell_bd weui_cell_primary store_textNowrap">
                                                    <p className="store_storeFont14 store_storeColorB store_mt5 store_wordwrap">{item.title}</p>
                                                    <p className="store_storeFont12 store_storeColorG store_mt5 store_textNowrap">{item.specification} {item.packSpecification}</p>
                                                    <p className="store_storeFont12 store_storeColorG store_mt5 store_textNowrap">{item.manufacturer}</p>
                                                </div>
                                                <div className="weui_cell_ft">
                                                    <strong className="store_storeFont20 store_storeColorB">{Number(item.price ||0)==0?'':'￥'+Number(item.price)/100}</strong>
                                                    <p className="store_storeFont14 store_storeColorG"><del>{Number(item.originalPrice ||0)==0?'':'￥'+Number(item.originalPrice)/100}</del></p>
                                                </div>
                                            </a>
                                            <p className={item.certState ==9 || item.hasPoints ==1?"store_mb15":''}>
                                                {item.certState ==9 || item.hasPoints ==1?<span className="store_ml20 store_mr20 store_storeFont12 store_storeColorO">特色标签:</span>:''}
                                                {item.certState ==9?<span className="store_ml5 store_certState">厂家认证</span>:''}
                                                {item.hasPoints ==1?<span className="store_ml5 store_certState">积分</span>:''}
                                            </p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                </div> }
            </div>
        )
    }
})
