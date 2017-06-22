'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

module.exports = React.createClass({
    render: function() {
        return (
            <Link className="weui_cell" to={'doctorDetails/'+this.props.data.doctorId +'/0'} >
				<div className="weui_cell_hd">
					<img src={this.props.data.doctorPath?this.props.data.doctorPath:'http://default.test.file.dachentech.com.cn/user/default.jpg'} alt="" className="cover cover-max r-max"/>
				</div>
				<div className="weui_cell_bd weui_cell_primary">
					<h3 className="title text-md">{this.props.data.doctorName}  {this.props.data.doctorDept}  {this.props.data.doctorTitle}</h3>
					<p className="summary text-sm">{this.props.data.doctorGroup}</p>
					<p className="summary text-sm">
						{this.props.data.hospital}
					</p>
				</div>
				<div className="weui_cell_ft"></div>
			</Link>
        )
    }
})
