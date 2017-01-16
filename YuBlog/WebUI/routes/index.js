var express = require('express');
var Account = require('../models/Account');
var Blog = require('../models/Blog');
var passport = require('passport');
var moment = require("moment");
var blogService = require('../service/blogService');
var router = express.Router();

/* GET home page. */
router.get('/',
    blogService.findBlogsShowOnHomePage,
    blogService.findBlogTypes,
    blogService.findBlogTypeCount,
    function (req, res) {
        res.render('home', {
            blogs: req.blogs,
            blogTypeCount: req.blogTypeCount,
            moment: moment
        });
    });

/*暂时只允许注册一个用户作为管理后台的使用者*/
router.get('/register', function (req, res) {
    Account.count({}, function (err, count) {
        console.log("Number of users:", count);
        if (count > 0) return res.send('Access Denied!');
        Account.register(new Account({ username: req.query.username }), req.query.password, function (err, account) {
            if (err) {
                return res.send('Register Denied!')
            }
            res.redirect('/login');
        });
    })
    
});

//登录
router.get('/login', function (req, res) {
    res.render('login', { title: 'Login-YuBlog',hideMenu:true });
});

//验证登录
router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect(req.session.returnUrl || '/manage');
    delete req.session.returnUrl;

});

//退出网站
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/about', function (req, res) {
    res.render('about', { title: 'About-YuBlog', hideMenu: true });
});



module.exports = router;