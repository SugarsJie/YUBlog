var express = require('express');
var passport = require('passport');
var router = express.Router();
var multer = require('multer');
var uuid = require('node-uuid');
var path = require('path');
var moment = require("moment");
var File = require('../models/File');
var paginate = require('express-paginate');
var mime = require('mime');
const fs = require('fs');

router.use(paginate.middleware(10, 50));

router.use(function (req, res, next) {
    res.locals.user = req.user;
    req.session.returnUrl = req.originalUrl;
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
});

/*图片存储在这里*/
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v1() + getFileExtention(file.originalname));
    }
});

function fileFilter(req, file, cb) {
    var filetypes = /jpeg|jpg|png|bmp|gif|zip/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(getFileExtention(file.originalname));

    if (mimetype && extname) {
        return cb(null, true);
    }

    return cb(new Error("只能上传这些文件格式：" + filetypes));
}

function getFileExtention(fileName) {
    return path.extname(fileName).toLowerCase();
}

var upload = multer({
    storage: storage ,
    fileFilter: fileFilter
});

/*ckeditor里面上传图片使用*/
router.post('/upload', upload.any(), function (req, res, next) {
    var fileName = req.files[0].filename;
    var result = {
        "uploaded": 1,
        "fileName": fileName,
        "url": "/uploads/" + fileName
    }

    res.send(result);
});

/*编辑器以外的文件上传处理*/
var storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploadFiles");
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v1() + getFileExtention(file.originalname));
    }
});
var uploadFile = multer({storage:storage2});

router.get('/filelist', function (req, res, next) {
    var currentPage = req.query.page ? req.query.page : 1;
    var pageSize = req.query.limit ? req.query.limit : 20;
    var query = getQuery(req);

    File.paginate(query, { page: currentPage, limit: pageSize, sort: "-date" }, function (err, result) {
        res.render('file/fileList', {
            title: 'Manage-FileList',
            moment: moment,
            files: result.docs,
            query: getQueryToDisplay(req),
            pageCount: result.pages,
            pages: paginate.getArrayPages(req)(10, result.pages, currentPage)
        });
    });
});

function getQuery(req) {
    var query = {};
    if (req.query.originalFileName) {
        query.originalFileName = new RegExp('.*' + req.query.originalFileName + '.*', "i");
    }
    if (req.query.remark) {
        query.remark = new RegExp('.*' + req.query.remark + '.*', "i");
    }
    return query;
}

function getQueryToDisplay(req) {
    var query = {};
    if (req.query.originalFileName) {
        query.originalFileName = req.query.originalFileName;
    }
    if (req.query.remark) {
        query.remark = req.query.remark;
    }
    return query;
}

router.get('/uploadFile', function(req, res, next) {
    res.render('file/fileUpload', { title: 'Upload File' });
});

/*文件上传页面使用*/
router.post('/uploadFile', uploadFile.any(),function (req, res, next) {
    if (req.files.length === 0) return;
    var fileUploaded = req.files[0];
    var file = new File({
        originalFileName: fileUploaded.originalname,
        date: new Date(),
        hashedFileName: fileUploaded.filename,
        downloadCount: 0,
        remark: req.body.remark,
        size: fileUploaded.size
    });
    file.save();
    res.redirect(301, '/file/filelist');
});

/*下载编辑器以外上传的文件*/
router.get('/download', function (req, res, next) {
    File.findOne({ hashedFileName: req.query.fileName }, function (err, doc) {
        if (!err) {
            doc.downloadCount++;
            doc.save();
        }

        var file = global.appRoot + "\\uploadFiles\\" + req.query.fileName

        var filename = path.basename(file);
        var mimetype = mime.lookup(file);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
    });
});

router.post('/delete', function (req, res, next) {
    var filePath = global.appRoot + "\\uploadFiles\\" + req.body.hashedFileName;
    fs.unlink(filePath, (err) => {
        if (err) throw err;
        File.remove({ hashedFileName: req.body.hashedFileName }, function (err) {
            if (!err) {
                res.send("success");
            }
            else {
                return res.send(500, { error: err });
            }
        });
    });
});


module.exports = router;