'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var DoctorCard = require('./../DoctorCard.js');
var ApiFactory = require('./../../components/ApiFactory.js');
var PageView = require('./../../components/pageView/PageView.js');

module.exports = React.createClass({
    funShowAllIntroduction: function(argument) {
        this.setState({
            isShowAll: !this.state.isShowAll
        })
    },
    funLoadMore: function() {
        this.funGetDoctors(this.state.pageIndex + 1);
    },
    funGetDoctors: function(pageIndex) {
        Tools.fetch({
            url: ApiFactory.group.findDoctorByGroupForPatient,
            data: {
                docGroupId: this.props.params.groupId || '',
                // isApp: true,
                pageIndex: pageIndex,
                pageSize: 15
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {

                var data = _data;

                if (!Array.isArray(data)) data = [];

                // 首页
                if (!pageIndex || pageIndex < 1) {
                    this.setState({
                        doctors: data,
                        pageIndex: pageIndex || 0
                    })
                }
                // 有更多数据
                else if (data.length && data.length > 0) {
                    this.setState({
                        doctors: this.state.doctors.concat(data),
                        pageIndex: pageIndex || 0
                    })
                } else {
                    this.setState({
                        isNoMore: true
                    })
                }

            }
        }.bind(this))
    },
    funGetGroupInfo: function() {
        Tools.fetch({
            url: ApiFactory.group.findGroupBaseInfo,
            data: {
                docGroupId: this.props.params.groupId || ''
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                this.setState({
                    group: _data || {}
                })
                Tools.hackWehcatTitle();
                Tools.weixin.init().then(function (_wx) {
                    _wx.ready(function () {
                        //分享给朋友
                        _wx.onMenuShareAppMessage({
                            title: _data.groupName, // 分享标题
                            desc: _data.introduction, // 分享描述
                            link: window.location.href , // 分享链接
                            imgUrl: _data.certPath?_data.certPath:'http://default.test.file.dachentech.com.cn/user/default.jpg', // 分享图标
                        });
                        //分享到朋友圈
                        _wx.onMenuShareTimeline({
                            title: _data.groupName, // 分享标题
                            link: window.location.href , // 分享链接
                            imgUrl: _data.certPath?_data.certPath:'http://default.test.file.dachentech.com.cn/user/default.jpg', // 分享图标
                        });
                        /*//分享到QQ
                        _wx.onMenuShareQQ({
                            title: _data.groupName, // 分享标题
                            desc: _data.introduction, // 分享描述
                            link: window.location.href , // 分享链接
                            imgUrl: _data.certPath?_data.certPath:'http://default.test.file.dachentech.com.cn/user/default.jpg', // 分享图标
                        });
                        //分享到腾讯微博
                        _wx.onMenuShareWeibo({
                            title: _data.groupName, // 分享标题
                            desc: _data.introduction, // 分享描述
                            link: window.location.href , // 分享链接
                            imgUrl: _data.certPath?_data.certPath:'http://default.test.file.dachentech.com.cn/user/default.jpg', // 分享图标
                        });
                        //分享到QQ空间
                        _wx.onMenuShareQZone({
                            title: _data.groupName, // 分享标题
                            desc: _data.introduction, // 分享描述
                            link: window.location.href , // 分享链接
                            imgUrl: _data.certPath?_data.certPath:'http://default.test.file.dachentech.com.cn/user/default.jpg', // 分享图标
                        });*/
                    })
                })
            }
        }.bind(this))
    },
    getInitialState: function() {

        return {
            doctors: [],
            group: {},
            pageIndex: 0,
            isNoMore: false,
            isShowAll: false
        };

    },
    componentDidMount: function() {
        this.funGetGroupInfo();
        this.funGetDoctors(this.state.pageIndex);

    },
    render: function() {

        var _that = this;

        var data = (
            <div>
                <DocumentTitle title={this.state.group.groupName}/>
                    <div className="text-white clearfix doc_details_bg">
                        <div className="weui_cell no_center p-t-b-sm">
                            <div className="weui_cell_hd">
                                    <img src={this.state.group.certPath?this.state.group.certPath:'http://default.test.file.dachentech.com.cn/user/default.jpg'} alt="" className="cover cover-max r-max"/>
                            </div>
                            <div className="weui_cell_bd weui_cell_primary text-white">
                                <h3 className="title text-md clearfix"><span className="text-white pull-right" style={{'opacity':'.6'}}>就诊量：{this.state.group.cureNum||0}</span></h3>
                                <p className="text-sm text-white">
                                    {
                                        this.state.isShowAll||!this.state.group.introduction||this.state.group.introduction.length<=30?(
                                            <span>{this.state.group.introduction}</span>
                                            ):(
                                            <span>{this.state.group.introduction.slice(0,30)+'...'}</span>
                                            )
                                    }
                                    {
                                        this.state.group.introduction&&this.state.group.introduction.length>30?(
                                            <span className="m-l-xs" onClick={this.funShowAllIntroduction.bind(this)}>{
                                                this.state.isShowAll?(
                                                    <label>收起</label>
                                                    ):<label>展开</label>
                                            }</span>
                                            ):''
                                    }
                                </p>
                            </div>
                        </div>
                        {
                            this.state.group.disease?(
                                    <div className="b-t p-t-b-xs" style={{'margin':'0px 15px','borderTopWidth':'1px'}}>
                                        擅长：{this.state.group.disease}
                                    </div>
                                ):''
                        }
                    </div>
                    {
                        this.state.doctors&&this.state.doctors.length<1?(
                            <div className="text-center m-t-sm text-grey">无医生</div>
                            ):''
                    }
                    {
                        this.state.doctors.map(function(item, index) {
                            return (
                                <DoctorCard key={item.doctorId} data={item}/>
                            )
                        })
                    }
                </div>
        )

        return (
            <div className="w-full h-full">
                <div className="weui_cells_access h-full w-full ">
                    <PageView cofig={{
                    data:data,
                    loadMore:_that.funLoadMore,
                    id:'doctorListView',
                    isNoMore:_that.state.isNoMore
                }}/>
                </div>
            </div>
        )
    }
})
