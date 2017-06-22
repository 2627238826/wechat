'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

require('./takeOrderSuccess.css');

module.exports = React.createClass({
	componentDidMount: function() {
        Tools.hackWehcatTitle();
    },
    render: function() {
        return (
        	<div className="takeOrderSuccess">
        		<dl className="clearfix bg-white b-grey b-b stepbox">
        			<dd className="w-precent-33 pull-left text-center step curStep">① 提交成功</dd>
        			<dd className="w-precent-33 pull-left text-center step">② 在线支付</dd>
        			<dd className="w-precent-33 pull-left text-center step">③ 开始咨询</dd>
        		</dl>
				<div className="weui_msg">
				    <div className="weui_icon_area"><i className="weui_icon_success weui_icon_msg"></i></div>
				    <div className="weui_text_area">
				        <h2 className="weui_msg_title">{this.props.params.text?this.props.params.text:'提交成功'}</h2>
				    </div>
				    <div className="weui_opr_area">
				        <p className="weui_btn_area">
				            <a href="http://xg.mediportal.com.cn/health/web/app/downPatient.html?a=1" className="weui_btn weui_btn_primary">下载APP，与医生实时互动</a>
				        </p>
				        <p className="weui_msg_desc p-md">下载玄关健康后，请在登陆页面选择&nbsp;&nbsp;<span className="text-dark"><img src={require('./img/wechat.png')} className="inline-block" with="18" height="18"/>微信登录</span><br/>以便同步您的微信咨询信息。</p>
				    </div>
				</div>        		
        	</div>
        )
    }
})
