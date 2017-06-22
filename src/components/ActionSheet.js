'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var WeUi = require('react-weui');
var ActionSheet = WeUi.ActionSheet;


module.exports = React.createClass({
    show: function() {
        this.setState({ show: true });
    },
    hide: function() {
        this.setState({ show: false });
    },
    setMenus: function(menus) {
        this.setState({
            menus: menus
        })
    },
    getInitialState: function() {
        if (!this.props.configCallback) {
            console.warn('未设置configCallback');
        } else {
            this.props.configCallback(this.show, this.setMenus, this.hide);
        }

        return {
            show: false,
            menus: this.props.menus || [],
            actions: [{
                label: '取消',
                onClick: this.hide.bind(this)
            }]
        };
    },
    render: function() {
        return (
            <ActionSheet show={this.state.show} menus={this.state.menus} actions={this.state.actions} onRequestClose={this.hide.bind(this)}/>
        )
    }
})
