'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../components/ApiFactory.js');

var OrderHeader = require('./../orderHearder/orderHearder.js');

module.exports = React.createClass({
    // 绑定用户
    funAplyUser: function(order, e) {

        Tools.weixin.applyGetUserInfo({
            state: 'siginAndSigup/' + order.doctorId + '/' + order.id + '/' + order.packType,
            // state: '1231',
        })

    },
    //  // 绑定用户
    // funAplyUser: function(order) {

    //     var url = 'siginAndSigup/' + order.doctorId + '/' + order.id + '/' + order.packType;
    //     Tools.weixin.applyGetUserInfo({
    //         state: url,
    //     })

    // },
    getInitialState: function() {

        var _that = this;
        var params = this.props.params;

        // 获取服务套餐
        (function funGetDoctorIntro(param) {
            Tools.fetch({
                url: ApiFactory.query,
                data: {
                    doctorId: param.doctorId || '',
                    status: 1,
                    packType: 3
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    if (!Array.isArray(_data)) _data = [];

                    _that.setState({
                        plans: _data
                    })
                }
            })
        })({ doctorId: params.doctorId });

        return {
            plans: [],
            basicInfo: {}
        }
    },
    componentDidMount: function() {
        Tools.hackWehcatTitle();
    },
    render: function() {
        var _that = this;

        return (
            <div>
                <OrderHeader doctorId={this.props.params.doctorId}/>
                <div className="weui_cells_access">
                    <div className="weui_panel_hd weui_cells_access clearfix text-md text-dark">
                        计划列表
                    </div>
                    {
                        this.state.plans.map(function (item,index) {
                            return(
                                <div className="weui_cell">
                                    <Link  to={'carePlanDetail/'+item.doctorId+'/'+item.id+'/'+item.packType} className="weui_cell_bd weui_cell_primary w-precent-75">
                                        <h3 className="title text-ellipsis text-dark">{item.name}</h3>
                                        <p className="summary">价格&nbsp;¥{(item.price||0)/100}&nbsp;&nbsp;医生&nbsp;{item.doctorCount||0}位</p>
                                    </Link>
                                    <div className="weui_cell_hd w-precent-25 text-right">
                                        <button className="weui_btn weui_btn_mini weui_btn_primary" onClick={_that.funAplyUser.bind(this,item)}>加入</button>
                                    </div>
                                </div>
                                )
                        })
                    }
                </div>
            </div>
        )
    }
})
