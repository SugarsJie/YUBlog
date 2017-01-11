var express = require('express');
var moment = require("moment");
var blogService = require('../service/blogService');
var Blog = require('../models/Blog');
var paginate = require('express-paginate');
var router = express.Router();

router.use(paginate.middleware(10, 50));

router.get('/:year/:month/:day/:slug', blogService.findBlog,blogService.updateReadCount, function (req, res, next) {
    res.render('blog/blogDetail', { blog: req.blog, moment: moment });
});

router.get('/list', function (req, res, next) {
    var currentPage = req.query.page ? req.query.page : 1;
    var pageSize = req.query.limit ? req.query.limit : 10;

    Blog.paginate(getQuery(req), { page: currentPage, limit: pageSize }, function (err, result) {
        res.render('blog/blogList', {
            blogs: result.docs,
            pageCount: result.pages,
            moment: moment,
            pages: paginate.getArrayPages(req)(10, result.pages, currentPage)
        });
    });
});

function getQuery(req) {
    var query = {};
    query.isDeleted = false;
    query.hidden = false;

    if (req.query.blogType) {
        query.blogType = req.query.blogType;
    }
    return query;
}

module.exports = router;