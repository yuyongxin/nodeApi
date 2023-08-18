const db = require("../db/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {jwtSecretKey,expiresIn} = require('../config');
// 处理函数
exports.register = (req, res) => {
    // console.log(req.body);
  const userinfo = req.body;
//   console.log(userinfo);
  // 校验
//   if (!userinfo.username || !userinfo.password) {
//     // return res.send({status:1,message:'用户名或密码为空'});
//     return res.json({ status: 1, message: "用户名或密码为空" });
//   }

  const sqlStr = "select * from ev_users where username=?";
  db.query(sqlStr, userinfo.username, (err, results) => {
    if (err) {
    //   return res.send({ status: 1, message: err.message });
    return res.cc(err)
    }
    if (results.length > 0) {
    //   return res.send({ status: 1, message: "用户名已存在，请更换" });
        return res.cc("用户名已存在，请更换");
    }
    // 用户名可以使用 对密码进行加密 （明文密码 随机盐长度）
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    // 插入新用户
    const sql = "insert into ev_users set ?";
    db.query(
      sql,
      { username: userinfo.username, password: userinfo.password },
      (err, results) => {
        // if (err) return res.send({ status: 1, message: err.message });
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) {
        //   return res.send({ status: 1, message: "注册失败" });
        return res.cc("注册失败");
        }
        // res.send({
        //   status: 0,
        //   message: "注册成功",
        // });
        res.cc("注册成功",0)
      }
    );
    // console.log(userinfo);
  });
  
//   res.send('register ok');
};

exports.login = (req, res) => {
//   res.send("login ok!");
    const userinfo = req.body;
    const sqlstr = "select * from ev_users where username=?";
    db.query(sqlstr,userinfo.username,(err,results)=>{
        if(err) return res.cc(err);
        if(results.length!==1) return res.cc('登陆失败');
        // 判断密码是否一致
       const boolcompare= bcrypt.compareSync(userinfo.password,results[0].password);
       if(!boolcompare){
        res.cc('登录失败');
       }
       // 登录成功生成jwt字符串
       // 生成token字符串的时候，剔除密码和头像的值
       const user = {...results[0],password:'',user_pic:''};
       const tokenstr= jwt.sign(user,jwtSecretKey,{expiresIn:expiresIn});
       res.send({
        status:0,
        message:'登录成功',
        token:tokenstr
        // token:'Bearer '+ tokenstr
       })
    })
};
exports.getList=(req,res)=>{
    console.log(req.userinfo);
    console.log(req.isLogin);
    res.send('test ok');
}
