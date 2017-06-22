'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../components/ApiFactory.js');
var LinkedStateMixin = require('react-addons-linked-state-mixin');

module.exports = React.createClass({
    // 修改名字
    funRename: function() {
        var _that = this;

        if (!this.state.name || !this.state.name.trim()) {
            return Tools.tipDialog('请输入真实姓名！');
        }

        if (!this.state.diseaseDesc || !this.state.diseaseDesc.trim()) {
            return Tools.tipDialog('请添加详细描述！');
        }

        if (this.state.diseaseDesc && this.state.diseaseDesc.length > 300) {
            return Tools.tipDialog('描述不能超过300字符')
        }

        Tools.fetch({
            url: ApiFactory.patient.patientRename,
            data: {
                access_token: _that.props.params.access_token,
                name: this.state.name
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                _that.funTakeOrder();
            }
        })
    },
    // 提交病情资料
    funTakeOrder: function() {

        var _that = this;

        var orderType = null;

        // 套餐类型 1电话咨询  2图文咨询  3健康关怀  0报到
        if (this.props.params.packType == 1 ||
            this.props.params.packType == 2) {
            orderType = 1;
            funSetOrder();
        } else if (this.props.params.packType == 3) {
            orderType = 4;
            funSetOrder();
        } else if (this.props.params.packType == 0) {
            orderType = 2;
            funSetCheckInOrder();
        } else if (this.props.params.packType == 'selectPatient009') { // 患者报到选择患者页 packId 存的是 用户code
            funSelectPatientr();
        } else {
            return;
        }

        // 跳到患者报到选择患者页 packId 存的是 用户code
        function funSelectPatientr() {
            _that.props.history.replace('selectPatient/'+_that.props.params.doctorId+'/'+_that.props.params.access_token+'/'+_that.props.params.packId);
        }

        // 报到订单
        function funSetCheckInOrder() {
            Tools.fetch({
                url: ApiFactory.order.takeCheckIn,
                data: {
                    access_token: _that.props.params.access_token,
                    doctorId: _that.props.params.doctorId,
                    patientId: _that.state.patientId,
                    message: _that.state.diseaseDesc || '',
                    phone: _that.state.telephone,
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _that.props.history.replace('takeOrderSuccess/提交成功');
                }
            })
        };

        // 非报到订单
        function funSetOrder() {
            // 订单类型 （1：套餐订单；2：报到；3：门诊订单；4：关怀计划套餐订单；5：随访套餐订单）空值则为套餐订单
            Tools.fetch({
                url: ApiFactory.order.takeOrder,
                data: {
                    access_token: _that.props.params.access_token,
                    doctorId: _that.props.params.doctorId,
                    packId: _that.props.params.packId == 0 ? '' : _that.props.params.packId,
                    patientId: _that.state.patientId,
                    diseaseDesc: _that.state.diseaseDesc || '',
                    telephone: _that.state.telephone,
                    orderType: orderType
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    if(!_data.ifNewOrder){
                        Tools.tipDialog('您已加入该计划，无需重复加入');
                    }else{
                        _that.props.history.replace('takeOrderSuccess/提交成功');
                    }                    
                }
            })
        };

    },
    getInitialState: function() {
        return {
            patientId: '',
            telephone: '',
            name: '',
            diseaseDesc: '',
            showIf: false
        };
    },
    componentWillMount: function() {
        var _that = this;
        var ajaxTime = 0;

        // 获取可选患者
        (function funGetPatients() {
            Tools.fetch({
                url: ApiFactory.patient.findByCreateUser,
                data: {
                    access_token: _that.props.params.access_token
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    if (_data.length < 1) {

                        // 循环获取患者，hark后台创建账号时异步创建患者(创建账号后到创建患者有时差)
                        ajaxTime++;
                        if (ajaxTime < 4) {
                            setTimeout(function() {
                                funGetPatients();
                            }, 500);
                        } else {
                            ajaxTime = 0
                        }
                    } else {
                        _that.setState({
                            patientId: _data[0].id,
                            telephone: _data[0].telephone,
                            showIf: true
                        })
                    }
                }
            })
        })();
    },
    componentDidMount: function() {
        Tools.hackWehcatTitle();
    },
    onChange: function(_ref) {
        var _state = {};
        _state[_ref] = this.refs[_ref].value;
        this.setState(_state);
    },
    render: function() {
        return (
            <div>
                <DocumentTitle title="患者信息完善"/>
                {!this.state.showIf ? '' : (
                    <div>
                        <div className="weui_cells weui_cells_form m-t-md">
                            <div className="weui_cell">
                                <div className="weui_cell_hd"><label className="weui_label">真实姓名</label></div>
                                <div className="weui_cell_bd weui_cell_primary">
                                    <input className="weui_input text-right" 
                                        type="text"
                                        ref="name"
                                        value={this.state.name}
                                        onChange={this.onChange.bind(this,'name')}
                                        placeholder="请输入真实姓名"/>
                                </div>
                            </div>
                            <div className="weui_cell">
                                <div className="weui_cell_bd weui_cell_primary">
                                    <textarea className="weui_textarea" 
                                        placeholder="请详细描述您的症状及您的家族病史，过敏史等信息。"
                                        rows="3" 
                                        ref="diseaseDesc"
                                        value={this.state.diseaseDesc}
                                        onChange={this.onChange.bind(this,'diseaseDesc')}>
                                    </textarea>
                                    <div className="weui_textarea_counter"><span className={this.state.diseaseDesc.length>300?'text-orange':''}>{this.state.diseaseDesc.length||0}</span>/300</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-md">
                            <button className="weui_btn weui_btn_primary" 
                                style={
                                    !this.state.name.id || !this.state.diseaseDesc || this.state.diseaseDesc.length>300 ? {
                                        opacity: '0.5'
                                    } : {}
                                }
                                onClick={this.funRename} 
                                disabled={!this.state.name || !this.state.diseaseDesc || this.state.diseaseDesc.length>300}>提交</button>
                        </div>
                    </div>
                )}
            </div>
        )
    }
})
