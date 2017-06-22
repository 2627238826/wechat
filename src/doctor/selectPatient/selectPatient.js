'use strict';
require('./selectPatient.css');
var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../components/ApiFactory.js');

var ww = document.body.clientWidth;
var style = {
    patient_name: {
        maxWidth: ww - 130 + 'px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    }
}

module.exports = React.createClass({
	// 绑定用户
    funAplyUser: function(order) {
        var url = 'selectPatient/' + this.props.params.doctorId + '/' + (this.props.params.access_token || 0);
        Tools.weixin.applyGetUserInfo({
            state: url,
        })
    },
    // 检查该微信号是否已绑定
    funChackBindWechat: function() {
        var _that = this;
        Tools.fetch({
            url: ApiFactory.weixin.getWeChatStatus4MP,
            data: {
                code: _that.props.params.code,
                userType: 1
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
                // 已绑定
                if (_data.wechatStatus == '2') {
                    var param = { doctorId: _data.doctorId, access_token: _data.access_token };
                    _that.setState({
	                    access_token: _data.access_token,
	                    doctorId: _that.props.params.doctorId?_that.props.params.doctorId:_data.doctorId
	                })
                    _that.funGetPatients();
                    _that.funGetDoctorInfo();

                } // 未绑定
                else if (_data.wechatStatus == '1') {
                    _that.props.history.pushState(null, "/siginAndSigup/"+_that.props.params.doctorId+"/0/selectPatient009/" + _that.props.params.code)
                }
            }
        })
    },
    //获取患者列表
    funGetPatients: function(){
        var _that = this;
		Tools.fetch({
            url: ApiFactory.order.getPatientsWithStatus,
            data: {
                access_token: _that.state.access_token,
                doctorId : _that.state.doctorId
            }
        }).then(function(rsp) {
        	var _data = Tools.dealResponse(rsp);
            if (_data) {
                if(_data.length == 1 && (_data[0].checkInStatus == 0 || _data[0].checkInStatus == 3)) { // 只有一个身份切可以报到
                    _that.funPatientCheckIn(_data[0]);
                } else {
                    _that.setState({
                        patientsList: _data || []
                    })
                } 
            }
        })
    },

    getInitialState: function() {

        var _this = this;
        var params = this.props.params;
        return {
            patientsList: [],
            access_token:this.props.params.access_token||'',
			doctorId:this.props.params.doctorId||'',
			doctorInfo:[]
        }
    },
    componentDidMount: function() {
        var params = this.props.params;
        // 没有获取微信code
        if (!params.code || params.code == 0) {
            this.funAplyUser();
        } else {
            this.funChackBindWechat();
        }

        this.setState({
            params: params
        });
        Tools.hackWehcatTitle();

    },
	funGetDoctorInfo: function() {
		var _that=this;
		//查询医生信息
		Tools.fetch({
			url:ApiFactory.doctor.basicInfo,
			data:{
				doctorId:this.props.params.doctorId
			}
		}).then(function(rsp){
			Tools.dealResponse(rsp);
			if(rsp.data){
				_that.setState({doctorInfo:rsp.data});
			}
		});
	},
    funPatientCheckIn: function(patient,e) {
    	//0：没有报道过，1：已报到医生未处理；2：已报到且医生已确定；3：已报到医生已取消
    	if(patient.checkInStatus==1){
    		//只提示
    		Tools.alertModal('您已向'+this.state.doctorInfo.name+'医生发起了患者报到、请耐心等待医生回复','好',"");
    	}else if(patient.checkInStatus==2){
    		//跳转下载界面
			Tools.alertModal('您已向'+this.state.doctorInfo.name+'医生报到成功、如需咨询医生请下载玄关健康咨询沟通','好',"http://xg.mediportal.com.cn/health/web/app/downloadHealth.html");
    	}else{
    		//填写资料
    		 this.props.history.pushState(null,"/patientReportInfo/"+this.state.doctorId+"/"+this.state.access_token+"/"+patient.id);
    	}
    	
    },
	render: function() {
		var _this=this;
		//sex：1男，2女，3保密
		return (
			<div>
				<DocumentTitle title="选择患者"/>
				<div className="weui_panel weui_panel_access">
                    <div className="weui_panel_bd ">
                    {
                    	this.state.patientsList?(
                			this.state.patientsList.map(function(patient,index){
                				return (
            						<div className="patient_info" style={{position: 'relative'}} onClick={_this.funPatientCheckIn.bind(this,patient)}>
                    					<div className="patient_basic">
                    						<div className="m-r-xxs text-xmd" style={style.patient_name}>{patient.userName}</div>
					                        {
					                            {
					                                1:<div className="text-xs bg-3889F5 text-white m-r-xxs r-max p-l-r-xxs"><div className="patient_sex male"></div>{patient.ageStr}</div>,
					                                2:<div className="text-xs bg-FF7777 text-white m-r-xxs r-max p-l-r-xxs"><div className="patient_sex female"></div>{patient.ageStr}</div>,
					                                3:<div className="text-xs bg-3889F5 text-white m-r-xxs r-max p-l-r-xxs"><div className="patient_sex male"></div>{patient.ageStr}</div>,
					                            }[patient.sex]
					                        }
                    						{patient.relation=='本人'?(<div className="text-xs text-white bg-39CF78 r-max p-l-r-xxs">本人</div>):''}
                    					</div>
                    					<div className="text-gray m-t-xs">
                    						电话：{patient.telephone}
                    					</div>
                    					{
                    						{
                    							0:'',
                    							1:'',
                    							2:<div className="check_in"></div>,
                    							3:''
                    						}[patient.checkInStatus]
                    					}
                					</div>
            					)
                			})
                		):''
                    }
                    </div>
                </div>
			</div>
		)
	}
});