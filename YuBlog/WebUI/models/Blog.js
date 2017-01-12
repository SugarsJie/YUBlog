var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var Blog = new Schema({
    title: String,
    author: String,
    tags: String,
    summary:String,
    body: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    modifyDate:{ type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs: Number
    },
    readCount:Number,
    blogType: String,
    isDeleted: Boolean,
    slug: String,
    homePageOrder:Number
});

Blog.plugin(mongoosePaginate);

module.exports = mongoose.model('Blog', Blog);