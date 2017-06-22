'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var History = ReactRouter.hashHistory;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../components/ApiFactory.js');
var ActionSheet = require('./../../components/ActionSheet.js');

var DatePicker = require('react-mobile-datepicker'); // 时间选择组件
var Moment = require('moment');

var style = {
    hide: {
        display: 'none'
    },
    body: {
        width: '100%',
        height: '100%'
    }
}

module.exports = React.createClass({
	getInitialState: function(){
		return {
            maxTime: new Date(),
            time: new Date(),  // 选择器时间（格式要求）
            isOpen: false,
			patientObj: this.props.location.state.patientObj,
			hospital: '',
			recordNum: '',
			lastCureTime: '',
			selectList: {}  // 选择疾病的对象
		};
	},
	componentDidMount: function() {
        window.selectIllnessCallBack = this.selectIllnessCallBack;
        Tools.hackWehcatTitle();
	},
	componentWillReceiveProps: function(nextProps) {
        if(nextProps.route.path == 'medicalRecord') {
            this.setState({
                patientObj: nextProps.location.state.patientObj || {}
            })
        }
	},
    componentDidUpdate: function(oldObj) {
        // 子路由返回时 title变了 hack一下
        if(oldObj.location.pathname.indexOf('/selectIllness/') != -1) {
            Tools.hackWehcatTitle();
        }
    },
    selectIllnessCallBack: function(illObj) {
        this.setState({
            selectList: illObj
        })
    },
	onChange: function(_ref) {
        var _state = {};
        _state[_ref] = this.refs[_ref].value;
        this.setState(_state);
    },
    submit: function() {
    	var id = this.getSelectList(1);
    	if(!this.state.hospital.trim()) {
    		Tools.tipDialog('请填写就诊医院！');
    		return ;
    	}
    	if(!this.state.recordNum.trim()) {
    		Tools.tipDialog('请填写病历号！');
    		return ;
    	}
    	if(!this.state.lastCureTime) {
    		Tools.tipDialog('请选择最后一次就诊时间！');
    		return ;
    	}
    	if(!id) {
    		Tools.tipDialog('请选择所患疾病！');
    		return ;
    	}
    	Tools.fetch({
            url: ApiFactory.order.takeCheckIn,
            data: {
                access_token: this.state.patientObj.access_token,
                patientId: this.state.patientObj.patientId,
                doctorId: this.state.patientObj.doctorId,
                phone: this.state.patientObj.telephone,
                imageUrls: this.state.patientObj.imageUrls,
                hospital: this.state.hospital,
                recordNum: this.state.recordNum,
                lastCureTime: this.state.lastCureTime,
                diseaseIds: [id],
                message: this.state.patientObj.diseaseDesc
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
            	Tools.tipDialog('提交病历成功！');
            	History.pushState(null, 'submitSuccess');
            }
        }.bind(this))
    },
    funSelectIllness: function() {
    	var stateKeep = {
    		patientObj: this.state.patientObj,
    		selectList: this.state.selectList
    	};
    	var access_token = this.state.patientObj ? this.state.patientObj.access_token||'' : '';
    	var doctorId = this.state.patientObj ? this.state.patientObj.doctorId||'' : '';

        setTimeout(function() {
            History.pushState(stateKeep, 'medicalRecord/selectIllness/' + access_token + '/' + doctorId);
        }, 300)
    },
    getSelectList: function(type) {
    	// type 1:id  2:name
    	var id = '', name = '';
        if(this.state.selectList && this.state.selectList.id) {
            id = this.state.selectList.id;
            name = this.state.selectList.name; 
        }

    	if(type == 1) {
    		return id;
    	} else {
    		return name;
    	}
    },

    datepickerClick: function(){
        this.setState({ isOpen: true });
    },
    datepickerCancel: function(){
        this.setState({ isOpen: false });
    },
    datepickerSelect: function(time){

        // hack 组件偶发可选超过最大日期，此时让用户确定无效
        var max = Moment(this.state.maxTime).endOf('day').unix(); // 最大可选
        var select = Moment(time).startOf('day').unix(); // 已选
        if(max < select) {
            return ;    // do nothing 
        }

        this.setState({
            time: time,
            lastCureTime: Moment(time).unix()*1000,
            isOpen: false 
        });
    },

	render: function() {
		return (

			<div style={style.body}>
                <div style={this.props.children?style.body:style.hide}>
                    {this.props.children}
                </div>
                <div style={this.props.children?style.hide:style.body}>
					<div>
						{
                            this.props.location.pathname != '/medicalRecord' ? '' : (
                                <DocumentTitle title="填写病历"/>
                            )
                        }
						<div className="p-l-r-xxs p-t-b-xs">病历信息</div>
						<div className="weui_panel weui_panel_access m-none">
							<div className="weui_cells weui_cells_form weui_cells_access text-sm m-none">
						        <div className="weui_cell">
						            <div className="weui_cell_hd"><label className="weui_label">就诊医院</label></div>
						            <div className="weui_cell_bd weui_cell_primary">
						                <input className="weui_input text-right" 
						                	type="text"
						                	ref="hospital"
						                	value={this.state.hospital}
						                	onChange={this.onChange.bind(this,'hospital')}
						                	placeholder="请输入就诊医院"/>
						            </div>
						        </div>
						        <div className="weui_cell">
						            <div className="weui_cell_hd"><label className="weui_label">病历号</label></div>
						            <div className="weui_cell_bd weui_cell_primary">
						                <input className="weui_input text-right"
						                	type="text"
						                	ref="recordNum"
						                	value={this.state.recordNum}
						                	onChange={this.onChange.bind(this,'recordNum')}
						                	placeholder="例如 091089828"/>
						            </div>
						        </div>
						        <div className="weui_cell" onClick={this.datepickerClick}>
						        	<div className="weui_cell_hd"><label className="weui_label">最后一次就诊时间</label></div>
						            <div className="weui_cell_bd weui_cell_primary text-right">
                                        {!this.state.lastCureTime ? '' : Moment(this.state.lastCureTime).format('YYYY/MM/DD')}
                                    </div>
						            <div className="weui_cell_ft"></div>
						        </div>
						        <div className="weui_cell" onClick={this.funSelectIllness.bind(this)}>
		                			<div className="weui_cell_hd"><label className="weui_label">所患疾病</label></div>
					            	<div className="weui_cell_bd weui_cell_primary text-right">{this.getSelectList(2)}</div>
					            	<div className="weui_cell_ft"></div>
					        	</div>
						    </div>
			            </div>
			            <div className="weui_btn_area">
		                	<button className="weui_btn weui_btn_primary" onClick={this.submit.bind(this)}>提交病历</button>
		                </div>

                        <DatePicker 
                            max={this.state.maxTime}
                            theme="ios"
                            value={this.state.time}
                            isOpen={this.state.isOpen}
                            onSelect={this.datepickerSelect}
                            onCancel={this.datepickerCancel}/>
					</div>
				</div>
			</div>
		)
	}
});