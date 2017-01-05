var express = require('express');
var moment = require("moment");
var blogService = require('../service/blogService');
var Blog = require('../models/blog');
var paginate = require('express-paginate');
var router = express.Router();

router.use(paginate.middleware(2, 50));

router.get('/:year/:month/:day/:slug', blogService.findBlog, function (req, res, next) {
    res.render('manage/blogDetail', { blog: req.blog, moment: moment });
});

router.get('/list', function (req, res, next) {
    var currentPage = req.query.page ? req.query.page : 1;
    var pageSize = req.query.limit ? req.query.limit : 2;
    Blog.paginate({ 'isDeleted': false }, { page: currentPage, limit: pageSize }, function (err, result) {
        var x = paginate.getArrayPages(req)(3, result.pages, currentPage);
        res.render('blog/blogList', {
            blogs: result.docs,
            pageCount: result.pages,
            pages: paginate.getArrayPages(req)(2, result.pages, currentPage)
        });
    });
});

//router.get('/list', function (req, res, next) {
//    Blog.paginate({ 'isDeleted': false }, { page: 1, limit: 2 }, function (err, result) {
//        res.render('blog/blogList', { blogs: result.docs });
//    });
//});

module.exports = router;