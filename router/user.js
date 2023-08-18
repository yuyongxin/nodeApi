const express = require('express');
const router = express.Router();
const expressJoi = require('../util/expressJoi')
const {reg_login_schema} = require('../schema/user');
const user_handler= require('../router_handler/user');
let checkTokenMiddleWare = require('../middlewares/checktokenware');
router.post('/register',expressJoi(reg_login_schema), user_handler.register)

router.post('/login',expressJoi(reg_login_schema),user_handler.login)

router.get('/getList',checkTokenMiddleWare,user_handler.getList)


module.exports = router;