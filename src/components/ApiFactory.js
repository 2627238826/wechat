'use strict';

var ServerRoot = require('./ServerRoot.js');

module.exports = {
    // 微信
    weixin: {
        // 获取配置数据
        getConfig: ServerRoot.serverApiRoot + 'wx/getConfig',
        // 是否绑定微信（公众号）
        getWeChatStatus4MP: ServerRoot.serverApiRoot + 'user/getWeChatStatus4MP',
        // 该手机号是否绑定微信
        isBindWechat: ServerRoot.serverApiRoot + 'user/isBindWechat',

        getUserInfo: ServerRoot.serverApiRoot + 'wx/getUserInfo'
    },
    common: {
        // 发送验证码
        getSMSCode: ServerRoot.serverApiRoot + 'sms/randcode/getSMSCode',
        // 校验验证码
        verifyCode: ServerRoot.serverApiRoot + 'sms/randcode/verifyCode',
        // 绑定注册并登陆
        loginByWeChat4MP: ServerRoot.serverApiRoot + 'user/loginByWeChat4MP',
        // 验证手机号是否已注册
        verifyTelephone: ServerRoot.serverApiRoot + 'sms/verify/telephone',
        // 获取科室
        getDepts: ServerRoot.serverApiRoot + 'base/getDepts',
        // 获取职称
        getTitles: ServerRoot.serverApiRoot + 'base/getTitles',
        // 服务号医生注册
        registerByWechat: ServerRoot.serverApiRoot + 'user/registerByWechat',
        // 语音验证码
        getVoiceCode: ServerRoot.serverApiRoot + 'sms/randcode/getVoiceCode',
        //获取七牛上传参数
        getUploadToken:ServerRoot.serverApiRoot+'vpanfile/getUploadToken',

        //health//user/isSubscribe 
        isSubscribe:ServerRoot.serverApiRoot+'wx/isSubscribe'
    },
    // 获取推荐病种
    findRecommDisease: ServerRoot.serverApiRoot + 'groupSearch/findRecommDisease',
    // 集团搜索 - 预约名医
    findOrderDoctor: ServerRoot.serverApiRoot + 'groupSearch/findOrderDoctor',
    // 根据父节点获取专长（获取到“科室－病种一级”）
    getOneLevelDisease: ServerRoot.serverApiRoot + 'base/getOneLevelDisease',
    // 医生集团搜索 - 根据病种搜索医生
    findDoctorByDisease: ServerRoot.serverApiRoot + 'groupSearch/findDoctorByDisease',
    // 搜索医生（集团名／医生名／病种 ）
    findDoctoreByKeyWord: ServerRoot.serverApiRoot + 'groupSearch/findDoctoreByKeyWord',
    //获取常见疾病列表
    getCommonDiseases:ServerRoot.serverApiRoot + 'diseaseType/getCommonDiseases',
    //获取被推荐的集团列表
    getGroupRecommendedList:ServerRoot.serverApiRoot + 'group/getGroupRecommendedList',
    //获取推荐医生列表
    getRecommendDocList:ServerRoot.serverApiRoot + 'recommend/getRecommendDocList',
    //获取所有集团列表
    findAllGroup:ServerRoot.serverApiRoot + 'groupSearch/findAllGroup',
    // 根据病种名查找病种（支持模糊查询）
    findByName:ServerRoot.serverApiRoot + 'diseaseType/findByName',

    doctor: {
        // 获取医生基本信息
        basicInfo: ServerRoot.serverApiRoot + 'doctor/basicInfo',
        // 医生 - 获取个人介绍
        getIntro: ServerRoot.serverApiRoot + 'doctor/getIntro',
        // 获取医生评价
        getTopSix: ServerRoot.serverApiRoot + 'pack/evaluate/getTopSix',
        // 获取所有医生
        findAllDoctor: ServerRoot.serverApiRoot + 'groupSearch/findAllDoctor',
        // 获取医生评价
        getEvaluationDetail:ServerRoot.serverApiRoot + 'pack/evaluate/getEvaluationDetail',
        // 根据医生擅长推荐疾病
        getDocRecomendDis: ServerRoot.serverApiRoot + '/pack/checkIn/getDocRecomendDis'
    },
    patient: {
        // 创建人查询患者
        findByCreateUser: ServerRoot.serverApiRoot + 'packpatient/findByCreateUser',
        getUserGoodsPointsList: ServerRoot.drugStoreApiRoot + 'goods/points/getUserGoodsPointsList',
        //扫描药监码
        scanDrugCode: ServerRoot.drugStoreApiRoot + 'goods/salesLog/scanDrugCode',
        // 扫药积分
        scanDrugCodePoints: ServerRoot.drugStoreApiRoot + 'goods/salesLog/scanDrugCodePoints',
        //完成药品销售
        finishDrugSale: ServerRoot.drugStoreApiRoot + 'goods/salesLog/finishDrugSale',
        //获取开通了“其他渠道获得积分”的品种
        getOtherChannelsGoods: ServerRoot.drugStoreApiRoot + 'goods/points/getOtherChannelsGoods', 
        //根据患者编号查询患者
        packpatientFindById: ServerRoot.serverApiRoot + 'packpatient/findById',
        // 修改名字
        patientRename: ServerRoot.serverApiRoot + 'user/patientRename',
        //购药提醒 - 查看购药提醒详情
        getReminder: ServerRoot.drugStoreApiRoot + 'purchaseReminder/getReminder'
    },
    order: {
        // 订单生成 
        takeOrder: ServerRoot.serverApiRoot + 'pack/order/createOrder',
        // 报到 - 患者报到
        takeCheckIn: ServerRoot.serverApiRoot + '/pack/checkIn/addByWX',
        // 是否已报到
        isCheckIn: ServerRoot.serverApiRoot + '/pack/checkIn/isCheckIn',
        //查询所有患者，并且返回其与医生是报道关系与否
        getPatientsWithStatus: ServerRoot.serverApiRoot + 'pack/checkIn/getPatientsWithStatus',
    },
    // 服务套餐 - 查询套餐
    query: ServerRoot.serverApiRoot + 'pack/pack/query',
    // 根据套餐ID查询计划关怀内容明细
    queryCarePlanByOne: ServerRoot.careplanApiRoot + 'wx/carePlan/findByPack',
    //根据packId查询套餐的计划详情
    findByPack2: ServerRoot.careplanApiRoot + 'wx/carePlan/findByPack2',
    //根据计划id查询1页的关怀项数据
    findPage: ServerRoot.careplanApiRoot + 'wx/careItem/findPage',
    group: {
        // 获取集团信息
        findGroupBaseInfo: ServerRoot.serverApiRoot + 'groupSearch/findGroupBaseInfo',
        // 集团ID获取对应推荐名医列表
        getRecommendDocList: ServerRoot.serverApiRoot + '/recommend/getRecommendDocList',
        // 获取集团id和科室id查询医生(患者端）
        findDoctorByGroupForPatient: ServerRoot.serverApiRoot + 'groupSearch/findDoctorByGroupForPatient'
    },
    feedback: ServerRoot.serverApiRoot + 'wx/feedback/saveFeedback',
}
