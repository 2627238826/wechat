'use strict';

require('./privilegeState.css');
var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../../components/ApiFactory.js');

module.exports = React.createClass({
    //初始化
    getInitialState: function() {
        return {
            priDetailData:[],
            activityListDetail:[],
            week:[]
        }
    },
    componentDidMount: function() {
        var _that = this;
        var params = this.props.params;
        // 获取药店购药提醒详情
        (function getStoreDetailData() {
            Tools.fetch({
                url: ApiFactory.patient.getReminder,
                data: {
                    access_token: params.access_token,
                    id: params.id,
                    latitude:'',
                    longitude:''
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _that.setState({
                        storeDetailData: _data,
                        activityListDetail:_data.activityList ||[],
                        week:_data.activityList[0].week ||[]
                    })
                }
            })
        })();
        Tools.hackWehcatTitle();
    },
    render: function() {
        var _this =this;
        return (
            <div>
                <DocumentTitle title="优惠说明"/>
                {
                    this.state.activityListDetail.map(function (item, index) {
                        var activityTime = item.activityTime.split("\n")[1];
                        return(
                           <div className={index ==0?'weui_cells store_mt0':'weui_cells store_mt10'}>
                            <a className="weui_cell store_priCellB" href="javascript:;">
                                <div className="weui_cell_hd store_mr10">
                                    <div className={item.inActivityString=='活动中'?'store_priFavorable':'store_priFavorableStop'}></div>
                                </div>
                                <div className="weui_cell_bd weui_cell_primary store_wordwrap">
                                    <p className="store_priFont14 store_priColorB"><span>{item.activityName}</span></p>
                                </div>
                                <div className="weui_cell_ft">
                                    <span className={item.inActivityString=='活动中'?'store_priFont14 store_priColorG':'store_priFont14 store_priColorGr'}>{item.inActivityString}</span>
                                </div>
                            </a>
                            <a className="weui_cell store_priCellB" href="javascript:;">
                                <div className="weui_cell_bd weui_cell_primary store_wordwrap">
                                    <p className="store_priFont12 store_priColorGr">使用时间</p>
                                    <p className="store_priFont14 store_priColorB">
                                        {activityTime}
                                    </p>
                                </div>
                            </a>
                            <a className="weui_cell store_priCellB store_priBt" href="javascript:;">
                                <div className="weui_cell_bd weui_cell_primary store_wordwrap">
                                    <p className="store_priFont12 store_priColorGr">使用规则</p>
                                    <p className="store_priFont14 store_priColorB">{item.serviceRule}</p>
                                </div>
                            </a>
                            <a className="weui_cell store_priCellB store_priBt" href="javascript:;">
                                <div className="weui_cell_bd weui_cell_primary store_wordwrap">
                                    <p className="store_priFont12 store_priColorGr">有效期</p>
                                    <p className="store_priFont14 store_priColorB">{item.startDate}至{item.endDate}</p>
                                </div>
                            </a>
                        </div>
                        )
                    })
                }
            </div>
        )
    }
})
