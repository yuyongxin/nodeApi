const mysql = require('mysql');

const db = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'root',
    database:'sakila'
})
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
// const expressJWT = require('express-jwt');


/* --- 局限
    session认证机制需要配合cookie, cookie默认不支持跨域访问，
    须佐很多额外配置 才能实现
--- */
const session = require('express-session');
app.use(session({
    name:'sid', // 设置cookie的name
    secret:'yyx', // 参与加密的字符串
    saveUninitialized:false, // 是否每次请求都设置一个cookie 用来存储session的id
    resave:true, // 是否在每次请求时重新保存session
    cookie:{
        httpOnly:true, //开启后前端无法通过js操作
        maxAge:1000*60*60*24
    }

}))
// 2.jwt定义secret密钥
const secretKey = 'youngsin';

// 解析字符串 的中间件 .unless 用来指定哪些接口不需要访问权限
// app.use(expressJWT({secret:secretKey}).unless({path:[/^\/api\//]}));
app.use(cors());
// 托管静态页面
app.use(express.static(__dirname+'/public'));
// 解析post提交过来的表单数据
app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.redirect('/index')
    // res.end('hello express');
})
app.post('/login',(req,res)=>{
    if(req.body.usename!=='admin'||req.body.password!='123'){
        return res.send({status:1,msg:'登录失败'})
    }
    req.session.user = req.body;
    req.session.isLogin = true;
    /*
        参数1：用户信息对象
        参数2：加密的密钥
        参数3：配置对象，可以配置当前token的有效期
    */
    const tokenstr= jwt.sign({username:req.body.usename},secretKey,{expiresIn:'10h'});
    res.send({
        status:0,
        msg:'登录成功',
    token:tokenstr // 要发送给客户端的token字符串
});

    // res.send({status:0,msg:'登录成功'});
})
app.get('/index',(req,res)=>{
    if(!req.session.isLogin){
        return res.send({status:1,msg:'fail'})
    }
    res.send({status:0,msg:'success',username:req.session.user.username})
    // express-jwt中间件配置成功后，有权限的接口可以使用req.user对象来访问解析出来的用户信息
    // console.log(req.user)
    let token = req.get('token');
    if(!token){
        return res.json({
            code:'2002',
            msg:'token缺失'
        })
    }
    jwt.verify(token,secretKey,(err,data)=>{
        if(err){
            return res.json({code:'2004',msg:'token校验失败'})
        }
        res.json({
            code:200,
            data:data,
        })
    })
    // res.end('hello express');
})
app.post('/logout',(req,res)=>{
    req.session.destroy();
    res.send({
        status:0,
        msg:"退出登录成功"
    })
})
app.listen('3001',()=>{
    console.log('启动成功');
})
/* ----------------------------------- 查询 ----------------------------------- */
// const sqlstr = 'select * from language';
// db.query(sqlstr,(err,result)=>{
//     if(err) return console.log(err.message)
//     console.log(result);
// })
/* ----------------------------------- 插入 ----------------------------------- */

// const language = {name:'chinese'};
// const sqlstr2 = 'insert into language (name) values(?)';
// db.query(sqlstr2,[language.name],(err,result)=>{
//     if(err) return console.log(err);
//     // console.log(result);
//     if(result.affectedRows===1){
//         console.log('插入数据成功');
//     }
// })

/* ------------------- 新增数据时，如果数据对象的每个属性和数据表的字段一一对应，可快速插入 ------------------- */
// const row = {name:'chinese2'};
// const sqlStr3 = 'insert into language SET ?';
// db.query(sqlStr3,row,(err,result)=>{
//     if(err) return console.log(err);
//     if(result.affectedRows===1){
//                 console.log('插入数据成功');
//             }
// })

/* ----------------------------------- 更新 ----------------------------------- */
// const row = {id:8, name:'chinese3'};
// const sqlStr4 = 'update language set name=? where language_id=?';
// db.query(sqlStr4,[row.name,row.id],(err,result)=>{
//     if(err) return console.log(err.message);
//     if(result.affectedRows===1){
//         console.log('数据更新成功');
//     }
// })
/* --------------------------------- 更新便捷方式 --------------------------------- */
// const row = {language_id:9, name:'chinese4'};
// const sqlStr4 = 'update language set ? where language_id=?';
// db.query(sqlStr4,[row,row.language_id],(err,result)=>{
//     if(err) return console.log(err.message);
//     if(result.affectedRows===1){
//         console.log('数据更新成功');
//     }
// })

/* ----------------------------------- 删除 ----------------------------------- */
// const sqlStr5 = 'delete from language where language_id=?';
// db.query(sqlStr5,6,(err,result)=>{
//     if(err) return console.log(err.message);
//     if(result.affectedRows===1){
//         console.log('数据删除成功');
//     }
// })
/* ---------------------------------- 标记删除 ---------------------------------- */
// const sqlStr6 = 'update language set status=? where language_id=?';
// db.query(sqlStr6,[0,9],(err,result)=>{
//     if(err) return console.log(err.message);
//     if(result.affectedRows===1){
//         console.log('数据标记删除成功');
//     }
// })