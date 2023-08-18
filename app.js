const express = require('express');
const app = express();
const userRouter = require('./router/user');
const userinfoRouter = require('./router/userinfo');
const articateRouter = require('./router/articate');
const articleRouter = require('./router/article');
const joi = require('joi');
const path = require('path');
/* ------------------------------ 导入并配置cors中间件 ------------------------------ */
const cors = require('cors');
app.use(cors());
// 配置解析表单数据的中间件
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
// 响应数据的中间件
app.use(function(req,res,next){
    res.cc=function(err,status=1){
        res.send({
            status,
            message:err instanceof Error?err.message:err
        })
    }

    next();
})

app.use('/api',userRouter);
app.use('/my',userinfoRouter);
app.use('/my/article',articateRouter);
app.use('/my/article',articleRouter);
// 在路由之后定义错误中间件
app.use(function(err,req,res,next){
    console.log(err instanceof joi.ValidationError);
    // console.log("12345")
    // console.log(err instanceof joi.ValidationError)
    if(err instanceof joi.ValidationError){
       
        return res.cc(err)
    }
    res.cc(err)
    
    
})
app.listen(3001,()=>{
    console.log("api server running at http://127.0.0.1:3001")
})