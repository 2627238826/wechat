'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
require('./DownApp.css');

module.exports = React.createClass({
    funInitDownLoad: function() {
        if (!this.state.device.app) return;

        switch (this.state.device.app) {
            case 'weixin':
            case 'qq':
            case 'weibo':
                this.setState({
                    isShowTip: true
                })
                break;
            default:
                if (device.platform === 'Android') {
                    window.location.href = this.state.Android_url;
                } else if (device.platform === 'Android') {
                    window.location.href = this.state.iOS;
                }
                break;
        }
    },
    getInitialState: function() {
        return {
            device: {}
        }
    },
    componentDidMount: function() {
    	Tools.hackWehcatTitle();
        var device = Tools.discernDevice();
        // console.log(device);
        this.setState({
            device: device,
            iOS_url: 'https://itunes.apple.com/cn/app/xuan-guan-jian-kang/id1092868086?mt=8',
            Android_url: 'http://www.chinamediportal.com/replease/dGroupPatient-release.apk_0.9.040601.174.apk',
            isShowTip: false
        })


        Tools.weixin.init().then(function(wx) {
            // 开启右上角按钮
            wx.showOptionMenu();
        });
    },
    render: function() {
        return (
            <div>
            	<DocumentTitle title="安装「玄关健康」，一分钟联系名医专家"/>
            	<div className="text-center mrt-20 mrb-20">
			        <div className="inline-block v-l-m">
			            <img className="logo" src={require('./img/logo_p.png')} id="logo"/>
			        </div>
			        <div className="inline-block mrl-10 v-l-m">
			            <h3 className="ft-s-24 text-left p-t-3 p-b-3">玄关健康</h3>
			            <p className="ft-s-14 text-left p-t-3 p-b-3">您的健康服务专家</p>
			        </div>
			    </div>
			    <div className="link-wrap text-center">
			    {
			    	{
			    		'iOS':(<a className="link-btn" onClick={this.funInitDownLoad}><img src={require('./img/apple.png')} /> AppStore 下载</a>),
			    		'Android':(<a className="link-btn" onClick={this.funInitDownLoad}><img src={require('./img/android.png')} /> Android 下载</a>)
			    	}[this.state.device.platform]
			    }
			    </div>
			    <div className="img-ga text-center mrt-50">
			        <img src={require('./img/p_1.png')} />
			        <img src={require('./img/p_2.png')} />
			        <img src={require('./img/p_3.png')} />
			    </div>
			    <div className="link-wrap text-center mrt-20 mrb-20">
			    {
			    	{
			    		'iOS':(<a className="link-btn" onClick={this.funInitDownLoad}><img src={require('./img/apple.png')} /> AppStore 下载</a>),
			    		'Android':(<a className="link-btn" onClick={this.funInitDownLoad}><img src={require('./img/android.png')} /> Android 下载</a>)
			    	}[this.state.device.platform]
			    }
			    </div>
			    {
					this.state.isShowTip?(
						<div>
					    	<div className="tip-win-mask"></div>
						    <div className="tip-win">
						        <div className="inline-block v-l-m">
						            <p className="ft-s-16 ft-w-b p-b-6">链接打不开？</p>
						            <p>请点击右上角</p>
						            {
								    	{
								    		'iOS':(<p>选择“<span className="clr-d-red">在Safari中打开</span>”</p>),
								    		'Android':(<p>选择“<span className="clr-d-red">在浏览器中打开</span>”</p>)
								    	}[this.state.device.platform]
								    }
						        </div>
						        <img className="v-l-m" src={require('./img/goToClick.png')} />
						    </div>
					    </div>
					    ):''
			    }
            </div>
        )
    }
})
