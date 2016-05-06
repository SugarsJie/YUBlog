var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    res.render("manage/login");
});

router.post('/login', passport.authenticate("local"),function(req,res) {
    //res.redirect("/test");
    res.send("loged in");
});

//router.post('/login', function (req, res) {
//    res.send("loged in"); 
//});

router.get('/test', function (req, res) {
    res.send("asdf");
});

module.exports = router;