var express = require('express');
var Account = require('../models/account');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    //Account.register(new Account({ username : "admin" }), "york9527", function (err, account) {
    //    if (err) {
    //        return res.render('register', { account : account });
    //    }
    //});

    res.render('home', { title: 'YuBlog' });
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