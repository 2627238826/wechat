'use strict';

require('./DoctorIntro.css');

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../components/ApiFactory.js');


module.exports = React.createClass({
    getInitialState: function () {

        var _that = this;
        var params = this.props.params;

        // 获取医生基本信息
        (function funGetDoctorBasicInfo(param) {
            Tools.fetch({
                url: ApiFactory.doctor.basicInfo,
                data: {
                    doctorId: param.doctorId || ''
                }
            }).then(function (rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _that.setState({
                        basicInfo: _data || {}
                    })
                    Tools.hackWehcatTitle();
                }
            })
        })({doctorId: params.doctorId});

        // 获取医生获取个人介绍
        (function funGetDoctorIntro(param) {
            Tools.fetch({
                url: ApiFactory.doctor.getIntro,
                data: {
                    userId: param.doctorId || ''
                }
            }).then(function (rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _that.setState({
                        intro: _data || {}
                    })
                }
            })
        })({doctorId: params.doctorId});



        return {
            basicInfo: {},
            intro: {}
        }
    },

    render: function () {

        var _that = this;
        var expertiseList=[];
        if(this.state.intro.expertise&&this.state.intro.expertise.length>0){
            this.state.intro.expertise.forEach(function(item,index,array){
                expertiseList.push(item.name);
            });
        }

        var expertise=expertiseList.join('，');


        return (
            <div>
                <DocumentTitle title={this.state.basicInfo.name||''}/>

                <div className="text-center text-white clearfix doc_details_bg">
                    <div className="p-t-lg">
                        <img className="logo-max round inline-block"
                             style={{'boxShadow': '0px 0px 0px 3px rgba(255,255,255,0.3)'}}
                             src={this.state.basicInfo.headPicFileName?this.state.basicInfo.headPicFileName:'http://default.test.file.dachentech.com.cn/user/default.jpg'}/>
                    </div>
                    <div className="m-t-xs p-b-lg">
                        <div className="text-md">
                            {this.state.basicInfo.title}
                        </div>
                        <div className="text-sm">{this.state.basicInfo.departments}&nbsp;&nbsp;{this.state.basicInfo.hospital}</div>
                    </div>
                </div>

                <div className="weui_panel weui_panel_access">
                    <div className="weui_panel_bd ">
                        <div className="weui_media_box weui_media_text">
                            <h1 className="text-md line-height-2">擅长</h1>
                            <p className="">{expertise || '暂无'}</p>
                            <h1 className="text-md line-height-2 m-t-sm ">个人简介</h1>
                            <p className="">{this.state.intro.introduction || '暂无'}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})
