const express = require('express');
const router = express.Router();
const {cates,addCates,deleteCate,getArtCateId,updateCateById} = require('../router_handler/articate');
const expressJoi = require('../util/expressJoi');
const {add_cate_schema,delete_cate_schema,update_cate_schema} = require('../schema/artcate');
const checktokenware = require('../middlewares/checktokenware');
router.get('/cates',[checktokenware],cates);
router.post('/addcates',[checktokenware,expressJoi(add_cate_schema)],addCates);
router.get('/deletecate/:id',[checktokenware,expressJoi(delete_cate_schema)],deleteCate)
router.get('/cates/:id',getArtCateId)
router.post('/updatecate',[checktokenware,expressJoi(update_cate_schema)],updateCateById);
module.exports = router;