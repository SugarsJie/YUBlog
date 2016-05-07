﻿var express = require('express');
var passport = require('passport');
var Blog = require('../models/blog');
var router = express.Router();

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/', loggedIn, function (req, res, next) {
    res.send('wellcom' + req.user.username);
});

router.get('/create', loggedIn, function (req, res, next) {
    var blog = new Blog({
        title: 'test blog',
        author: '余正文',
        body: '123456789abcdefg'
    });

    blog.save(function (err) { 
        
    });

});

module.exports = router;