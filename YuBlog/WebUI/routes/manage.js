var express = require('express');
var passport = require('passport');
var Blog = require('../models/blog');
var BlogType = require('../models/blogtype');
var moment = require("moment");
var router = express.Router();

function isAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

//管理后台首页
router.get('/', isAuthenticated, function (req, res, next) {
    res.send('wellcom' + req.user.username);
});

//创建博客
router.get('/create', isAuthenticated, function (req, res, next) {
    var blogTypes = BlogType.find({}).sort({ name: 'asc' }).exec(function (err, blogTypes) {
        res.render('manage/createBlog', { title: 'Create Blog', blogTypes: blogTypes });
    });
    
});

router.post('/create', isAuthenticated, function (req, res, next) {
    var blog = new Blog({
        title: req.body.title,
        tags:req.body.tags,
        author: "york",
        body: req.body.editorBlog,
        comments: [],
        date: new Date(),
        hidden: req.body.publish,
        meta: {}
    });
    blog.save();
    res.render('manage/blogDetail', { blog: blog });
});

//like查询
//db.users.find({ "name": /m/ })
//查询返回指定字段
//db.xxx.find({}, { "[要查询的字段]": 1 })

//维护博客类型
router.get('/blogtype', isAuthenticated, function (req, res) {
    var blogTypes = BlogType.find({}).sort({name:'asc'}).exec(function(err,blogTypes) {
        res.render('manage/blogType', { title: 'BlogType', blogTypes: blogTypes,moment:moment });
    });
});
router.post('/createblogtype', isAuthenticated, function (req, res) {
    var blogType = new BlogType({
        name: req.body.blogtype,
        date:new Date()
    });
    blogType.save();
    res.redirect(301, '/manage/blogtype');
});
router.post('/deleteblogtype', isAuthenticated, function (req, res) {
    BlogType.findByIdAndRemove(req.body.id , function (err) {
        if (!err) {
            res.redirect(301, '/manage/blogtype');
        }else {
            res.send("error while removing "+req.body.id);
        }
    });
});



module.exports = router;