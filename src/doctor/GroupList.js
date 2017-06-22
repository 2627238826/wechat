'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../components/ApiFactory.js');
var PageView = require('./../components/pageView/PageView.js');

module.exports = React.createClass({

    // 搜索集团列表
    funGetGroups: function(param) {

        var _that = this;

        this.setState({
            isNoMore: false
        });

        Tools.fetch({
            url: ApiFactory.findAllGroup,
            data: {
                pageIndex: param.pageIndex || 0
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                // console.log(_data);
                if (!Array.isArray(_data)) _data = [];
                // 首页
                if (!param.pageIndex || param.pageIndex < 1) {
                    _that.setState({
                        groups: _data,
                        pageIndex: param.pageIndex || 0
                    })
                }
                // 有更多数据
                else if (_data.length && _data.length > 0) {
                    _that.setState({
                        groups: _that.state.groups.concat(_data),
                        pageIndex: param.pageIndex || 0
                    })
                } else {
                    _that.setState({
                        isNoMore: true
                    })
                }
                // console.log(_that.state.groups);

            }
        })
    },

    componentWillMount:function(){
        this.funGetGroups({
            pageIndex: 0
        })
    },

    getInitialState: function() {
        return {
            groups: [],
            pageIndex: 0,
            isNoMore: false
        }

    },
    funLoadMore: function() {
        var _that=this;
        this.funGetGroups({
            pageIndex: _that.state.pageIndex + 1
        })
    },
    componentDidMount: function() {
        Tools.hackWehcatTitle();
    },
    render: function() {

        var _that = this;


        var data = _that.state.groups.map(function(item, index) {
            var group_rec=item.certStatus=='P'?(<div className="group-rec">
                <div className="mark">v</div>
                <span className="txt">集团认证</span>
            </div>):'';

            return (
                <Link className="weui_cell align-stretch" to={"groupDetails/"+item.groupId} >
                    <div className="weui_cell_hd">
                        <img src={item.certPath?item.certPath:'http://default.test.file.dachentech.com.cn/user/default.jpg'} alt="" className="cover cover-max r-max"/>
                    </div>
                    <div className="weui_cell_bd weui_cell_primary">
                        <p className="text-dark text-md" style={{"display":"inline-block"}}>{item.groupName} </p>
                        {group_rec}
                        <p className="summary text-sm">专家成员：{item.expertNum}&nbsp;&nbsp; 就诊量：{item.cureNum}</p>
                        <p className="text-dark ellipsis-row-2 text-sm">
                            {item.introduction?item.introduction:'暂无'}
                        </p>
                        <p className="text-dark summary text-sm m-t-xxs">
                            擅长：{item.disease?item.disease:'暂无'}
                        </p>
                    </div>
                    <div className="weui_cell_ft"></div>
                </Link>
            )
        });

        return (
            <div className="h-full position_relative">
                <DocumentTitle title="医生团队"/>
                <div className="h-full w-full ">
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
