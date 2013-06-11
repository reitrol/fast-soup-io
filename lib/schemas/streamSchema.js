var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema,
    Q = require('q')
;

var schema = Schema({
    name          : String
    , entries     : [ Schema.Types.ObjectId ]
});

module.exports = schema;