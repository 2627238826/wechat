'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var History = ReactRouter.hashHistory;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../components/ApiFactory.js');
var SearchBar = require('./../../components/SearchBar.js');
var WeUi = require('react-weui');
var Form = WeUi.Form;
var Input = WeUi.Input;
var CellHeader = WeUi.CellHeader;
var Checkbox = WeUi.Checkbox;
var CellBody = WeUi.CellBody;

var clientHeight = document.body.clientHeight;
var clientWidth = document.body.clientWidth;
var style = {
    search_wrapper: {
        width: '100%',
        zIndex: '1',
        position: 'fixed',
        top: '0',
        left: '0'
    },
	result: {
		height: '20px',
		lineHeight: '22px',
		paddingLeft: '10px',
		borderBottom: '1px solid #d9d9d9',
		color: '#aaa',
        boxSizing: 'border-box',
        backgroundColor: '#fbf9fe'
	},
    illList: {
        width: '100%',
        height: '100%',
        paddingTop: '64px',
        marginTop: '0',
        overflow: 'auto',
        boxSizing: 'border-box'
    }
}

module.exports = React.createClass({
	getInitialState: function(){

        var selectObj = this.props.location.state.selectList; // 已选中的疾病

		var _that = this;
        var searchBar = {
            searchButonText: '搜索疾病',
            isFocus: true,
            key: selectObj.keyword,
            callback: function(key) {
                _that.setState({
                    keyword: key
                });

                _that.handleChange(key);
            }
        }

		return {
			access_token: this.props.params.access_token || '',
			doctorId: this.props.params.doctorId || '',
			illList: [],
            selectObj: selectObj,
			keyword: selectObj.keyword,
            loadEnd: false,
            isRecomendDis: true, // 结果是否是擅长里面的
			searchBar: searchBar
		};
	},
	componentWillMount: function() {
        Tools.hackWehcatTitle();

        if(this.state.selectObj.id && !this.state.selectObj.isRecomendDis) {
            this.handleChange(this.state.selectObj.keyword)
        } else {
            // 根据医生擅长推荐疾病
            Tools.fetch({
                url: ApiFactory.doctor.getDocRecomendDis,
                data: {
                    access_token: this.state.access_token,
                    doctorId: this.state.doctorId
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    this.setState({
                        illList: _data
                    })
                }

                this.setState({
                    loadEnd: true
                })
            }.bind(this))
        }
	},
	// 搜索
    handleChange: function(text) {
        Tools.fetch({
            url: ApiFactory.findByName,
            data: {
                access_token: this.state.access_token,
                name: text
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            if (_data) {
            	this.setState({
            		illList: _data,
                    isRecomendDis: false
            	})
            }

            this.setState({
                loadEnd: true
            })
        }.bind(this))
    },
    // 疾病点击
    addIllness: function(item, e) {
    	e.preventDefault();
        if(e && e.stopPropagation) {
            e.stopPropagation();
        }
        item.isRecomendDis = this.state.isRecomendDis; // 是否是擅长查询的结果
        item.keyword = this.state.keyword; // 搜索关键字

    	window.selectIllnessCallBack(item);
    	History.goBack();
    },
    // 默认选中已选择的疾病
    isSelected: function(item) {
        if(!this.state.selectObj.id) {
            return false;
        }
        return item.id == this.state.selectObj.id;
    },
	render: function() {
		return (
			<div style={{width: '100%', height: '100%'}}>
				<DocumentTitle title="选择疾病"/>
                <div style={style.search_wrapper}>
    				<SearchBar data={this.state.searchBar}/>
    				<div style={style.result}>搜索结果</div>
                </div>
				<div style={style.illList}>
				{
					this.state.illList.length < 1 ? (
                        !this.state.loadEnd ? '' : (
                            <div style={{"margin-top":"3rem", textAlign:'center'}}>
                                <img src={require('./../../img/search.png')} width="60px" height="60px"/>
                                <div style={{width:'100%', lineHeight:'30px', color: '#aaa'}}>无数据</div>
                            </div>
                        )
					) : (
						<Form checkbox style={{marginTop:'0px'}}>
						{
		                	this.state.illList.map(function(val) {
		                		return (
	    							<label className="weui_cell weui_check_label" onClick={this.addIllness.bind(this, val)}>
										<CellHeader>
											<Checkbox name="checkbox" value="1" checked={this.isSelected(val)}/>
										</CellHeader>
										<CellBody style={{height: '20px'}}>{val.name}</CellBody>
									</label>
		                		)
		                	}.bind(this))
		                }
		                </Form>
		            )
				}
				</div>
			</div>
		)
	}
});
