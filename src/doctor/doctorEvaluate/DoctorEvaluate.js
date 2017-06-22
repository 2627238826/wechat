'use strict';

require('./DoctorEvaluate.css');

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../components/ApiFactory.js');


module.exports = React.createClass({

    getInitialState: function () {

        var _that = this;
        var params = this.props.params;

        // 获取医生评价
        (function funGetEvaluationDetail(param) {
            Tools.fetch({
                url: ApiFactory.doctor.getEvaluationDetail,
                data: {
                    doctorId: param.doctorId || ''
                }
            }).then(function (rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    console.log(_data);
                    _that.setState({
                        evaluateStatList: _data.evaluateStatList,
                        evaluateVOList: _data.evaluateVOList
                    })
                }
            })
        })({doctorId: params.doctorId});

        return {
            evaluateStatList: [],
            evaluateVOList: []
        }
    },

    render: function () {

        var _that = this;

        return (
            <div>
                <div className="weui_panel weui_panel_access">
                    <div className="weui_panel_bd ">
                        <div className="weui_media_box weui_media_text">
                            {
                                this.state.evaluateStatList.map(function (item, index) {
                                    return (
                                        <span className="evaluate_marker">{item.name}&nbsp;
                                            <small className="text-green">+{item.count || 0}</small></span>
                                    )
                                })

                            }
                        </div>
                    </div>
                </div>

                <div className="weui_panel weui_panel_access">
                    {
                        this.state.evaluateVOList.map(function (item, index) {
                            return (
                                <div className="weui_media_box weui_media_appmsg">
                                    <div className="weui_media_bd">
                                        <p className="text-md">{item.userName}<span className="pull-right text-gray">{item.createTime}</span></p>
                                        <p className="text-md">{item.description}</p>
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
