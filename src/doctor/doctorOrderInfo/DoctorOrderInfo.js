'use strict';

require('./DoctorOrderInfo.css');
var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../components/ApiFactory.js');


var OrderHeader = require('./../orderHearder/orderHearder.js');

module.exports = React.createClass({
    // 绑定用户
    funAplyUser: function(order) {

        var url = 'siginAndSigup/' + order.doctorId + '/' + order.id + '/' + order.packType;
        Tools.weixin.applyGetUserInfo({
            state: url,
        })

    },
    getInitialState: function() {

        var _that = this;
        var params = this.props.params;

        // // 获取医生基本信息
        // (function funGetDoctorBasicInfo(param) {
        //     Tools.fetch({
        //         url: ApiFactory.doctor.basicInfo,
        //         data: {
        //             doctorId: param.doctorId || ''
        //         }
        //     }).then(function(rsp) {
        //         var _data = Tools.dealResponse(rsp);
        //         if (_data) {
        //             _that.setState({
        //                 basicInfo: _data || {}
        //             })
        //         }
        //     })
        // })({ doctorId: params.doctorId });

        // 获取服务套餐
        (function funGetDoctorIntro(param) {
            Tools.fetch({
                url: ApiFactory.query,
                data: {
                    doctorId: param.doctorId || '',
                    packType: params.type,
                    status: 1
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    _that.setState({
                        order: _data[0]
                    })
                }
            })
        })({ doctorId: params.doctorId });

        return {
            order: {},
            // basicInfo: {}
        };
    },
    componentDidMount: function() {
        Tools.hackWehcatTitle();
    },
    render: function() {

        var _that = this;

        return (
            <div className="clear w-full h-full">
        		<DocumentTitle title={this.state.order.name}/>
        		<div className="weui_tabbar_content_box clear w-full h-full over-flow-y-auto">
        			<OrderHeader doctorId={this.props.params.doctorId}/>
					{
						//<div className="weui_cell p-t-b-sm bg-white b-b b-grey">
						//	<div className="weui_cell_hd">
						//		<img src={this.state.order.image} alt={this.state.order.name} className="cover cover-max r-circle"/>
						//	</div>
						//	<div className="weui_cell_bd weui_cell_primary">
						//		<h3 className="title">{this.state.order.name}</h3>
						//		<p className="summary">
						//			<span className="text-orange text-xmd">¥{this.state.order.price/100}</span>
						//			<span className="text-sm"> /{this.state.order.timeLimit}分钟</span>
						//		</p>
						//	</div>
						//	<div className="weui_cell_ft"></div>
						//</div>
					}

					<div className="weui_panel weui_panel_access p-b-sm ">
				        <div className="weui_panel_hd weui_cells_access clearfix text-md text-dark">
					        服务介绍
				        </div>
				        <div className="service_process_box m-t-sm">
		                	<div className="service_process_box_bg_line"></div>
		                	<div className="service_process_item">
		                		<i className="service_process_step step1"></i>
		                	</div>
		                	<div className="service_process_item">
		                		<i className="service_process_step step2"></i>
		                	</div>

		                	<div className="service_process_item">
								{
									this.props.params.type==1?(<i className="service_process_step step3_message"></i>):(<i className="service_process_step step3_phone"></i>)
								}

		                	</div>
		                	<div className="service_process_item">
		                		<i className="service_process_step step4"></i>
		                	</div>
		                </div>
		                <div className="service_process_box text-xs">
		                	<div className="service_process_item">
		                		填写资料
		                	</div>
		                	<div className="service_process_item">
		                		支付订单
		                	</div>
		                	<div className="service_process_item">
								{this.state.order.name}
		                	</div>
		                	<div className="service_process_item">
		                		服务结束
		                	</div>
		                </div>
		                <div className="weui_media_box m-t-lg">
			                <div className="text-md text-dark">
			                	服务介绍
			                </div>
			                <ul className="weui_media_desc m-t-sm list-style-disc">
			                	<li className="des_li">{this.props.params.type==1?'医生将对患者的病情描述与咨询内容提供图文咨询服务。':'医生将对患者的病情描述与咨询内容提供电话咨询服务。'}</li>
								<li className="des_li">为提高咨询效率，方便患者得到有效的咨询指导，请尽量详细提供病情资料。</li>
								<li className="des_li">医生咨询内容仅作为对患者病情的建议，不作为实际治疗的凭证。</li>
			                </ul>
				        </div>
						<div className="weui_media_box m-t-xs">
							<div className="text-md text-dark">
								服务保障计划
							</div>
							<ul className="weui_media_desc m-t-sm list-style-disc">
								<li className="des_li">本次咨询服务含医生3次回复。为节省沟通次数，提问时请尽量完整一次性描述病情与问题。</li>
								{
									this.props.params.type==2?(<li className="des_li">如果付款48小时后医生仍未开启服务，您可以取消订单。</li>):''
								}
								<li className="des_li">如果需要取消订单或有其它问题可以联系医生助手或客服处理。</li>
							</ul>
						</div>
						{
							//<div className="weui_media_box m-t-xs">
							//	<div className="text-md text-dark">
							//		购买方式
							//	</div>
							//	<ul className="weui_media_desc m-t-sm list-style-disc">
							//		<li>与医生预约时间成功后，将订单保留<span className="text-orange">2小时</span>，若未支付将自动取消订单。</li>
							//		<li>支付方式包括 <span className="text-orange">微信支付</span> 和 <span className="text-orange">支付宝支付</span>。</li>
							//	</ul>
							//</div>
						}

				    </div>
        		</div>
			    <div className="weui_tabbar p-t-none">
				    <div className="weui_tabbar_item p-t-none">
						<p className="tabbar-item-price text-ellipsis text-orange"><span className="text-dark" style={{'font-size':'0.6rem'}}>价格：</span><span>¥{(this.state.order.price||0)/100}</span>{this.props.params.type==2?(<span className="text-md">/{this.state.order.timeLimit}分钟</span>):''}</p>
						<a style={{'width':'50%','float':'right'}} onClick={this.funAplyUser.bind(this,_that.state.order)} className="weui_btn weui_btn_primary r-none after-none">下一步</a>
						<div className="clear-fix"></div>
				    </div>
			    </div>
        	</div>
        )
    }
})
