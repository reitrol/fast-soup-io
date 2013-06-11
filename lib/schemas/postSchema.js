var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema,
    Q = require('q')
    ;

var schema = Schema({
    image       : Schema.Types.ObjectId,
    text        : String,
    created     : { type: Date, default: Date.now},
    copied_from : Schema.Types.ObjectId
});

module.exports = schema;