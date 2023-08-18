const db = require("../db/index");
const bycypt = require('bcryptjs')
exports.userinfo = (req,res)=>{
    // res.send('list');
    const userinfo = req.userinfo;
    const sql = 'select id,username,nickname,email,user_pic from ev_users where id=?';
    db.query(sql,userinfo.id,(err,results)=>{
        if(err) return res.cc(err);
        if(results.length!==1){
            return res.cc('获取用户信息失败')
        }
        res.send({
            status:0,
            message:"获取用户信息成功",
            data:results[0]
        })
    })
};

exports.updateUserinfo =(req,res)=>{
    const sql = "update ev_users set ? where id=?";
    db.query(sql,[req.body,req.body.id],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows!==1) return res.cc("更新用户信息失败");
        return res.cc("修改成功",0)
    })
    // res.send('update ok')
};

exports.updatePwd = (req,res)=>{
    // res.send('updatepwd')
    // 根据id查询用户是否存在
    const sql = "select * from ev_users where id=?";
    db.query(sql,req.userinfo.id,(err,results)=>{
        if(err) return res.cc(err);
        if(results.length!==1){
            return res.cc('用户不存在')
        }
        // 判断提交的旧密码是否正确
       const compareResult= bycypt.compareSync(req.body.oldpwd,results[0].password);
       if(!compareResult){
        return res.cc("原密码错误");
       }
       const sql2 = "update ev_users set password=? where id=?";
       const newpwd = bycypt.hashSync(req.body.newpwd,10);
       db.query(sql2,[newpwd,req.userinfo.id],(err,results)=>{
        if(err) return res.cc(err);
        if(results.affectedRows!==1) return res.cc('更新密码失败');
        res.cc('更新密码成功！',0)
       })
    })
}
exports.updateAvater=(req,res)=>{
    // res.send('avater');
    const sql = 'update ev_users set user_pic=? where id=?';
    db.query(sql,[req.body.avater,req.userinfo.id],(err,results)=>{
        if(err) return res.cc(err);
        if(results.affectedRows!==1) return res.cc('更新头像失败');
        return res.cc('更新头像成功',0);
    })
}