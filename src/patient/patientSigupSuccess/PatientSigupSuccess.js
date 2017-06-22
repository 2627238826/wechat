'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');


module.exports = React.createClass({
    componentDidMount: function() {
    },
    render: function() {
        return (
            <div className="weui_msg">
            	<DocumentTitle title={this.props.params.title?this.props.params.title:'提交成功'}/>
			    <div className="weui_icon_area"><i className="weui_icon_success weui_icon_msg"></i></div>
			    <div className="weui_text_area">
			        <h2 className="weui_msg_title">{this.props.params.text!=0?this.props.params.text:'提交成功'}</h2>
			    </div>
			 
			</div>
        )
    }
})
