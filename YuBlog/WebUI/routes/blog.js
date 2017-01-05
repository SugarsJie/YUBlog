var express = require('express');
var passport = require('passport');
var Blog = require('../models/blog');
var BlogType = require('../models/blogtype');
var moment = require("moment");
var blogService = require('../service/blogService');
var router = express.Router();


router.get('/:year/:month/:day/:slug', blogService.findBlog, function (req, res, next) {
    res.render('manage/blogDetail', { blog: req.blog, moment: moment });
});

router.get(''

module.exports = router;