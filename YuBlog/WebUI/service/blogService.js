var Blog = require('../models/blog');
var BlogType = require('../models/blogtype');


function findBlog(req, res, next) {
    Blog.findOne({ slug: req.params.slug }, function (err, blog) {
        req.blog = blog;
        next();
    });
}

function findBlogTypes(req, res, next) {
    BlogType.find({}).sort({ name: 'asc' }).exec(function (err, blogTypes) {
        req.blogTypes = blogTypes;
        next();
    });
}

function findRecentUpdateBlogs(req,res,next) {
    Blog.find({ "isDeleted": false }).sort({ date: 'desc' }).limit(20).exec(function (err, blogs) {
        req.blogs = blogs;
        next();
    });
}



module.exports = {
    findBlog: findBlog,
    findBlogTypes: findBlogTypes,
    findRecentUpdateBlogs: findRecentUpdateBlogs
};