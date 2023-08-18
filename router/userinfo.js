const express = require('express');
const router = express.Router();
const expressJoi = require('../util/expressJoi');
const {update_user_schema,update_password_schema,update_avater_schema} = require('../schema/user');
const checktokenware = require('../middlewares/checktokenware');
const {userinfo,updateUserinfo,updatePwd,updateAvater} = require('../router_handler/userinfo')
//获取用户信息
router.get('/userinfo',checktokenware,userinfo);
// 更新用户信息
router.post('/userinfo',[checktokenware,expressJoi(update_user_schema)],updateUserinfo);
// 更新密码
router.post('/updatepwd',[checktokenware,expressJoi(update_password_schema)],updatePwd);
// 更新用户头像
router.post('/updateavater',[checktokenware,expressJoi(update_avater_schema)],updateAvater);
module.exports=router;