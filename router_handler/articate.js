const db = require('../db/index')
exports.cates=(req,res)=>{
    // res.send('cates')
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc';
    db.query(sql,(err,results)=>{
        if(err) return res.cc(err);
        res.send({
            status:0,
            data:results,
            messsage:"success"
        })
    })
}

exports.addCates=(req,res)=>{
    // res.send('add')
    const sql = 'select * from ev_article_cate where name=? or alias=?';
    db.query(sql,[req.body.name,req.body.alias],(err,results)=>{
        if(results.length===2) return res.cc("分类名称与分类别名被占用，请更换后重试！");
        if(results.length===1&&results[0].name===req.body.name&&results[0].alias===req.body.alias){
           return res.cc("分类名称与分类别名被占用，请更换后重试！")
        }
        if(results.length===1&&results[0].name===req.body.name){
            return res.cc("分类名称被占用，请更换")
        }
        if(results.length===1&&results[0].alias===req.body.alias){
            return res.cc("分类别名被占用，请更换")
        }
        const sqladd = 'insert into ev_article_cate set ?';
        db.query(sqladd,req.body,(err,data)=>{
            if(err) return res.cc(err);
            if(data.affectedRows!==1) return res.cc('新增文章分类失败');
            res.cc('新增文章分类成功',0)
        })
    })
}
exports.deleteCate=(req,res)=>{
    // res.send('delete')
    const sql = 'update ev_article_cate set is_delete=1 where id=?';
    db.query(sql,req.params.id,(err,results)=>{
        if(err) return res.cc(err);
        if(results.affectedRows!==1){
            return res.cc("删除文章分类失败");
        }
        res.cc("删除文章分类成功！",0)
    })
}

exports.getArtCateId=(req,res)=>{
    // res.send('xx')
    const sql = "select * from ev_article_cate where id=?";
    db.query(sql,req.params.id,(err,results)=>{
        if(err) return res.cc(err);
        if(results.length!==1) return res.cc("获取文章数据失败");
        res.send({
            status:0,
            messsage:"获取文章数据分类成功",
            data:results[0]
        })
    })
}

exports.updateCateById=(req,res)=>{
    // res.send('ok')
    // id不等于提交过来的id 查询其他行是否有重名
    const sql = "select * from ev_article_cate where Id<>? and (name=? or alias=?)";
    db.query(sql,[req.body.Id,req.body.name,req.body.alias],(err,results)=>{
        if(err) return res.cc(err);
        if(results.length===2) return res.cc("分类名称与分类别名被占用，请更换后重试！");
        if(results.length===1&&results[0].name===req.body.name&&results[0].alias===req.body.alias){
           return res.cc("分类名称与分类别名被占用，请更换后重试！")
        }
        if(results.length===1&&results[0].name===req.body.name){
            return res.cc("分类名称被占用，请更换")
        }
        if(results.length===1&&results[0].alias===req.body.alias){
            return res.cc("分类别名被占用，请更换")
        }

        const sqlupdate = "update ev_article_cate set ? where Id=?";
        db.query(sqlupdate,[req.body,req.body.Id],(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows!==1) return res.cc("更新失败");
            res.cc("更新成功",0)
        })
    })
}