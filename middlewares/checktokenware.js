
const jwt = require('jsonwebtoken');
const {jwtSecretKey,expiresIn} = require('../config');
module.exports = (req,res,next)=>{
    // console.log(req);
    let token = req.get('token');
    if(!token){
        return res.cc("token缺失")
    }
    jwt.verify(token,jwtSecretKey,(err,data)=>{
        if(err){
            return res.cc("token校验失败")
        }
        req.userinfo = data;
        req.isLogin = true;
        // 如果token校验成功
        next();
    })
}