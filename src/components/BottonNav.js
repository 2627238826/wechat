'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;


module.exports = React.createClass({
    render: function() {
        return (
            <div className="weui_tabbar">
            	<Link to="findDoctor" className="weui_tabbar_item">
		            <div className="weui_tabbar_icon">
		                <img src="https://weui.github.io/weui/images/icon_nav_msg.png" alt=""/>
		            </div>
		            <p className="weui_tabbar_label">找医生</p>
		        </Link>
		        <Link to="singup/3/0" className="weui_tabbar_item">
		            <div className="weui_tabbar_icon">
		                <img src="https://weui.github.io/weui/images/icon_nav_button.png" alt=""/>
		            </div>
		            <p className="weui_tabbar_label">我是医生</p>
		        </Link>
		        <Link to="scoreSearch/1/0/0" className="weui_tabbar_item">
		            <div className="weui_tabbar_icon">
		                <img src="https://weui.github.io/weui/images/icon_nav_button.png" alt=""/>
		            </div>
		            <p className="weui_tabbar_label">我的积分</p>
		        </Link>
		        <Link to="scanDrugCode/1/0/0" className="weui_tabbar_item">
		            <div className="weui_tabbar_icon">
		                <img src="https://weui.github.io/weui/images/icon_nav_button.png" alt=""/>
		            </div>
		            <p className="weui_tabbar_label">扫码积分</p>
		        </Link>
		    </div>
        )
    }
})
