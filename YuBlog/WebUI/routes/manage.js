var express = require('express');
var passport = require('passport');
var Blog = require('../models/Blog');
var BlogType = require('../models/BlogType');
var moment = require("moment");
var blogService = require('../service/blogService');
var paginate = require('express-paginate');
var router = express.Router();

router.use(paginate.middleware(10, 50));

//管理后台需要登录后才能进入
router.use(function (req, res, next) {
    res.locals.user = req.user;
    req.session.returnUrl = req.originalUrl;
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
});

//管理后台博客列表
router.get('/', blogService.findBlogTypes,function (req, res, next) {
    var currentPage = req.query.page ? req.query.page : 1;
    var pageSize = req.query.limit ? req.query.limit : 20;
    var order = req.query.order ? req.query.order : 1;
    var sort = req.query.sort ? req.query.sort : '-date';
    var orderPrefix = order > 0 ? '' : '-';
    var orderStr = orderPrefix + sort;
    var query = getQuery(req);
    
    var x = req.blogTypes;
    var defaultBlogType = new BlogType();
    defaultBlogType.name = '全部';
    x.splice(0, 0, defaultBlogType);

    Blog.paginate(query, { page: currentPage, limit: pageSize, sort: orderStr }, function (err, result) {
        res.render('manage/homeMng', {
            title: 'Manage-Home',
            order: order * -1,
            sort: sort,
            query: getQueryToDisplay(req),
            blogTypes: x,
            moment: moment,
            blogs: addOrderNumber(result.docs, currentPage, pageSize),
            pageCount: result.pages,
            pages: paginate.getArrayPages(req)(10, result.pages, currentPage)
        });
    });
});

function addOrderNumber(blogs, currentPage, pageSize) {
    var orderStart = currentPage * pageSize - pageSize + 1;
    for (var i = 0; i < blogs.length; i++) {
        blogs[i]._doc.orderNumber = orderStart++;
    }
    return blogs;
}

function getQuery(req) {
    var query = {};
    if (req.query.title) {
        query.title = new RegExp('.*' + req.query.title + '.*', "i");
    }
    if (req.query.tags) {
        query.tags = new RegExp('.*' + req.query.tags + '.*', "i");
    }
    if (req.query.blogType && req.query.blogType !=="全部") {
        query.blogType = req.query.blogType;
    }
    if (req.query.hidden === '1') {
        query.hidden = false;
    } else if (req.query.hidden === '2') {
        query.hidden = true;
    } 

    if (req.query.isDeleted ==='1') {
        query.isDeleted = true;
    } else if (req.query.isDeleted === '2') {
        query.isDeleted = false;
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

    query.blogType = req.query.blogType ? req.query.blogType:"全部";
    query.hidden = req.query.hidden ? req.query.hidden:"0";
    query.isDeleted = req.query.isDeleted ? req.query.isDeleted : "0";
    return query;
}

//创建博客
router.get('/create', function (req, res, next) {
    BlogType.find({}).sort({ name: 'asc' }).exec(function (err, blogTypes) {
        res.render('manage/editBlog', { title: 'Create Blog', blog: new Blog(), blogTypes: blogTypes, moment: moment });
    });
});

router.post('/createBlog', function (req, res, next) {
    var blog = new Blog({
        title: req.body.title,
        tags:req.body.tags,
        author: "york",
        body: req.body.editorBlog,
        summary: req.body.summary,
        comments: [],
        date: req.body.date,
        hidden: req.body.publish !=='on',
        meta: {},
        blogType: req.body.blogType,
        isDeleted: req.body.isDeleted==='on',
        slug: req.body.slug,
        readCount: 0,
        homePageOrder: req.body.homePageOrder
    });
    blog.save();
    res.redirect('/manage');
});

//博客详细
router.get('/blogDetail/:slug', blogService.findBlog,function (req,res,next) {
    res.render('manage/blogDetail', { blog: req.blog, moment: moment });
});

//修改博客
router.get('/editBlog/:Id', blogService.findBlogTypes, blogService.findBlogById, function (req, res, next) {
    res.render("manage/editBlog", { title: 'Modify Blog', blog: req.blog, blogTypes: req.blogTypes, moment: moment });
});

router.post('/editBlog', function (req, res, next) {
    Blog.findByIdAndUpdate(req.body.blogId,
        { $set: {
            title: req.body.title,
            tags: req.body.tags,
            author: "york",
            body: req.body.editorBlog,
            summary: req.body.summary,
            comments: [],
            modifyDate: new Date(),
            hidden: req.body.publish !== 'on',
            meta: {},
            blogType: req.body.blogType,
            isDeleted: req.body.isDeleted === 'on',
            slug: req.body.slug,
            date: req.body.date,
            homePageOrder: req.body.homePageOrder
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
router.get('/isSlugExist', function (req, res, next) {
    Blog.count({ $and: [{ slug: req.query.slug }, { _id: { $ne: req.query.id } }] }, function (err, count) {
        if (err) return res.send(500, { error: err });
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
        date: new Date()
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