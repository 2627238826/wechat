'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../components/ApiFactory.js');

module.exports = React.createClass({

    // 获取推荐名医
    getDisease: function(parent) {

        var _that = this;

        // 处理没传parent
        if (!parent) parent = {};

        Tools.fetch({
            url: ApiFactory.getOneLevelDisease,
            data: {
                parentId: parent.id || ''
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {

                // 更新父级
                if (!parent || !parent.id) {

                    _that.setState({
                        parents: _data
                    })
                }
                // 更新子集
                else {

                    _data.unshift({
                        leaf: true,
                        name: '全部',
                        id: parent.id,
                        pName: parent.name
                    })

                    _that.setState({
                        childrens: _data,
                        currentParents: parent
                    })
                }

                // 首次加载第一个父级的子集数据
                if (_that.state.childrens.length < 1) {
                    _that.getDisease(_that.state.parents[0]);
                }

            }
        })
    },

    getInitialState: function() {

        // 获取病种
        this.getDisease();

        return {
            parents: [],
            childrens: [],
            currentParents: {}
        }
    },
    render: function() {

        var _that = this;

        return (
            <div className="position_relative h-full clear">
                <DocumentTitle title='选择病种'/>
                <div className="weui_cells weui_cells_access m-none w-precent-50 h-full over-flow-y-auto pull-left">
                <Link to="doctorList/1/0/0" className="weui_cell b-r b-grey">
                    <div className="weui_cell_hd">
                        全部
                    </div>
                    <div className="weui_cell_bd weui_cell_primary"></div>
                </Link>
                {
                    this.state.parents.map(function (item,index) {
                        return (
                            <a className={item.id==_that.state.currentParents.id?'weui_cell b-r b-grey bg-grey-dark':'weui_cell b-r b-grey'} onClick={_that.getDisease.bind(_that,item)}>
                                <div className="weui_cell_hd">
                                    {item.name}
                                </div>
                                <div className="weui_cell_bd weui_cell_primary"></div>
                                {
                                    item.leaf?'':(<div className="weui_cell_ft"></div>)
                                }
                            </a>
                            )
                    })
                }
                </div>
                <div className="weui_cells weui_cells_access m-none w-precent-50 h-full over-flow-y-auto pull-left bg-grey-dark">
                {
                    this.state.childrens.map(function (item,index) {
                        return (
                            <Link to={'doctorList/1/'+(item.pName||item.name||0)+'/'+item.id} className="weui_cell b-r b-grey">
                                <div className="weui_cell_hd">
                                    {item.name}
                                </div>
                                <div className="weui_cell_bd weui_cell_primary"></div>
                                <div className="weui_cell_ft"></div>
                            </Link>
                            )
                    })
                }
                </div>
            </div>

        )
    }
})
