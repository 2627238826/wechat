'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ActionSheet = require('./../../components/ActionSheet.js');
var ApiFactory = require('./../../components/ApiFactory.js');
var LinkedStateMixin = require('react-addons-linked-state-mixin');

module.exports = React.createClass({
    mixins: [LinkedStateMixin],
    funBack: function() {
        this.props.history.pushState(null, 'doctorDetails/' + this.props.params.doctorId+'/0');
    },
    // 选择患者
    funSelectedPatient: function(patient) {
        this.setState({
            selectedPatient: patient
        })
        this.state.close();
    },
    // 提交病情资料
    funTakeOrder: function() {

        var _that = this;

        var orderType = null;

        if (this.state.diseaseDesc && this.state.diseaseDesc.length > 300) {
            return Tools.tipDialog('描述不能超过300字符')
        }

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
        } else {
            return;
        }

        // 报到订单
        function funSetCheckInOrder() {
            Tools.fetch({
                url: ApiFactory.order.takeCheckIn,
                data: {
                    access_token: _that.props.params.access_token,
                    doctorId: _that.props.params.doctorId,
                    patientId: _that.state.selectedPatient.id,
                    message: _that.state.diseaseDesc || '',
                    phone: _that.state.selectedPatient.telephone,
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _that.props.history.pushState(null, 'takeOrderSuccess/提交成功');
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
                    patientId: _that.state.selectedPatient.id,
                    diseaseDesc: _that.state.diseaseDesc || '',
                    telephone: _that.state.selectedPatient.telephone,
                    orderType: orderType
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    if(!_data.ifNewOrder){
                        Tools.tipDialog('您已加入该计划，无需重复加入');
                    }else{
                        _that.props.history.pushState(null, 'takeOrderSuccess/提交成功');
                    }                    
                }
            })
        };

    },
    funChackIsChackIn: function() {
        var _that = this;
        Tools.fetch({
            url: ApiFactory.order.isCheckIn,
            data: {
                access_token: _that.props.params.access_token,
                doctorId: _that.props.params.doctorId,
                userId: ''
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                // 已经报到过
                if (_data.isCheckIn == 1) {
                    _that.props.history.pushState(null, 'takeOrderSuccess/您已经报到过，请登录APP查看——服务——我的医生');
                }
            }
        })
    },
    componentWillMount: function() {
        var params = Tools.paramArry();
        var _that = this;
        // console.log(params, this.props.params);

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
                        var menus = [];
                        for (var i = 0; i < _data.length; i++) {

                            (function(index) {
                                menus.push({
                                    label: _data[i].userName,
                                    onClick: function() {
                                        _that.funSelectedPatient(_data[index])
                                    }
                                })
                            })(i)

                        }

                        // 只有一个患者
                        if (_data && _data.length == 1) {
                            _that.funSelectedPatient(_data[0]);
                        }

                        // 更新可选患者的列表数据
                        _that.state.setMenus(menus);
                    }
                }
            })
        })();
    },
    getInitialState: function() {
        var _that = this;

        // 检查是否已经报到
        if (this.props.params.packType == 0) {
            this.funChackIsChackIn();
        }

        return {
            // 设置打开执行函数
            configCallback: function(open, setMenus, close) {

                _that.setState({
                    open: open,
                    setMenus: setMenus,
                    close: close
                })

            },
            selectedPatient: {},
            diseaseDesc: ''
        };
    },
    componentDidMount: function() {
        Tools.hackWehcatTitle();
    },
    render: function() {
        return (
            <div>
                <DocumentTitle title="填写病情资料"/>
                <div className="weui_cells weui_cells_access" onClick={this.state.open}>
                    <div className="weui_cell">
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>选择患者</p>
                        </div>
                        <div className="weui_cell_ft">{this.state.selectedPatient.userName||'请选择'}</div>
                    </div>
                </div>
                <div className="weui_cells weui_cells_form">
                    <div className="weui_cell">
                        <div className="weui_cell_bd weui_cell_primary">
                            <textarea className="weui_textarea" 
                                placeholder={this.props.params.packType == 0?'请输入您在医生处就诊的相关信息':'请详细描述您的症状及您的家族病史，过敏史等信息。'} 
                                rows="3" 
                                valueLink={this.linkState('diseaseDesc')}>
                            </textarea>
                            <div className="weui_textarea_counter"><span className={this.state.diseaseDesc.length>300?'text-orange':''}>{this.state.diseaseDesc.length||0}</span>/300</div>
                        </div>
                    </div>
                </div>
                <div className="p-md">
                    <button className="weui_btn weui_btn_primary" onClick={this.funTakeOrder} disabled={!this.state.selectedPatient.id}>提交资料</button>
                </div>
                <div className="text-center text-md">
                    <a onClick={this.funBack.bind(this)}>取消</a>
                </div>
                <ActionSheet configCallback={this.state.configCallback}/>
            </div>
        )
    }
})
