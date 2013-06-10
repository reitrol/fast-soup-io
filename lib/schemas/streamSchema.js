var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema,
    Q = require('q')
;

var schema = Schema({
    name          : String
    , entries     : [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

module.exports = schema;