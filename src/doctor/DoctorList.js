'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var DoctorCard = require('./DoctorCard.js');
var SearchBar = require('./../components/SearchBar.js');
var ApiFactory = require('./../components/ApiFactory.js');
var PageView = require('./../components/pageView/PageView.js');
var recommendPng=require('../img/recommend.png');
var searchPng=require('../img/search.png');

module.exports = React.createClass({
    // 病种id查找
    funGetDoctorsByDisease: function(param) {

        var _that = this;

        this.setState({
            searchType: 1,
            isNoMore: false
        })

        Tools.fetch({
            url: ApiFactory.findDoctorByDisease,
            data: {
                diseaseId: param.diseaseId || '',
                pageIndex: param.pageIndex || 0
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                if (!Array.isArray(_data)) _data = [];

                // 首页
                if (!param.pageIndex || param.pageIndex < 1) {
                    _that.setState({
                        doctors: _data,
                        pageIndex: param.pageIndex || 0
                    })
                }
                // 有更多数据
                else if (_data.length && _data.length > 0) {
                    _that.setState({
                        doctors: _that.state.doctors.concat(_data),
                        pageIndex: param.pageIndex || 0
                    })
                } else {
                    _that.setState({
                        isNoMore: true
                    })
                }

            }
        })
    },
    // 关键字搜索
    funGetDoctorsByKeyWord: function(param) {

        var _that = this;

        this.setState({
            searchType: 2,
            isNoMore: false
        });

        if(!param.pageIndex&&param.keyword!==''){
            var _index=this.state.searchHistory.indexOf(param.keyword);
            if(_index>-1){
                this.state.searchHistory.splice(_index,1);
            }
            this.state.searchHistory.unshift(param.keyword);

            if(this.state.searchHistory.length>10){
                this.state.searchHistory=this.state.searchHistory.slice(0,10);
            }
            localStorage.setItem('searchHistory',JSON.stringify(this.state.searchHistory));
        }

        Tools.fetch({
            url: ApiFactory.findDoctoreByKeyWord,
            data: {
                keyword: param.keyword || '',
                pageIndex: param.pageIndex || 0
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                if (!Array.isArray(_data)) _data = [];
                // 首页
                if (!param.pageIndex || param.pageIndex < 1) {
                    _that.setState({
                        doctors: _data,
                        pageIndex: param.pageIndex || 0
                    })
                }
                // 有更多数据
                else if (_data.length && _data.length > 0) {
                    _that.setState({
                        doctors: _that.state.doctors.concat(_data),
                        pageIndex: param.pageIndex || 0
                    })
                } else {
                    _that.setState({
                        isNoMore: true
                    })
                }

            }
        })
    },

    componentWillMount:function(){
        var _that = this;
        var params = this.props.params;

        // 病种精确查找
        if (params.searchType == 1) {
            this.funGetDoctorsByDisease({
                diseaseId: (params.diseasesId == 0 ? '' : params.diseasesId)
            });
            this.state.searchBar.key = (params.key == 0 ? '' : params.key);
        }
        else if(params.searchType==2){
            this.funGetDoctorsByKeyWord({
                keyword: params.key,
                pageIndex: 0
            });
            this.state.searchBar.key = params.key;
        }

    },

    getInitialState: function() {

        var _that = this;
        var params = this.props.params;

        var searchBar = {
            searchButonText: '搜索医生、病种、症状',
            isFocus: true,
            key: '',
            callback: function(key) {
                _that.setState({
                    keyword: key
                });

                _that.funGetDoctorsByKeyWord({
                    keyword: key
                });
            }
        }


        return {
            searchBar: searchBar,
            doctors: [],
            keyword: '',
            pageIndex: 0,
            searchHistory:JSON.parse(localStorage.getItem('searchHistory'))||[],
            searchType: this.props.params.searchType,
            isNoMore: false
        }

    },
    funLoadMore: function() {

        var _that = this;
        var params = this.props.params;

        // 病种精确查找
        if (this.state.searchType == 1) {
            this.funGetDoctorsByDisease({
                diseaseId: (params.diseasesId == 0 ? '' : params.diseasesId),
                pageIndex: this.state.pageIndex + 1
            })
        }
        // 关键字查找
        else if (this.state.searchType == 2) {
            this.funGetDoctorsByKeyWord({
                keyword: this.state.keyword,
                pageIndex: this.state.pageIndex + 1
            })
        }
    },
    componentDidMount: function() {
        Tools.hackWehcatTitle();
    },
    render: function() {

        var _that = this;

        var data = this.state.doctors.map(function(item, index) {
            return (
                <DoctorCard key={item.doctorId} data={item}/>
            )
        });

        var scrollData=(
            <div>
                {this.state.doctors.length>0?(<div className="m-l-xs text-sm p-t-b-xs"><img src={recommendPng} className="v-align-bottom m-r-xs" style={{'width':'1rem','height':'1rem'}}/><span style={{'marginTop':'1rem'}}>推荐专家</span></div>):(this.state.keyword?(<div className="text-center" style={{"margin-top":"3rem"}}><img src={searchPng} width="100px" height="100px"/><p className="text-gray text-md m-t-sm">没有"{this.state.keyword||this.props.params.key}"的搜索结果</p></div>):'')}
                {data}
            </div>

        );
        return (
            <div className="h-full position_relative">
                <DocumentTitle title="搜索"/>
                <div className="position_fixed top bg-white w-full">
                    <SearchBar data={this.state.searchBar}/>
                    <div>{this.state.scrollTop}</div>
                </div>

                <div className="weui_cells_access search_bar_content_box h-full w-full">
                    <PageView cofig={{
                    data:scrollData,
                    loadMore:_that.funLoadMore,
                    id:'doctorListView',
                    isNoMore:_that.state.isNoMore
                }}/>
                </div>
            </div>
        )
    }
})
