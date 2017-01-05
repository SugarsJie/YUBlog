﻿var express = require('express');
var passport = require('passport');
var Blog = require('../models/blog');
var BlogType = require('../models/blogtype');
var moment = require("moment");
var blogService = require('../service/blogService');
var router = express.Router();

//管理后台需要登录后才能进入
router.use(function (req, res, next) {
    return next();
//    res.locals.user = req.user;
//    req.session.returnUrl = req.originalUrl;
//    if (req.user) {
//        next();
//    } else {
//        res.redirect('/login');
//    }
});

//管理后台博客列表
router.get('/', function (req, res, next) {
    Blog.find({ "isDeleted": false}).sort({ date: -1 }).exec(function (err, blogs) {
        res.render('manage/homeMng', { title: 'Manage-Home', blogs: blogs, moment: moment });
    });
});

//创建博客
router.get('/create', function (req, res, next) {
    BlogType.find({}).sort({ name: 'asc' }).exec(function (err, blogTypes) {
        res.render('manage/createBlog', { title: 'Create Blog', blogTypes: blogTypes });
    });
});

router.post('/create', function (req, res, next) {
    var blog = new Blog({
        title: req.body.title,
        tags:req.body.tags,
        author: "york",
        body: req.body.editorBlog,
        comments: [],
        date: new Date(),
        hidden: req.body.publish == false,
        meta: {},
        blogType: req.body.blogType,
        isDeleted: false,
        slug: req.body.slug
    });
    blog.save();
    res.redirect('/manage');
});

//博客详细
router.get('/blogDetail/:slug', blogService.findBlog,function (req,res,next) {
    res.render('manage/blogDetail', { blog: req.blog, moment: moment });
});

//修改博客
router.get('/editBlog/:slug', blogService.findBlogTypes, blogService.findBlog, function (req, res, next) {
    res.render("manage/editBlog", { blog: req.blog, blogTypes: req.blogTypes });
});

//删除博客
router.post('/deleteBlog', function (req, res, next) {
    Blog.findByIdAndUpdate(req.body.blogId,
        { $set: { isDeleted: true } },
        function(err, doc) {
            if (err) return res.send(500, { error: err });
            return res.send("success");
        });
});

//like查询
//db.users.find({ "name": /m/ })
//查询返回指定字段
//db.xxx.find({}, { "[要查询的字段]": 1 })

//维护博客类型
router.get('/blogtype', function (req, res) {
    BlogType.find({}).sort({name:'asc'}).exec(function(err,blogTypes) {
        res.render('manage/blogType', { title: 'BlogType', blogTypes: blogTypes,moment:moment });
    });
});
router.post('/createblogtype', function (req, res) {
    var blogType = new BlogType({
        name: req.body.blogtype,
        date:new Date()
    });
    blogType.save();
    res.redirect(301, '/manage/blogtype');
});
router.post('/deleteblogtype', function (req, res) {
    BlogType.findByIdAndRemove(req.body.id , function (err) {
        if (!err) {
            res.redirect(301, '/manage/blogtype');
        }else {
            res.send("error while removing "+req.body.id);
        }
    });
});



module.exports = router;