'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var history = ReactRouter.hashHistory;
var Tools = require('./../Tools.js');

module.exports = React.createClass({
    componentDidMount: function() {

        var param = Tools.paramArry();
        var url = decodeURIComponent(param.state) + '/' + param.code;
        window.location.href = url;

    },
    render: function() {
        return (
            <div className="text-center">
                加载中
            </div>
        )
    }
})
