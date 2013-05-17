var Mongoose    = require('mongoose'),
    Grid        = require('gridfs-stream'),
    Q           = require('q')
;

var Database = function(url) {
    this._url = url;
    this._conn = Mongoose.createConnection(url, {server: {socketOptions : {keepAlive: 1}}})

    this._conn.once('open', function() {
        require('utils').
        console.log("Connected to mongodb");
        console.log("Starting GridFS connection");
        this.gfs = Grid(this._conn.db, Mongoose.mongo);
    });

    var Schema = Mongoose.Schema;
    this._userSchema = Schema({
        email         : String
        , password      : String
        , stream        :  {type: Schema.Types.ObjectId, ref: 'Stream'}
        , friends       : [{type: Schema.Types.ObjectId, ref: 'User'}]
        , follows       : [{type: Schema.Types.ObjectId, ref: 'Stream'}]
    });
    this,_streamSchema = Schema({
        name          : String
        , entries       : [{
            image       : Schema.Types.ObjectId,
            text        : String,
            created     : { type: Date, default: Date.now},
            copied_from : { stream: {type: Schema.Types.ObjectId, ref: 'Stream'}, entry: Schema.Types.ObjectId }
        }]
    });

    this.Stream = Mongoose.model('Stream', this._streamSchema, 'streams');
    this.User   = Mongoose.model('User',   this._userSchema, 'users');

};
Database.prototype = {

};

module.exports = Database;