var express = require('express');
var Account = require('../models/account');
var Blog = require('../models/blog');
var passport = require('passport');
var moment = require("moment");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var blogs = Blog.find({}).sort({ _id: 'asc' }).exec(function (err, blogs) {
        res.render('home', { title: 'YuBlog', blogs: blogs, moment: moment });
    });
});

//登录
router.get('/login', function (req, res) {
    res.render('login', { title: 'Login-YuBlog' });
});

//验证登录
router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/manage');
});

//退出网站
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;