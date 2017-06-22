'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var hashHistory = ReactRouter.hashHistory;

module.exports = React.createClass({
    // 搜索
    funSearch: function(e) {
        e.preventDefault();
        if (this.state.callback) {
            this.state.callback(this.refs.search_input.value);
        }
        // 搜索后移除输入框光标，hak Andriod 自动雕出输入法
        this.refs.search_input.blur();
    },
    // 取消
    funCancel: function() {
        hashHistory.goBack();
    },
    // 打开搜索
    funOnSearch: function() {

        var searchBar = this.state;
        searchBar.class = 'weui_search_bar weui_search_focusing';

        this.setState(searchBar);
    },
    // 关闭搜索
    funOffSearch: function() {

        var searchBar = this.state;
        searchBar.class = 'weui_search_bar';

        this.setState(searchBar);
    },
    // 光标定位到搜索框
    funSearchInputFocus: function() {

        this.refs.search_input.focus();
    },
    // 设置输入框内容
    funSetInputValue: function(value) {
        this.refs.search_input.value = value || '';
    },
    getInitialState: function() {
        return {
            class: 'weui_search_bar',
            key: this.props.data.key || '',
            isFocus: this.props.data.isFocus || true,
            callback: this.props.data.callback || null,
            searchButonText: this.props.data.searchButonText || '搜索'
        };
    },
    componentDidMount: function() {
        var _that = this;

        this.refs.search_input.value = this.state.key;

        // 获取输入焦点
        if (this.state.isFocus) {
            setTimeout(function() {
                _that.funSearchInputFocus();
            }, 0)
        }
    },
    render: function() {
        return (
            <div className="w-full">
                <div className={this.state.class} >
                    <form className="weui_search_outer" onSubmit={this.funSearch}>
                        <div className="weui_search_inner">
                            <i className="weui_icon_search"></i>
                            <input type="search" ref="search_input" onFocus={this.funOnSearch} className="weui_search_input" placeholder={this.state.searchButonText} />
                            <a href="javascript:" className="weui_icon_clear" onClick={this.funSetInputValue.bind(this,'')}></a>
                        </div>
                        <label for="search_input" className="weui_search_text" onClick={this.funSearchInputFocus}>
                            <i className="weui_icon_search"></i>
                            <span>{this.state.searchButonText}</span>
                        </label>
                    </form>
                    <a href="javascript:void(0)" className="weui_search_cancel" onClick={this.funCancel}>取消</a>
                </div>
            </div>
        )
    }
})
