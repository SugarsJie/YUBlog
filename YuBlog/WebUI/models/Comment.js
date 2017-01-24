var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var Comment = new Schema({
    blogId: ObjectId,
    replyToId: ObjectId,
    userName: String,
    content: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', Comment);
