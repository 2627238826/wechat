'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../../components/ApiFactory.js');
var PageView = require('./../../../components/pageView/PageView.js');

module.exports = React.createClass({
    // 绑定用户
    funAplyUser: function(e) {
        Tools.weixin.applyGetUserInfo({
            state: 'siginAndSigup/' + this.props.params.doctorId + '/' + this.props.params.packId + '/' + this.props.params.packType,
        })

    },
    getInitialState: function() {
        return {
            plan: {},
            pageIndex: 0,
            templateId: '',
            planList: [],
            isNoMore: false
        }
    },

    funFindPage: function() {
        var _that = this;
        this.setState({
            isNoMore: false
        });
        Tools.fetch({
            url: ApiFactory.findPage,
            data: {
                // carePlanId: '100906',
                carePlanId: _that.state.templateId,
                pageIndex: _that.state.pageIndex 
            }
        }).then(function(rsp) {
            var _data = Tools.dealResponse(rsp);
            var lastList=_that.state.planList;
            if (_data) {
            	// _that.state.planList.concat(_data);
            	if(_data.length&&_data.length>0){
  					_that.setState({   
                        planList: lastList.concat(_data)
                    });
            	}else{
            		  _that.setState({
                        isNoMore: true
                    })
            	}
              
                  
            }   
        })
    },
    funLoadMore: function() {
        var _that = this;
             _that.setState({
                        pageIndex: _that.state.pageIndex + 1
                    });
        this.funFindPage();
    },
    componentDidMount: function() {
        var params = this.props.params;

        var _that = this;
        Tools.hackWehcatTitle();
        // 获取计划详情
        (function funGetPlanInfo(param, callback) {
            Tools.fetch({
                url: ApiFactory.findByPack2,
                data: {
                    packId: param.packId || ''
                }
            }).then(function(rsp) {
                var _data = Tools.dealResponse(rsp);
                if (_data) {
                    
                    _that.setState({
                        plan: _data,
                        pageIndex: 0,
                        templateId: _data.templateId
                    })
                    callback();

                }
            })
        })({ packId: params.packId }, _that.funFindPage);
    },
    render: function() {
        var _that = this;
        var isDateSeqStrExist={};//存储已经有的日期，过滤不再显示。
        var data=
         (
            <div className="clear w-full h-full">
            <div className="  clear w-full h-full over-flow-y-auto p-b-lg">
                <div className="weui_cell p-t-b-sm bg-white b-b b-grey">
                    <div className="weui_cell_bd">
                        <h3 className="title">{this.state.plan.careName}</h3>
                        <p className="summary">
                            <span className="text-sm">价格</span>&nbsp;&nbsp;&nbsp;
                            <span className="text-orange">¥{(this.state.plan.price||0)/100}</span>
                        </p>
                        <p className="m-t-xs text-dark">{this.state.plan.careDesc||'无介绍'}</p>
                        <p className="m-t-xs">所属病种：
                            {
                                this.state.plan.diseaseTypes&&this.state.plan.diseaseTypes.length>0?(
                                    this.state.plan.diseaseTypes.map(function(diseaseType,index){
                                        return(
                                            <span>{index!=0?(<span>&nbsp;&nbsp;</span>):''}{diseaseType.name}</span>
                                            )
                                    })
                                    ):''
                            }
                        </p>
                        <p className="summary m-t-xs text-sm">
                            <img src={require('./img/help.png')} width="16" height="16" className="v-align-middle m-r-xxs" style={{'marginTop':'-3px'}}/>
                            <lable>求助次数&nbsp;<span className="text-orange">{this.state.plan.helpTimes||0}</span></lable>
                        </p>
                    </div>
                </div>
                {
                    this.state.plan.doctoreRatios&&this.state.plan.doctoreRatios.length>0?(
                        <div className="weui_cells weui_cells_access">
                            <div className="weui_cell">
                                <div className="weui_cell_bd weui_cell_primary">
                                    {this.state.plan.doctoreRatios[0].doctoreName}专家组({this.state.plan.doctoreRatios.length})
                                </div>
                                <div className="weui_cell_ft">
                                {
                                    (function () {
                                        return _that.state.plan.doctoreRatios.map(function(pic,index){
                                            if(index<3)
                                            return (

                                                <img src={pic.doctorePic?pic.doctorePic:'http://default.test.file.dachentech.com.cn/user/default.jpg'} style={{'marginRight':'3px'}} alt="" className="logo-sm round v-align-middle inline-block" />
                                            )
                                        })
                                    })()
                                }
                         
                                   
                                </div>
                            </div>
                        </div>
                        ):''
                }
                <div className="weui_cells weui_cells_access">
                       <div className="weui_cell">
                           <div className="weui_cell_bd weui_cell_primary">
                               用药关怀({this.state.plan.count})
                           </div>
                           <div className="weui_cell_ft" style={{'width': '39%','whiteSpace': 'nowrap','textOverflow': 'ellipsis','overflow': 'hidden'}}>
                           {
                                this.state.plan.count>0 && this.state.plan.recipeId?(
                                    <span>{this.state.plan.medicalName}</span>
                                ):(
                                    <span>未生成</span>
                                )
                           }
                    
                              
                           </div>
                       </div>
                   </div>
                <div className="weui_cells weui_cells_access">
                    <div className="p-md">
                        {
                            (function () {

                                if(!_that.state.planList||_that.state.planList.length<1) return;
                                
                                // var listData=_that.state.planList.map(function (schedulePlan,index) {
                                return _that.state.planList.map(function (schedulePlan,index) {
                                        // 10:病情跟踪、20：用药关怀、30：生活量表、40：调查表、50：检查检验项、60：其他提醒
                                    var name = '';
                                    var logo = '';
                                    switch(schedulePlan.type){
                                        case 10:
                                            name='病情跟踪';
                                            logo='illness_following.png';
                                            break;
                                        case 20:
                                            name='用药关怀';
                                            logo='pills.png';
                                            break;
                                        case 30:
                                            name='生活量表评分表';
                                            logo='liangbiao.png';
                                            break;
                                        case 40:
                                            name='调查表';
                                            logo='investigation.png';
                                            break;
                                        case 50:
                                            name='检查检验项';
                                            logo='check.png';
                                            break;
                                        case 60:
                                            name=(schedulePlan.otherRemind&&schedulePlan.otherRemind.content?schedulePlan.otherRemind.content:'其他提醒');
                                            logo='notice.png';
                                            break;
                                    }
                                    
                                return (
                                    <div>
                                    {	
                                    	(function(){
                                    		if(!isDateSeqStrExist[schedulePlan.dateSeqStr]){
                                    			isDateSeqStrExist[schedulePlan.dateSeqStr]=schedulePlan.dateSeqStr;
                                    			return (
			 					    <div className="v-time-line-item" style={{'height':'40px'}}>
			                                            <div className="v-time-line">
			                                                <div className="roundDot"></div>
			                                                <div className="line"></div>
			                                            </div>
			                                            <div className="v-time-content text-md" style={{'paddingTop':'3px'}}>
			                                                {schedulePlan.dateSeqStr}
			                                            </div>
			                                        </div>
		                                    		)
		                                    }
		                               	})()
                                    }
                                    
                                        <div className="v-time-line-item" style={{'height':'40px'}}>
                                            <div className="v-time-line">
                                                <img src={require('./img/'+logo)} width="18" height="18" style={{'marginTop':'2px'}}/>
                                                    <div className="line"></div>
                                            </div>
                                            <div className="v-time-content text-md" style={{'paddingTop':'3px'}}>
                                                {name}
                                            </div>
                                        </div>
                                                    
                                    
                                            
                                </div>
                                    )
                                })
                    
                            })()
                        }
                    </div>
                </div>
            </div>
         
            </div>
        )
        return (
            <div className="h-full position_relative">
                <DocumentTitle title="医生团队"/>
                <div className="h-full w-full ">
		     	<PageView cofig={{
		            data:data,
		            loadMore:_that.funLoadMore,
		            id:'doctorListView',
		            isNoMore:_that.state.isNoMore
		        	}}/>
       			</div>
       		    <div className="weui_tabbar p-t-none fix-bottom">
                    <div className="weui_tabbar_item p-t-none">
                        <p className="tabbar-item-price text-ellipsis text-orange"><span className="text-dark" style={{'font-size':'0.6rem'}}>价格：</span><span>¥{(this.state.plan.price||0)/100}</span><span className="text-md"></span></p>
                        <a style={{'width':'50%','float':'right'}} onClick={this.funAplyUser.bind(this)} className="weui_btn weui_btn_primary r-none after-none">下一步</a>
                        <div className="clear-fix"></div>
                    </div>
                </div>
       		</div>
          
       
            
        )
    }
})
