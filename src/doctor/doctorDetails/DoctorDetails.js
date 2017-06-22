'use strict';

require('./DoctorDetails.css');

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../components/ApiFactory.js');


module.exports = React.createClass({
    // 订单详情
    funGoOrderDetail: function(item, e) {
        // 没有开通
        if (!item.status) return;

        // 图文咨询／电话咨询
        if (item.packType == 1 || item.packType == 2) {
            this.props.history.pushState(null, 'doctorOrderInfo/' + item.packType + '/' + this.props.params.doctorId);
        }

        // 健康关怀
        else if (item.packType == 3) {
            this.props.history.pushState(null, 'carePlanList/' + item.packType + '/' + this.props.params.doctorId);
        }

    },
    getInitialState: function() {

        var _that = this;
        var params = this.props.params;

        // 获取医生基本信息
        (function funGetDoctorBasicInfo(param) {
            Tools.fetch({
                url: ApiFactory.doctor.basicInfo,
                data: {
                    doctorId: param.doctorId || ''
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _that.setState({
                        basicInfo: _data || {}
                    })

                    setTimeout(function() {
                        Tools.hackWehcatTitle();
                    }, 100);
                    
                    Tools.weixin.init().then(function (_wx) {
                        _wx.ready(function () {
                            //分享给朋友
                            _wx.onMenuShareAppMessage({
                                title: _data.name, // 分享标题
                                desc:  _data.departments+" "+_data.hospital, // 分享描述
                                link: _data.doctorPageURL, // 分享链接
                                imgUrl: _data.headPicFileName, // 分享图标
                            });
                            //分享到朋友圈
                            _wx.onMenuShareTimeline({
                                title: _data.name, // 分享标题
                                link: _data.doctorPageURL, // 分享链接
                                imgUrl: _data.headPicFileName, // 分享图标
                            });
                            /*//分享到QQ
                            _wx.onMenuShareQQ({
                                title: _data.name, // 分享标题
                                desc:  _data.departments+" "+_data.hospital, // 分享描述
                                link: _data.doctorPageURL, // 分享链接
                                imgUrl: _data.headPicFileName, // 分享图标
                            });
                            //分享到腾讯微博
                            _wx.onMenuShareWeibo({
                                title: _data.name, // 分享标题
                                desc:  _data.departments+" "+_data.hospital, // 分享描述
                                link: _data.doctorPageURL, // 分享链接
                                imgUrl: _data.headPicFileName, // 分享图标
                            });
                            //分享到QQ空间
                            _wx.onMenuShareQZone({
                                title: _data.name, // 分享标题
                                desc:  _data.departments+" "+_data.hospital, // 分享描述
                                link: _data.doctorPageURL, // 分享链接
                                imgUrl: _data.headPicFileName, // 分享图标
                            });*/
                        })
                    })
                }
                
            })
        })({ doctorId: params.doctorId });

        // 获取医生获取个人介绍
        (function funGetDoctorIntro(param) {
            Tools.fetch({
                url: ApiFactory.doctor.getIntro,
                data: {
                    userId: param.doctorId || ''
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _that.setState({
                        intro: _data || {}
                    })
                }
            })
        })({ doctorId: params.doctorId });

        // 获取服务套餐
        (function funGetDoctorIntro(param) {
            Tools.fetch({
                url: ApiFactory.query,
                data: {
                    doctorId: param.doctorId || '',
                    status: 1
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _data = funSetQuery(_data);
                    _that.setState({
                        query: _data || []
                    })
                }
            })
        })({ doctorId: params.doctorId });

        // 获取医生评价
        (function funGetDoctorTopSix(param) {
            Tools.fetch({
                url: ApiFactory.doctor.getTopSix,
                data: {
                    doctorId: param.doctorId || ''
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _that.setState({
                        topSix: _data || {
                            evaluateStatList: []
                        }
                    })
                }
            })
        })({ doctorId: params.doctorId });


        // 生产服务套餐
        function funSetQuery(_data) {
            var _array = [{
                id: '',
                name: '图文咨询',
                packType: 1,
                price: '',
                status: 0,
                timeLimit: ''
            }, {
                id: '',
                name: '电话咨询',
                packType: 2,
                price: '',
                status: 0,
                timeLimit: ''
            }, {
                id: '',
                name: '健康关怀',
                packType: 3,
                price: '',
                status: 0,
                timeLimit: ''
            }];

            var healthPlanPrice = 99999999999999;

            for (var i = 0; i < _data.length; i++) {

                for (var j = 0; j < _array.length; j++) {

                    if (_data[i].packType == _array[j].packType) {


                        if (_data[i].packType == 3 && healthPlanPrice > _data[i].price) {

                            healthPlanPrice = _data[i].price;

                            _array[j].id = _data[i].id;
                            _array[j].price = _data[i].price;
                            _array[j].status = _data[i].status;
                            _array[j].timeLimit = _data[i].timeLimit;

                        } else if(_data[i].packType != 3){
                            
                            _array[j].id = _data[i].id;
                            _array[j].price = _data[i].price;
                            _array[j].status = _data[i].status;
                            _array[j].timeLimit = _data[i].timeLimit;

                        }


                    }
                }
            }

            return _array;
        };

        return {
            basicInfo: {},
            query: [],
            intro: {},
            topSix: {
                evaluateStatList: []
            }
        }
    },
    componentDidMount: function() {
        // Tools.hackWehcatTitle();
    },
    render: function() {

        var _that = this;

        return (
            <div>
                <DocumentTitle title={this.state.basicInfo.name||''}/>

                <div className="text-center text-white clearfix doc_details_bg">
                    <div className="m-r-sm text-right p-t-b-xs" style={{fontSize: '16px', marginBottom: '-8px'}}>
                        <Link className="text-white" to={"selectPatient/"+this.props.params.doctorId+"/0/0"}>报到</Link>
                    </div>
                    <div>
                        <img className="logo-max round inline-block"
                             style={{'boxShadow': '0px 0px 0px 3px rgba(255,255,255,0.3)'}}
                             src={this.state.basicInfo.headPicFileName?this.state.basicInfo.headPicFileName:'http://default.test.file.dachentech.com.cn/user/default.jpg'}/>
                    </div>
                    <div className="m-t-xs ">

                            <div className="text-md">{this.state.basicInfo.title}
                                {
                                    //<small>医生号：{this.state.basicInfo.doctorNum}</small>
                                }
                            </div>

                        <div
                            className="text-sm">{this.state.basicInfo.departments}&nbsp;&nbsp;{this.state.basicInfo.hospital}&nbsp;&nbsp;{this.state.basicInfo.is3A == 1 ? (
                            <span className="r p-xxxs text-xs"
                                  style={{'boxShadow': '0px 0px 0px 1px rgba(255,255,255,0.3)'}}>三甲</span>) : ''}</div>
                    </div>
                    <div className="p-t-b-xs m-b-xs">
                        {
                            this.state.basicInfo.groupName ? (
                                <Link className="text-white" to={"groupDetails/"+this.state.basicInfo.groupId}>
                                    <div className="doctor_group_label">
                                        {
                                            this.state.basicInfo.isConsultationMember ? (
                                                <span className="vip success"></span>) : ''
                                        }
                                        <span className="group_name">{this.state.basicInfo.groupName}</span>
                                    </div>
                                </Link>

                            ) : ''
                        }
                    </div>
                </div>
                <div className="p-t-b-xs bg-white clearfix b-b b-grey">
                    {
                        (function () {

                            return this.state.query.map(function (item, index) {

                                var IconClassName = {1:'product_imgeText',2:'product_phoneCall',3:'product_healthCare'}[item.packType];

                                return (
                                    <div className="pull-left w-precent-33 text-center b-r b-grey"
                                         onClick={_that.funGoOrderDetail.bind(this,item)}>
                                        <div className="weui_grid_icon">
                                            <i className={(item.status==1?'icon ok ':'icon ') + IconClassName}></i>
                                        </div>
                                        <p className="weui_grid_label text-grey">
                                            {item.name}
                                        </p>

                                        <p className="weui_grid_label text-grey">
                                            {
                                                item.status == 1 ? {
                                                    1:(<span className="text-orange">¥{item.price / 100}</span>),
                                                    2:(<span className="text-orange">¥{item.price / 100}/{item.timeLimit}分钟</span>),
                                                    3:(<span className="text-orange">¥{item.price / 100}起</span>)
                                                }[item.packType]
                                                :(<span>未开通</span>)
                                            }
                                        </p>
                                    </div>
                                )
                            })

                        }.bind(this))()
                    }
                </div>
                <div className="weui_panel weui_panel_access">
                    <div className="weui_panel_hd weui_cells_access clear text-md">
                        <div className="pull-left text-dark ">
                            医生详情
                        </div>
                        <span className="weui_cell_ft pull-right">
                            <Link
                                to={"doctorIntro/"+this.props.params.doctorId} className="text-gray">
                                查看全部
                            </Link>

                        </span>
                    </div>
                    <div className="weui_panel_bd ">
                        <div className="weui_media_box weui_media_text">
                            <p className="weui_media_desc">{this.state.intro.introduction || '暂无'}</p>
                        </div>
                    </div>
                </div>
                {
                    this.state.topSix.userNum > 0 ? (
                        <div className="weui_panel weui_panel_access">
                            <div className="weui_panel_hd weui_cells_access clear text-md">
                                <div className="pull-left ">
                                    评分：<span
                                    className="text-orange">{this.state.topSix.goodRate || 0}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    就诊量：{this.state.intro.cureNum || 0}
                                </div>
                                <span className="weui_cell_ft pull-right">
                                    <Link
                                        to={"doctorEvaluate/"+this.props.params.doctorId} className="text-gray">
                                        {this.state.topSix.userNum || 0}条评价
                                    </Link>

                                </span>
                            </div>
                            <div className="weui_panel_bd ">
                                <div className="weui_media_box weui_media_text">
                                    {
                                        this.state.topSix.evaluateStatList.map(function (item, index) {
                                            return (
                                                <span className="evaluate_marker">{item.name}&nbsp;
                                                    <small className="text-green">+{item.count || 0}</small></span>
                                            )
                                        })

                                    }
                                </div>
                            </div>
                        </div>
                    ) : ''
                }
            </div>
        )
    }
})
