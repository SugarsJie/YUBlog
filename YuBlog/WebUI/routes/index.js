var express = require('express');
var Account = require('../models/account');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    Account.register(new Account({ username : "admin" }), "123456", function (err, account) {
        if (err) {
            return res.render('register', { account : account });
        }
        

    });

    res.render('index', { title: 'YuBlog' });
});

module.exports = router;