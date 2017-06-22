'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var History = ReactRouter.hashHistory;
var DocumentTitle = require('react-document-title');


module.exports = React.createClass({
    componentDidMount: function() {
        Tools.hackWehcatTitle();
    },
    funOk: function() {
        Tools.weixin.init().then(
            function(wx) {
                wx.closeWindow();
            }, 
            function(error) {
                Tools.tipDialog('关闭失败！')
            }
        ); 
    },
    render: function() {
        return (
            <div className="weui_msg">
            	<DocumentTitle title="提交成功"/>
			    <div className="weui_icon_area"><i className="weui_icon_success weui_icon_msg"></i></div>
			    <div className="weui_text_area">
			        <h2 className="weui_msg_title">您的患者报到资料已提交成功</h2>
                    <p className="weui_msg_desc">医生将尽快与你联系</p>
			    </div>
                <div className="weui_opr_area">
                    <p className="weui_btn_area">
                        <button className="weui_btn weui_btn_primary" onClick={this.funOk}>关闭</button>
                    </p>
                </div>
			</div>
        )
    }
})
