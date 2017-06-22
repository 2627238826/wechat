'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

module.exports = React.createClass({
    render: function() {
        return (
            <Link className="weui_cell" to={'groupDetails/'+this.props.data.id} >
                <div className="weui_cell_hd">
                    <img src={this.props.data.logoUrl?this.props.data.logoUrl:'http://default.test.file.dachentech.com.cn/user/default.jpg'} alt="" className="cover cover-max r-max"/>
                </div>
                <div className="weui_cell_bd weui_cell_primary">
                    <p className="text-dark text-md">{this.props.data.name} </p>
                    <p className="summary text-sm">专家成员：{this.props.data.memberNumber}&nbsp;&nbsp; 就诊量：{this.props.data.groupCureNum}</p>
                    <p className="text-dark summary text-sm">
                        擅长：{this.props.data.skill?this.props.data.skill:'暂无'}
                    </p>
                </div>
                <div className="weui_cell_ft"></div>
            </Link>
        )
    }
});
