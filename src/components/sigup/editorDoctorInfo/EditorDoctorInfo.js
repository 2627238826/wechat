'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var ApiFactory = require('./../../ApiFactory.js');

module.exports = React.createClass({
    mixins: [LinkedStateMixin],
    // 提交
    funSubmit: function() {
        // 校验数据
        if (this.funIsNoSure()) return;

        var _that = this;
        var departmentId = this.state.curChildDept ? this.state.curChildDept : this.state.curParantDept;
        var department = this.funFindDeptById(departmentId);

        Tools.fetch({
            url: ApiFactory.common.registerByWechat,
            data: {
                'telephone': this.state.phone,
                'password': this.state.pwd,
                'userType': 3,
                'code': this.props.params.code,
                'name': this.state.name,
                'doctor.departments': department.name,
                'doctor.deptId': department.id,
                'doctor.title': this.state.curTitle
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                // console.log(_data)
                _that.props.history.pushState(null, 'sigupSuccess/' + 3);
            }
        })

    },
    funIsNoSure: function() {
        return (
            // 没有输入手机号
            !this.state.phone ||
            // 没有输入姓名
            !this.state.name ||
            // 没有输入密码
            !this.state.pwd ||
            // 有子科室没有选
            (this.state.childDepts.length > 0 &&
                !this.state.curChildDept
            ) ||
            // 没有子科室，没有选父科室
            (this.state.childDepts.length < 1 &&
                !this.state.curParantDept) ||
            // 没有选择职称
            !this.state.curTitle
        )
    },
    // 获取科室
    funGetDepts: function(id) {
        var _that = this;

        Tools.fetch({
            url: ApiFactory.common.getDepts,
            data: {
                id: id || ''
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                // console.log(_data)
                if (!id) {
                    _that.setState({
                        parantDepts: _data,
                        childDepts: [],
                        curChildDept: ''
                    })
                } else {
                    _that.setState({
                        childDepts: _data
                    })
                }

            }
        })
    },
    // 选择父级科室
    funParantDeptChage: function() {


        var id = this.refs.curParantDept.value;

        this.setState({
            childDepts: [],
            curChildDept: '',
            curParantDept: id
        })

        // 没有子科室
        if (this.funFindDeptById(id).isLeaf) return;

        this.funGetDepts(id);

    },
    // 通过id获取科室
    funFindDeptById: function(id) {

        var parantDepts = this.state.parantDepts;

        for (var i = 0; i < parantDepts.length; i++) {

            if (id == parantDepts[i].id) {
                return parantDepts[i];
            }
        }

        var childDepts = this.state.childDepts;

        for (var i = 0; i < childDepts.length; i++) {

            if (id == childDepts[i].id) {
                return childDepts[i];
            }
        }

        return null;
    },
    componentWillMount: function() {
        var params = Tools.paramArry();
        var _that = this;

        // 获取可选科室
        this.funGetDepts();

        // 获取可选职称
        (function() {
            Tools.fetch({
                url: ApiFactory.common.getTitles,
                data: {}
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    // console.log(_data)
                    _that.setState({
                        titles: _data
                    })
                }
            })
        })();
    },
    getInitialState: function() {
        var _that = this;

        return {
            phone: this.props.params.phone || '',
            name: '',
            pwd: '',
            parantDepts: [],
            childDepts: [],
            curParantDept: '',
            curChildDept: '',
            titles: [],
            curTitle: ''
        }
    },
    render: function() {
        var _that = this;

        return (
            <div>
                <DocumentTitle title="填写执业信息"/>
                <div className="weui_cells m-t-md weui_cells_access">
                    <div className="weui_cell">
                        <div className="weui_cell_bd weui_cell_primary">
                            <input ref="phone" className="weui_input" type="number" disabled="true" valueLink={this.linkState('phone')}/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_bd weui_cell_primary">
                            <input ref="name" className="weui_input" type="text" placeholder="姓名"  valueLink={this.linkState('name')}/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_bd weui_cell_primary">
                            <input ref="pwd" className="weui_input" type="password" placeholder="密码" valueLink={this.linkState('pwd')}/>
                        </div>
                    </div>
                    <div className="weui_cell weui_cell_select">
                        <div className="weui_cell_hd w-full">
                            <select className="weui_select" ref="curParantDept" onChange={this.funParantDeptChage}>
                                <option value="">请选择科室</option>
                                {
                                    this.state.parantDepts.map(function (parantDept) {
                                        return (
                                            <option value={parantDept.id}>{parantDept.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                        </div>
                    </div>
                    {
                        this.state.childDepts&&this.state.childDepts.length>0?(
                            <div className="weui_cell weui_cell_select">
                                <div className="weui_cell_hd w-full">
                                    <select className="weui_select" ref="curChildDept" valueLink={this.linkState('curChildDept')}>
                                        <option value="">请选择二级科室</option>
                                        {
                                            this.state.childDepts.map(function (childDept) {
                                                return (
                                                    <option value={childDept.id}>{childDept.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="weui_cell_bd weui_cell_primary">
                                </div>
                            </div>
                            ):''
                    }
                    <div className="weui_cell weui_cell_select">
                        <div className="weui_cell_hd w-full">
                            <select className="weui_select" ref="curTitle" valueLink={this.linkState('curTitle')}>
                                <option value="">请选择职称</option>
                                {
                                    this.state.titles.map(function (title) {
                                        return (
                                            <option value={title.name}>{title.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                        </div>
                    </div>
                </div>
                <div className="p-md">
                    <button className="weui_btn weui_btn_primary" 
                            disabled={this.funIsNoSure()} 
                            onClick={this.funSubmit}>提交</button>
                </div>
            </div>
        )
    }
})
