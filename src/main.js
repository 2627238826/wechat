'use strict';

require('./../node_modules/weui/dist/style/weui.min.css');
require('./main.css');
require('./components/Tools.js');
// <!-- 微信sdk -->
// require('./components/weixin/jweixin-1.0.0.js')

var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');

// 开发版本
// var React = require('./../node_modules/react/dist/react.js');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var history = ReactRouter.hashHistory;

// 微信回调域
var WeixinCallbackDomain = require('./components/weixin/weixinCallbackDomain.js');

var BottonNav = require('./components/BottonNav.js');
var FindDoctor = require('./doctor/FindDoctor.js');
var DoctorList = require('./doctor/DoctorList.js');
var FindByEntity = require('./components/FindByEntity.js');
var DoctorDetails = require('./doctor/doctorDetails/DoctorDetails.js');
var DoctorIntro = require('./doctor/doctorIntro/DoctorIntro.js');
var DoctorEvaluate = require('./doctor/doctorEvaluate/DoctorEvaluate.js');
var GroupDetails = require('./doctor/groupDetails/groupDetails.js')
var DoctorOrderInfo = require('./doctor/doctorOrderInfo/DoctorOrderInfo.js');

var CarePlanList = require('./doctor/carePlanList/CarePlanList.js');

var EditorOrderInfo = require('./doctor/editorOrderInfo/EditorOrderInfo.js');
var SiginAndSigup = require('./doctor/siginAndSigup/SiginAndSigup.js');
var TakeOrderSuccess = require('./doctor/editorOrderInfo/takeOrderSuccess/takeOrderSuccess.js')
var CarePlanDetail = require('./doctor/carePlanList/carePlanDetail/CarePlanDetail.js')
var Singup = require('./components/sigup/Sigup.js');
var EditorDoctorInfo = require('./components/sigup/editorDoctorInfo/EditorDoctorInfo.js');
var SigupSuccess = require('./components/sigup/sigupSuccess/SigupSuccess.js');
var PatientSigupSuccess = require('./patient/patientSigupSuccess/PatientSigupSuccess.js');
var PatientDownApp = require('./patient/downApp/DownApp.js');
var DoctorDownApp = require('./doctor/downApp/DownApp.js');
var GroupList = require('./doctor/GroupList.js');

var ScoreSearch = require('./patient/score/scoreSearch.js');
var ScanDrugCode = require('./patient/scanDrugCode/scanDrugCode.js');
var ScanDrugCodeResult = require('./patient/scanDrugCode/ScanDrugCodeResult/ScanDrugCodeResult.js');
var PatientRename = require('./doctor/patientRename/patientRename.js');

var SelectPatient = require('./doctor/selectPatient/selectPatient.js');
var PatientReportInfo = require('./doctor/patientReportInfo/patientReportInfo.js');
var MedicalRecord = require('./doctor/medicalRecord/medicalRecord.js');
var SelectIllness = require('./doctor/selectIllness/selectIllness.js');
var SubmitSuccess = require('./doctor/submitSuccess/submitSuccess.js');
var storeDetails = require('./patient/storeDetails/storeDetails.js');
var privilegeState = require('./patient/storeDetails/privilegeState/privilegeState.js');
var Feedback = require('./feedback/Feedback.js');

var index = React.createClass({
    render: function() {
        return (
            <div>
                {this.props.children} 
                <BottonNav/>
            </div>
        )
    }
})

var msg = React.createClass({
    alert: function() {
        alert(1)
    },
    render: function() {
        return (
            <a onClick={this.alert}>msg</a>
        )
    }
})
 
 
// 主页
var AppContent = React.createClass({
    render: function() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
})

// 微信默认设置
Tools.weixin.init().then(function(wx) {
    // wx.hideOptionMenu();

    // wx.ready(function() {
    //     // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    //     alert('微信sdk验证成功');
    //     sssdd();
    // });

});


// function sssdd(argument) {
//     wx.onMenuShareAppMessage({
//         title: '互联网之子',
//         desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
//         link: 'http://movie.douban.com/subject/25785114/',
//         imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
//         type: '', // 分享类型,music、video或link，不填默认为link
//         dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
//         success: function() {
//             alert('成功')
//         },
//         cancel: function() {
//             alert('失败')
//         }
//     });
// }


// 选择疾病组件
var SelectIllnessRoute = (
    <Route path="selectIllness/:access_token/:doctorId" component={SelectIllness}/>
);

// 内容
var mainCom = ReactDOM.render(
    <Router history={history} component={AppContent}>
        <Route path="/" component={index}>
            <Route path="msg" component={msg} />
        </Route>
        <Route path="WeixinCallbackDomain" component={WeixinCallbackDomain}/>
        <Route path="findDoctor" component={FindDoctor} />
        <Route path="doctorList/:searchType/:key/:diseasesId" component={DoctorList} />
        <Route path="findByEntity" component={FindByEntity}/>
        <Route path="doctorDetails/:doctorId/:report" component={DoctorDetails}/>
        <Route path="doctorIntro/:doctorId" component={DoctorIntro}/>
        <Route path="doctorEvaluate/:doctorId" component={DoctorEvaluate}/>
        <Route path="groupDetails/:groupId" component={GroupDetails}/>
        <Route path="doctorOrderInfo/:type/:doctorId" component={DoctorOrderInfo}/>
        <Route path="carePlanList/:type/:doctorId" component={CarePlanList}/>
        <Route path="editorOrderInfo/:doctorId/:packId/:packType/:access_token" component={EditorOrderInfo}/>
        <Route path="siginAndSigup/:doctorId/:packId/:packType/:code" component={SiginAndSigup}/>
        <Route path="takeOrderSuccess/:text" component={TakeOrderSuccess}/>
        <Route path="carePlanDetail/:doctorId/:packId/:packType" component={CarePlanDetail}/>
        <Route path="singup/:userType/:code" component={Singup}/>
        <Route path="editorDoctorInfo/:phone/:code" component={EditorDoctorInfo}/>
        <Route path="sigupSuccess/:type/:text" component={SigupSuccess}/>
        <Route path="patientSigupSuccess/:title/:text" component={PatientSigupSuccess}/>
        <Route path="patientDownApp" component={PatientDownApp}/>
        <Route path="doctorDownApp" component={DoctorDownApp}/>
        <Route path="groupList" component={GroupList}/>
        <Route path="scoreSearch/:userId/:access_token/:code" component={ScoreSearch}/>
        <Route path="scanDrugCode/:userId/:access_token/:code" component={ScanDrugCode}/>
        <Route path="scanDrugCodeResult/:resultCode/:resultMsg/:access_token/:userId" component={ScanDrugCodeResult}/>
        <Route path="patientRename/:doctorId/:packId/:packType/:access_token" component={PatientRename}/>
        <Route path="selectPatient/:doctorId/:access_token/:code" component={SelectPatient}/>
        <Route path="patientReportInfo/:doctorId/:access_token/:patientId" component={PatientReportInfo}/>
        <Route path="medicalRecord" component={MedicalRecord}>
            {SelectIllnessRoute}
        </Route>
        <Route path="submitSuccess" component={SubmitSuccess}/>

        <Route path="feedback/:code" component={Feedback} />
        <Route path="storeDetails/:access_token/:id/:code" component={storeDetails} />
        <Route path="privilegeState/:access_token/:id" component={privilegeState} />
    </Router>,
    document.getElementById('app')
);

