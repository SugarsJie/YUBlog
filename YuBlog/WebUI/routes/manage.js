var express = require('express');
var passport = require('passport');
var Blog = require('../models/blog');
var BlogType = require('../models/blogtype');
var moment = require("moment");
var router = express.Router();

function isAuthenticated(req, res, next) {
    res.locals.user = req.user;
    req.session.returnUrl = req.originalUrl;
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

//管理后台首页
router.get('/', isAuthenticated, function (req, res, next) {
    Blog.find({}).sort({ date: -1 }).exec(function (err, blogs) {
        res.render('manage/homeMng', { title: 'Manage-Home', blogs: blogs, moment: moment });
    });
});

//创建博客
router.get('/create', isAuthenticated, function (req, res, next) {
    BlogType.find({}).sort({ name: 'asc' }).exec(function (err, blogTypes) {
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
        meta: {},
        blogType:req.body.blogType
    });
    blog.save();
    res.render('manage/blogDetail', { blog: blog });
});

//修改博客
router.get('/edit/:blogId', isAuthenticated, findBlogTypes, findBlog, function (req, res, next) {
    res.render("manage/editBlog", { blog: req.blog, blogTypes: req.blogTypes });
});

function findBlog(req, res, next) {
    Blog.findById(req.params.blogId, function (err, blog) {
        req.blog = blog;
        next();
    });
}

function findBlogTypes(req,res,next) {
    BlogType.find({}).sort({ name: 'asc' }).exec(function (err, blogTypes) {
        req.blogTypes = blogTypes;
        next();
    });
}

//一个请求多个查询的解决方法
//function findStudent(req, res, next) {
//    var dbRequest = 'SELECT * FROM Students WHERE IDCard = \'' + req.query['id'] + '\'';
//    db.all(dbRequest, function (error, rows) {
//        if (rows.length !== 0) {
//            req.students = rows;
//            return next();
//        }
        
//        res.render('incorrect_student'); /* Render the error page. */            
//    });
//}

//function findGroups(req, res, next) {
//    dbRequest = 'SELECT * FROM Groups WHERE Name = \'' + req.query['group'] + '\'';
//    db.all(dbRequest, function (error, rows) {
//        /* Add selected data to previous saved data. */
//        req.groups = rows;
//        next();
//        }
//    });
//}

//function renderStudentsPage(req, res) {
//    res.render('student', {
//        students: req.students,
//        groups: req.groups
//    });
//}

//app.get('/student', findStudent, findGroups, renderStudentsPage);

//like查询
//db.users.find({ "name": /m/ })
//查询返回指定字段
//db.xxx.find({}, { "[要查询的字段]": 1 })

//维护博客类型
router.get('/blogtype', isAuthenticated, function (req, res) {
    BlogType.find({}).sort({name:'asc'}).exec(function(err,blogTypes) {
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