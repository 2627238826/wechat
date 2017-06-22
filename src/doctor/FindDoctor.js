'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DoctorCard = require('./DoctorCard.js');
var ApiFactory = require('./../components/ApiFactory.js');
var PageView = require('./../components/pageView/PageView.js');
var Slider = require('react-slick');
var RecGroupCard = require('./RecGroupCard.js');
var Dialog = require('react-weui').Dialog;
var Button = require('react-weui').Button;
var Alert = Dialog.Alert;
var Confirm = Dialog.Confirm;

module.exports = React.createClass({
    // 获取推荐名医
    getFamousDoctors: function(param) {

        var _that = this;

        Tools.fetch({
            url: ApiFactory.doctor.findAllDoctor,
            data: {
                // areaCode: param.areaCode || '',
                // specialistId: param.specialistId || '',
                pageIndex: param.pageIndex || 0,
                pageSize: param.pageSize || 10
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                // 首页
                if (!param.pageIndex) {
                    _that.setState({
                        famousDoctors: _data.pageData,
                        index: param.pageIndex || 0
                    })
                }
                // 下一页
                else {

                    // 有更多数据
                    if (_data.pageData.length && _data.pageData.length > 0) {
                        _that.setState({
                            famousDoctors: _that.state.famousDoctors.concat(_data.pageData),
                            index: param.pageIndex
                        })
                    }
                    // 全部加载
                    else {
                        _that.setState({
                            isNoMore: true
                        })
                    }


                }

            }
        })
    },

    // 获取常见疾病列表
    getCommonDiseases: function() {
        var _that = this;

        Tools.fetch({
            url: ApiFactory.getCommonDiseases,
            data: {
                pageSize: 20,
                pageIndex: 0
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                _that.state.commonDisease = _data.pageData;
            }
        })
    },

    // 获取推荐集团列表
    getGroupRecommendedList: function() {
        var _that = this;

        Tools.fetch({
            url: ApiFactory.getGroupRecommendedList,
            data: {
                pageSize: 20,
                pageIndex: 0
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                _that.setState({groupRecommendedList:_data});
            }
        })
    },

    // 获取推荐医生列表
    getRecommendDocList: function() {
        var _that = this;

        Tools.fetch({
            url: ApiFactory.getRecommendDocList,
            data: {
                groupId: 'platform',
                isApp: 0,
                pageSize: 20,
                pageIndex: 0
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                _that.setState({recommendDocList:_data.pageData});
                Tools.weixin.init().then(function (_wx) {
                    _wx.ready(function () {
                        //分享给朋友
                        _wx.onMenuShareAppMessage({
                            title: '玄关健康', // 分享标题
                            desc: '玄关健康，医生提供专业权威的疾病问诊、用药指导、随访随诊服务，切实缓解看病难题。支持医生与您实时咨询，图文、语音都支持，像QQ聊天一样简单。汇集全国医生给您最好的服务。', // 分享描述
                            link: window.location.href , // 分享链接
                            imgUrl: 'http://default.file.dachentech.com.cn/pub_default.png', // 分享图标
                        });
                        //分享到朋友圈
                        _wx.onMenuShareTimeline({
                            title: '玄关健康', // 分享标题
                            link: window.location.href , // 分享链接
                            imgUrl: 'http://default.file.dachentech.com.cn/pub_default.png', // 分享图标
                        });
                        /*//分享到QQ
                        _wx.onMenuShareQQ({
                            title: '玄关健康', // 分享标题
                            desc: '玄关健康，医生提供专业权威的疾病问诊、用药指导、随访随诊服务，切实缓解看病难题。支持医生与您实时咨询，图文、语音都支持，像QQ聊天一样简单。汇集全国医生给您最好的服务。', // 分享描述
                            link: window.location.href , // 分享链接
                            imgUrl: 'http://default.file.dachentech.com.cn/pub_default.png', // 分享图标
                        });
                        //分享到腾讯微博
                        _wx.onMenuShareWeibo({
                            title: '玄关健康', // 分享标题
                            desc: '玄关健康，医生提供专业权威的疾病问诊、用药指导、随访随诊服务，切实缓解看病难题。支持医生与您实时咨询，图文、语音都支持，像QQ聊天一样简单。汇集全国医生给您最好的服务。', // 分享描述
                            link: window.location.href , // 分享链接
                            imgUrl: 'http://default.file.dachentech.com.cn/pub_default.png', // 分享图标
                        });
                        //分享到QQ空间
                        _wx.onMenuShareQZone({
                            title: '玄关健康', // 分享标题
                            desc: '玄关健康，医生提供专业权威的疾病问诊、用药指导、随访随诊服务，切实缓解看病难题。支持医生与您实时咨询，图文、语音都支持，像QQ聊天一样简单。汇集全国医生给您最好的服务。', // 分享描述
                            link: window.location.href , // 分享链接
                            imgUrl: 'http://default.file.dachentech.com.cn/pub_default.png', // 分享图标
                        });*/
                    })
                })
            }
        })
    },

    funLoadMore: function() {
        var index = this.state.index + 1;
        this.getFamousDoctors({
            pageIndex: index
        })
    },
    // 初始化
    getInitialState: function() {

        var _that = this;


        // 获取推荐病种
        (function getRecommDisease() {
            Tools.fetch({
                url: ApiFactory.findRecommDisease,
                data: {}
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _that.setState({
                        recommDisease: _data
                    })
                }
            })
        })();

        // 获取推荐名医
        this.getFamousDoctors({});

        return {
            recommendDocList: [],
            groupRecommendedList: [],
            commonDisease: [],
            recommDisease: [],
            famousDoctors: [],
            index: 0,
            searchHistory: JSON.parse(localStorage.getItem('searchHistory')) || [],
            isNoMore: false,

            showAlert: false,
            showConfirm: false,
            confirm: {
                title: '确认清除？',
                buttons: [{
                    type: 'primary',
                    label: '是',
                    onClick: this.clearSearchHistory.bind(this)
                }, {
                    type: 'default',
                    label: '否',
                    onClick: this.hideConfirm.bind(this)
                }]
            }
        };

    },

    //清除搜索历史
    clearSearchHistory: function() {
        localStorage.removeItem('searchHistory');
        this.setState({
            searchHistory: []
        });
        this.setState({ showConfirm: false });

    },
    componentDidMount: function() {
        
        //Tools.hackWehcatTitle();
        // 获取常见疾病列表
        this.getCommonDiseases();
        // 获取推荐集团列表
        this.getGroupRecommendedList();
        // 获取推荐医生列表
        this.getRecommendDocList();
    },

    showConfirm: function() {
        this.setState({ showConfirm: true });
    },

    hideConfirm: function() {
        this.setState({ showConfirm: false });
    },

    render: function() {
        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            autoplay: true,
            slidesToShow: 1,
            slidesToScroll: 1,

        };
        var _that = this;
        return (
            <div className="w-full h-full">
                <div className="bg-grey-dark">
                    <div className="weui_search_bar">
                        <form className="weui_search_outer">
                            <div className="weui_search_inner">
                                <i className="weui_icon_search"></i>
                                <input type="search" ref="search_input" className="weui_search_input" placeholder="搜索"/>
                                <a href="javascript:" className="weui_icon_clear" id="search_clear"></a>
                            </div>
                            <Link to="doctorList/0/0/0" className="weui_search_text">
                                <i className="weui_icon_search"></i>
                                <span>搜索</span>
                            </Link>
                        </form>
                        <a href="javascript:" className="weui_search_cancel" id="search_cancel">取消</a>
                    </div>
                    {
                        this.state.searchHistory.length>0?(<div className="bg-white  p-t-b-xs">
                            <div className="b-l-green text-md">
                                <span style={{'margin-left':'0.2rem'}}>搜索历史</span>
                                <span className="pull-right m-r-xs text-gray"
                                      onClick={this.showConfirm.bind(this)}>清除</span>
                            </div>
                            <div>
                                {
                                    this.state.searchHistory.map(function (item, index) {
                                        return (
                                            <Link
                                                to={'doctorList/2/'+item+'/'+item}>
                                                <div className="normal-disease text-sm weui_grid_label">
                                                    {item}
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </div>):''

                    }

                    {
                        this.state.searchHistory.length>0?(<div className="bg-white m-t-sm p-t-b-xs">
                            <div className="b-l-green text-md">
                                <span style={{'margin-left':'0.2rem'}}>常见疾病</span>
                            </div>
                            <div>
                                {
                                    this.state.commonDisease.map(function (item, index) {
                                        return (
                                            <Link
                                                to={'doctorList/2/'+item.name+'/'+item.name}>
                                                <div className="normal-disease text-sm weui_grid_label">
                                                    {item.name}
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </div>):(<div className="bg-white p-t-b-xs">
                            <div className="b-l-green text-md">
                                <span style={{'margin-left':'0.2rem'}}>常见疾病</span>
                            </div>
                            <div>
                                {
                                    this.state.commonDisease.map(function (item, index) {

                                        var url = 'doctorList/2/'+encodeURIComponent(item.name)+'/0';

                                        return (
                                            <Link
                                                to={url}>
                                                <div className="normal-disease text-sm weui_grid_label">
                                                    {item.name}
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </div>)

                    }




                    <div className="bg-white m-t-sm p-t-b-xs ">
                        <div className="b-l-green text-md weui_cells_access">
                            <span style={{'margin-left':'0.2rem'}}>推荐医生团队</span>
                            <span className="pull-right m-r-xs text-dark"><div className="weui_cell_ft"><Link
                                to="groupList" className="text-gray">更多</Link></div></span>
                        </div>
                        <Slider {...settings}>
                            {
                                this.state.groupRecommendedList.map(function (item, index) {
                                    return (
                                        <div><RecGroupCard key={item.id} data={item}/></div>
                                    )
                                })
                            }
                        </Slider>

                    </div>

                    <div className="bg-white m-t-sm p-t-b-xs">
                        <div className="b-l-green text-md">
                            <span style={{'margin-left':'0.2rem'}}>推荐医生</span>
                        </div>
                        <ul className="m-t-xs">
                            {
                                this.state.recommendDocList.map(function (item, index) {
                                    return (
                                        <li className="text-center m-b list-style-none w-precent-20 inline-block"
                                            style={{'margin-left':'4%'}}>
                                            <Link className="text-dark" to={'doctorDetails/'+item.doctorId +'/0'}>
                                                <img
                                                    src={item.headPicFileName?item.headPicFileName:'http://default.test.file.dachentech.com.cn/user/default.jpg'}
                                                    alt="" style={{width:'3rem',height:'3rem'}} className="r-circle"/>

                                                <p className="text-md text-ellipsis">{item.name}</p>

                                                <p className="text-sm text-grey text-ellipsis">{item.departments}</p>
                                            </Link>
                                        </li>
                                    )
                                })
                            }
                        </ul>

                    </div>

                    <section>
                        <Confirm
                            show={this.state.showConfirm}
                            title={this.state.confirm.title}
                            buttons={this.state.confirm.buttons}>
                        </Confirm>
                    </section>

                    {
                        //<div className="weui_grids">
                        //    {
                        //        this.state.recommDisease.map(function (item, index) {
                        //            return (
                        //                <Link
                        //                    to={item.morePath?'findByEntity':'doctorList/1/'+item.diseasesName+'/'+item.diseasesId}
                        //                    className="weui_grid w-precent-25">
                        //                    <div className="weui_grid_icon">
                        //                        <i className="icon icon_button">
                        //                            <img src={item.imgPath?item.imgPath:item.morePath}/>
                        //                        </i>
                        //                    </div>
                        //                    <p className="weui_grid_label">
                        //                        {item.diseasesName ? item.diseasesName : '更多'}
                        //                    </p>
                        //                </Link>
                        //            )
                        //        })
                        //    }
                        //</div>
                        //<div className="weui_cells_title">找医生</div>
                        //<div className="weui_cells weui_cells_access">
                        //{
                        //    this.state.famousDoctors.map(function (item, index) {
                        //        return (
                        //            <DoctorCard key={item.doctorId} data={item}/>
                        //        )
                        //    })
                        //}
                        //</div>
                    }
                </div>
            </div>
        );


        //return (
        //    <div className="w-full h-full">
        //        {
        //            <PageView cofig={{
        //                data:data,
        //                loadMore:_that.funLoadMore,
        //                id:'FindDoctorView',
        //                isNoMore:_that.state.isNoMore
        //            }}/>
        //        }
        //    </div>
        //)
    }
})
