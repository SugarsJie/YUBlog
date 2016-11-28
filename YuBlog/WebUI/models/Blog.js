var mongoose = require('mongoose');
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
    isDeleted: Boolean
});

module.exports = mongoose.model('Blog', Blog);