var express = require('express');
var passport = require('passport');
var router = express.Router();
var multer = require('multer');
var uuid = require('node-uuid');
var path = require('path');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v1() + getFileExtention(file));
    }
});

function fileFilter(req, file, cb) {
    var filetypes = /jpeg|jpg|png|bmp|gif|zip/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(getFileExtention(file));

    if (mimetype && extname) {
        return cb(null, true);
    }

    return cb(new Error("只能上传这些文件格式：" + filetypes));
}

function getFileExtention(file) {
    return path.extname(file.originalname).toLowerCase();
}

var upload = multer({
    storage: storage ,
    fileFilter: fileFilter
});



router.get('/upload', function(req,res,next) {
    res.render('file/fileUpload');
});

router.post('/upload', upload.any(), function (req, res, next) {
    res.send({ "isSuccess": true, "url": "uploads/"+req.files[0].filename });
});




module.exports = router;