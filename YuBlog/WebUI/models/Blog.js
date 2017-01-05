var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var Blog = new Schema({
    title: String,
    author: String,
    tags: String,
    body: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs: Number
    },
    blogType: String,
    isDeleted: Boolean,
    slug:String
});

Blog.plugin(mongoosePaginate);

module.exports = mongoose.model('Blog', Blog);