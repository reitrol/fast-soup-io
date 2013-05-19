var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema,
    Q = require('q')
;

var schema = Schema({
    name          : String
    , entries       : [{
        image       : Schema.Types.ObjectId,
        text        : String,
        created     : { type: Date, default: Date.now},
        copied_from : { stream: {type: Schema.Types.ObjectId, ref: 'Stream'}, entry: Schema.Types.ObjectId }
    }]
});

module.exports = schema;