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

function findRecentUpdateBlogs(req, res, next) {
    Blog.find({ "isDeleted": false, hidden: false }).sort({ date: 'desc' }).limit(3).exec(function (err, blogs) {
        req.blogs = blogs;
        next();
    });
}

/*将博客按照类型分组计数
 *只查询未隐藏，未删除的博客
 *分组结果按照博客类型排序
 */
function findBlogTypeCount(req, res, next) {
    Blog.aggregate([
        {
            $match: {
                isDeleted: false,
                hidden:false
            }
        },
        {
            $group: {
                _id: "$blogType",
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                _id:1
            }
        }
    ], function (err, result) {
        req.blogTypeCount = result;
        next();
    });
}


module.exports = {
    findBlog: findBlog,
    findBlogTypes: findBlogTypes,
    findRecentUpdateBlogs: findRecentUpdateBlogs,
    findBlogTypeCount: findBlogTypeCount
};