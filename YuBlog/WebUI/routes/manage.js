var express = require('express');
var passport = require('passport');
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

module.exports = router;