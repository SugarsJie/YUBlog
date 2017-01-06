var express = require('express');
var passport = require('passport');
var Blog = require('../models/blog');
var BlogType = require('../models/blogtype');
var moment = require("moment");
var blogService = require('../service/blogService');
var paginate = require('express-paginate');
var router = express.Router();

router.use(paginate.middleware(10, 50));

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
router.get('/', blogService.findBlogTypes,function (req, res, next) {
    var currentPage = req.query.page ? req.query.page : 1;
    var pageSize = req.query.limit ? req.query.limit : 20;
    var order = req.query.order ? req.query.order : 1;
    var sort = req.query.sort ? req.query.sort : 'date';
    var orderPrefix = order > 0 ? '' : '-';
    var orderStr = orderPrefix + sort;
    var query = getQuery(req);
    var queryToDisplay = getQueryToDisplay(req);

    Blog.paginate(query, { page: currentPage, limit: pageSize, sort: orderStr }, function (err, result) {
        res.render('manage/homeMng', {
            title: 'Manage-Home',
            order: order * -1,
            sort: sort,
            query: queryToDisplay,
            blogTypes: req.blogTypes,
            moment: moment,
            blogs: result.docs,
            pageCount: result.pages,
            pages: paginate.getArrayPages(req)(2, result.pages, currentPage)
        });
    });
});

function getQuery(req) {
    var query = {};
    if (req.query.title) {
        query.title = new RegExp('.*' + req.query.title + '.*', "i");
    }
    if (req.query.tags) {
        query.tags = new RegExp('.*' + req.query.tags + '.*', "i");
    }
    if (req.query.blogType) {
        query.blogType = req.query.blogType;
    }
    return query;
}

function getQueryToDisplay(req) {
    var query = {};
    if (req.query.title) {
        query.title = req.query.title;
    }
    if (req.query.tags) {
        query.tags = req.query.tags;
    }
    if (req.query.blogType) {
        query.blogType = req.query.blogType;
    }
    return query;
}

//创建博客
router.get('/create', function (req, res, next) {
    BlogType.find({}).sort({ name: 'asc' }).exec(function (err, blogTypes) {
        res.render('manage/editBlog', { title: 'Create Blog',blog:new Blog(), blogTypes: blogTypes });
    });
});

router.post('/createBlog', function (req, res, next) {
    var blog = new Blog({
        title: req.body.title,
        tags:req.body.tags,
        author: "york",
        body: req.body.editorBlog,
        comments: [],
        date: new Date(),
        hidden: req.body.publish!='on',
        meta: {},
        blogType: req.body.blogType,
        isDeleted: req.body.isDeleted='on',
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
    res.render("manage/editBlog", { title:'Modify Blog',blog: req.blog, blogTypes: req.blogTypes });
});

router.post('/editBlog', function (req, res, next) {
    Blog.findByIdAndUpdate(req.body.blogId,
        { $set: {
            title: req.body.title,
            tags: req.body.tags,
            author: "york",
            body: req.body.editorBlog,
            comments: [],
            modifyDate: new Date(),
            hidden: req.body.publish != 'on',
            meta: {},
            blogType: req.body.blogType,
            isDeleted: req.body.isDeleted = 'on',
            slug: req.body.slug
        } },
        function (err, doc) {
            if (err) return res.send(500, { error: err });
            res.redirect('/manage');
        });
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

//判断slug是否存在
router.get('/isSlugExist', function(req, res, next) {
    Blog.count({ slug:req.query.slug }, function (err, count) {
        if (count > 0) {
            res.json({ isExists: true });
        } else {
            res.json({ isExists: false });
        }
    }); 
});

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