'use strict';

require('./../doctorOrderInfo/DoctorOrderInfo.css');
require('./../doctorDetails/DoctorDetails.css');
var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../components/ApiFactory.js');

module.exports = React.createClass({
    getInitialState: function() {

        var _that = this;
        var doctorId = this.props.doctorId;

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
                }
            })
        })({ doctorId: doctorId });

        return {
            basicInfo: {}
        };
    },
    render: function() {
        return (
            <div className="doc_details_bg">
    			<div className="weui_cell p-t-b-sm">
					<div className="weui_cell_hd">
						<img src={this.state.basicInfo.headPicFileName?this.state.basicInfo.headPicFileName:'http://default.test.file.dachentech.com.cn/user/default.jpg'} alt="" className="cover cover-max r-max"/>
					</div>
					<div className="weui_cell_bd weui_cell_primary text-white">
						<h3 className="title text-md">{this.state.basicInfo.name}&nbsp;&nbsp;&nbsp;{
                            // <span className="doctor_nbr_label text-blue">医生号：{this.state.basicInfo.doctorNum}</span>
                        }
                        </h3>
						<p className="summary text-sm text-white">{this.state.basicInfo.title}&nbsp;{this.state.basicInfo.departments}</p>
						<p className="summary text-sm text-white">
							{this.state.basicInfo.groupName}
						</p>
					</div>
					<div className="weui_cell_ft"></div>
				</div>
        	</div>
        )
    }
})
