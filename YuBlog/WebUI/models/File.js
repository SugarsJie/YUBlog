var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var File = new Schema({
    originalFileName:String,
    date: { type: Date, default: Date.now },
    hashedFileName: String,
    downloadCount: Number,
    size: Number,
    remark:String
});

File.plugin(mongoosePaginate);

module.exports = mongoose.model('File', File);