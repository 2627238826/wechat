'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var DocumentTitle = require('react-document-title');
var ApiFactory = require('./../../components/ApiFactory.js');
var ActionSheet = require('./../../components/ActionSheet.js');
var Qiniu = require('react-qiniu');
var WeUi = require('react-weui');
var Toast = WeUi.Toast;

var ww = document.body.clientWidth;

var style ={
	weui_uploader:{
		float: 'left',
	    position: 'relative',
	    margin: '0 5px 10px',
	    width: (ww-70)/4 + 'px',
	    height: (ww-70)/4 + 'px',
	    border:' 1px solid #d9d9d9',
	},
	dis_b:{
		display:'block'
	},
    tabs_img_icon: {
        float: 'left',
        position: 'absolute',
        width: 20,
        height: 20,
        right: -9,
        top: -10,
        backgroundColor: 'red',
        color: '#fff',
        zIndex: 2,
        fontSize: 16,
        lineHeight: '20px',
        borderRadius: 20,
        textAlign: 'center'
    }
}
module.exports = React.createClass({
	getInitialState: function(){
		return {
            token: '',
            domain: '',
            uploadImg: [],
            upStatus: false  // 上传图片状态
		}
	},
	componentWillMount: function(){
		var _this=this;
		//获取七牛的token跟访问路径
		Tools.fetch({
            url:ApiFactory.common.getUploadToken,
            data:{
                access_token:_this.props.token
            }
        }).then(function(rsp){
            _this.setState({token:rsp.data.token,domain:rsp.data.domain});
        });
	},
	//选择图片
	onUpload: function(files) {
        // files.map(function(f) {
        //     f.onprogress = function(e) {
        //     };
        // });
        this.setState({
            upStatus: true
        })

        if (this.props.callback) {
            this.props.callback(this.state.uploadImg, true);
        }
    },
    //上传图片后处理
    onDrop: function(files) {
    	var _this=this;
        var uploadImg=_this.state.uploadImg;
        var count=0; 
        var lengthOver=false; //是否超过八张
        var promiseNum=0; // 图片上传回调计数，判断是否全部上传完毕
        var errorNum=0; // 图片上传失败计数（当图片数量未超过八张时给出提示？）
        
        for(var i=0;i<files.length;i++){
            var name=files[i].name;
        	var type=name.substring(name.indexOf("."),name.length);
        	//判断文件类型为视频
        	if(type.toLowerCase()=='.mp4'||type.toLowerCase()=='.avi'||type.toLowerCase()=='.rmbv'||type.toLowerCase()=='.rm'||type.toLowerCase()=='.asf'||type.toLowerCase()=='.divx'||type.toLowerCase()=='.mpg'||type.toLowerCase()=='.mpeg'||type.toLowerCase()=='.mpe'||type.toLowerCase()=='.wmv'||type.toLowerCase()=='.mkv'||type.toLowerCase()=='.vob'||type.toLowerCase()=='.swf'||type.toLowerCase()=='.3gp'||type.toLowerCase()=='.mov'||type.toLowerCase()=='.flv'){
        		count++;
        		continue;
        	}

            var http="http://";
	        if (window.location.protocol === 'https:') {
	           http = 'https://'
	        }
            
            files[i].uploadPromise.then(function(rsp) {
                promiseNum++;
                if(uploadImg.length >= 8) {
                    lengthOver = true;
                } else {
                    var itemKey = rsp.body.key;
                    uploadImg=uploadImg.concat(http + _this.state.domain + '/' + itemKey);
                }

                funResult();

            }, function(rsp) {
                promiseNum++;
                errorNum++;

                funResult();
            })
            .catch(function(err) {
                // console.log(err);
            })
        }
        if(count>0){
    		Tools.tipDialog('不支持上传视频！');
        }

        function funResult() {
            if(promiseNum == files.length) {
                setTimeout(function() {
                    _this.setState({
                        uploadImg: uploadImg,
                        upStatus: false
                    }); 
                }, 500)
                
                if (_this.props.callback) {
                    _this.props.callback(uploadImg);
                }

                if(lengthOver) {
                    Tools.tipDialog('最多可选择8张图片！');
                } else if(errorNum > 0) {
                    Tools.tipDialog(errorNum + '张图片上传失败！');
                }
            }
        }
    }, 
    removeImg: function(index,e){
    	var oldUploadImg=this.state.uploadImg;
    	oldUploadImg.splice(index,1);
    	this.setState({uploadImg:oldUploadImg});
        if (this.props.callback) {
            this.props.callback(oldUploadImg);
        }
    },
	render: function(){
		var _this=this;
		return (
			<div>
				<div className="weui_cell" style={style.dis_b}>
					{
						this.state.uploadImg&&this.state.uploadImg.length>0?(
							this.state.uploadImg.map(function(imgSrc,index){
			                    return (
			                    <div style={style.weui_uploader}>
			                        <img style={{width:'100%',height:'100%'}} src={imgSrc}/>
			                        <div style={style.tabs_img_icon} onClick={_this.removeImg.bind(this,index)}>x</div>
			                    </div>
								)
							})
						) : ''
					}
                    {
                        !this.state.upStatus ? '' : (
                            <div style={style.weui_uploader} className="upload-weImg">
                                <Toast icon="loading" show={true}></Toast>
                            </div>
                        )
                    }
                    {
                        this.state.uploadImg.length<8 && !this.state.upStatus ? (
                            <Qiniu onDrop={this.onDrop} style={{border:'0px'}} accept="image/*" multiple={true} token={this.state.token} uploadKey={this.state.uploadKey} onUpload={this.onUpload}>
                                <div className="weui_uploader_input_wrp" style={style.weui_uploader}>
                                    <div className="weui_uploader_input"/>
                                </div>
                            </Qiniu>
                        ) : ''
                    }
                </div>
			</div>
			)
	}
});