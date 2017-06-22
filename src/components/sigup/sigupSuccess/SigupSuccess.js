'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');


module.exports = React.createClass({
    componentDidMount: function() {
        // console.log(this.props.params.type)
    },
    render: function() {
        return (
            <div className="weui_msg">
            	<DocumentTitle title={this.props.params.text!=0?this.props.params.text:'提交成功'}/>
			    <div className="weui_icon_area"><i className="weui_icon_success weui_icon_msg"></i></div>
			    <div className="weui_text_area">
			        <h2 className="weui_msg_title">{this.props.params.text!=0?this.props.params.text:'提交成功'}</h2>
			    </div>
			    <div className="weui_opr_area">
			        <p className="weui_btn_area">
			        {
			            {
			            	// 患者
			            	1:(<a href="http://xg.mediportal.com.cn/health/web/app/downPatient.html?a=1" className="weui_btn weui_btn_primary">立即体验</a>),
			            	// 医生
			            	// 3:(<a href="http://xg.mediportal.com.cn/health/web/app/downDoctor.html?a=1" className="weui_btn weui_btn_primary">立即体验</a>),
			            	3:(<a href="http://xg.mediportal.com.cn/health/web/app/downloadDoctorApp.html?a=1" className="weui_btn weui_btn_primary">立即体验</a>),
						}[this.props.params.type]
			        }
			        </p>
			    </div>
			</div>
        )
    }
})
