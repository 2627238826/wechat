'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var History = ReactRouter.hashHistory;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../components/ApiFactory.js');
var ActionSheet = require('./../../components/ActionSheet.js');
var WeImg = require('./../weImg/weImg.js');

var style={
	patient_img:{
		width:'100%',
		height:'55px',
		textAlign:'center',
		marginTop:'10px'
	}
}
module.exports = React.createClass({
	getInitialState: function(){
		var _that=this;
		return {
            selectedPatient: {},
			doctorInfo:[],
			userInfo:[],
			access_token:this.props.params.access_token || '',
			doctorId:this.props.params.doctorId||'',
			patientId:this.props.params.patientId||'',
            diseaseDesc: '',
            imageUrls:[],
            upStatus: false // 是否有图片正在上传
		}
	},
	componentWillMount: function() {

        var _that = this;
		//查询医生信息
		_that.funGetDoctorInfo();
		//获取患者
		_that.funGetPatient();
        /*var params = this.props.params;
        // 没有获取微信code
        if (!params.code || params.code == 0) {
            this.funAplyUser();
        } else {
            this.funChackBindWechat();
        }
*/
        Tools.hackWehcatTitle();
	},
	// 绑定用户
    /*funAplyUser: function(order) {
        var url = 'patientReportInfo/' + this.props.params.doctorId + '/' + (this.props.params.access_token || 0);
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
                    _that.setState({
	                    access_token: _data.access_token,
	                    doctorId: _data.doctorId
	                });
					//查询医生信息
					_that.funGetDoctorInfo();
					//获取患者
					_that.funGetPatients();

                } // 未绑定
                else if (_data.wechatStatus == '1') {
                    _that.props.history.pushState(null, "/siginAndSigup/"+_that.props.params.doctorId+"/0/patientReportInfo009/" + _that.props.params.code)
                }
            }
        })
    },*/

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
    // 选择患者
    funSelectedPatient: function(patient) {
        this.setState({
            selectedPatient: patient
        })
        this.state.close();
    },
    //获取患者信息
    funGetPatient: function(){

		var _that=this;
		//查询医生信息
		Tools.fetch({
			url:ApiFactory.patient.packpatientFindById,
			data:{
				id:this.props.params.patientId,
				access_token: _that.state.access_token
			}
		}).then(function(rsp){
			Tools.dealResponse(rsp);
			if(rsp.data){
				_that.setState({selectedPatient:rsp.data});
			}
		});
    },
    onChange: function(_ref) {
        var _state = {};
        _state[_ref] = this.refs[_ref].value;
        this.setState(_state);
    },
    funCheckIn: function() {
    	if(this.state.upStatus) {
    		Tools.tipDialog('图片正在上传，请稍后！');
    		return ;
    	}
    	if(!this.state.diseaseDesc || !this.state.diseaseDesc.trim()) {
    		Tools.tipDialog('请填写您在医生处就诊的相关信息！');
    		return ;
    	}
    	Tools.fetch({
            url: ApiFactory.order.takeCheckIn,
            data: {
                access_token: this.state.access_token,
                patientId: this.state.patientId,
                doctorId: this.state.doctorId,
                phone: this.state.selectedPatient.telephone,
                imageUrls: this.state.imageUrls || [],
                message: this.state.diseaseDesc
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
            	Tools.tipDialog('报到成功！');
            	History.pushState(null, 'submitSuccess');
            }
        }.bind(this))
    },
    funGetImg:function(imgArr, status){
    	var _status = !status ? false : true;
    	this.setState({
    		imageUrls: imgArr,
    		upStatus: _status
    	});
    },
    goMedicalRecord: function() {
    	if(this.state.upStatus) {
    		Tools.tipDialog('图片正在上传，请稍后！');
    		return ;
    	}
    	if(!this.state.diseaseDesc || !this.state.diseaseDesc.trim()) {
    		Tools.tipDialog('请填写您在医生处就诊的相关信息！');
    		return ;
    	}
    	var stateKeep = {
    		patientObj: {
				access_token: this.state.access_token || '',
				doctorId: this.state.doctorId || '',
				patientId: this.state.patientId || '',
				diseaseDesc: this.state.diseaseDesc,
				telephone: this.state.selectedPatient.telephone,
				imageUrls: this.state.imageUrls||[]
			}
    	};
    	History.pushState(stateKeep, 'medicalRecord');
    },
	render: function() {
		var _that=this;
		return (
				<div>
					<DocumentTitle title="患者报到"/>
					
	                <div className="weui_panel weui_panel_access">
	                    <div className="weui_cells_access clear text-md">
	                        <Link className="pull-left text-dark w-full" to={'doctorDetails/'+_that.state.doctorInfo.userId + '/1'} >
	                            <div className="weui_cell">
					                <div className="weui_cell_hd">
					                    <img src={_that.state.doctorInfo.headPicFileName?_that.state.doctorInfo.headPicFileName:'http://default.test.file.dachentech.com.cn/user/default.jpg'} alt="" className="cover cover-max r-max"/>
					                </div>
					                <div className="weui_cell_bd weui_cell_primary">
					                    <p className="text-dark text-md">{_that.state.doctorInfo.name} </p>
					                    <p className="summary text-dark text-sm">{_that.state.doctorInfo.title}-{_that.state.doctorInfo.departments}</p>
					                    <p className="text-dark summary text-sm">
					                        {_that.state.doctorInfo.groupName}
					                    </p>
					                </div>
					                <div className="weui_cell_ft"></div>
					            </div>
	                        </Link>
	                    </div>
	                    <div style={style.patient_img}>
	                    	<img width="220" height="50"  src={require('./img/patient_xhdpi.png')}/>
	                    </div>
	                    <div className="weui_panel_bd">
			                {/*<div className="weui_cells weui_cells_access text-sm">*/}
			                <div className="weui_cells text-sm">

			                    <div className="weui_cell">
			                        <div className="weui_cell_bd weui_cell_primary">
			                            <p className="text-gray">患者</p>
			                        </div>
			                        <div className="weui_cell_ft">{this.state.selectedPatient.userName}</div>
			                    </div>
			                </div>
		                    <div className="weui_cell text-sm">
		                        <div className="weui_cell_bd weui_cell_primary">
		                            <p className="text-gray">手机号</p>
		                        </div>
		                        <div className="weui_cell_ft">{this.state.selectedPatient.telephone}</div>
		                    </div>
		                    <div className="weui_cell b-b b-grey">
		                        <div className="weui_cell_bd weui_cell_primary">
		                        	<div className="text-gray" style={{marginBottom: '5px'}}>留言</div>
		                            <textarea className="weui_textarea" 
		                            	ref="diseaseDesc" 
		                            	value={this.state.diseaseDesc} 
		                            	onChange={this.onChange.bind(this,'diseaseDesc')}
		                                placeholder={'请详细描述一下您在医生处就诊的相关信息'} 
		                                rows="3" >
		                            </textarea>
		                        </div>
		                    </div>
	                    </div>
	                    <div className="weui_panel_bd ">
	                    	<div className="weui_cell text-gray">为了让医生更好地了解您的病情，您需要拍照上传您的：病历本、住院记录、化验单、医学影像、X光片、处方单，及其他相关资料</div>
		                    <WeImg  callback={_that.funGetImg.bind(this)} token={this.state.access_token}/>
	                    	<div className="weui_cell w-full">如果您还没有影像资料，请
	                    		<div className="text-30b2cc m-l-xs text-underline" onClick={this.goMedicalRecord}>
	                    			手动填写病历
	                    		</div>
	                    	</div>
	                    </div>
	                </div>
	                <div className="weui_btn_area">
	                	<button className="weui_btn weui_btn_primary" onClick={this.funCheckIn.bind(this)}>立即报到</button>
	                </div>
				</div>
			)
	}
});
