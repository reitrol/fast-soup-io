var Mongoose    = require('mongoose'),
    Grid        = require('gridfs-stream'),
    Q           = require('q'),
    util        = require('util'),
    fs          = require('fs')
;

var Database = function(url) {
    var self = this;
    this._url = url;
    this._conn = Mongoose.createConnection(url, {server: {socketOptions : {keepAlive: 1}}});

    this._conn.once('open', function() {
        // this = the connection object
        console.log("Connected to mongodb");
        console.log("Starting GridFS connection");
        self.gfs = Grid(self._conn.db, Mongoose.mongo);
    });

    var Schema = Mongoose.Schema;
    this._userSchema = Schema({
        email         : String
        , password      : String
        , stream        :  {type: Schema.Types.ObjectId, ref: 'Stream'}
        , friends       : [{type: Schema.Types.ObjectId, ref: 'User'}]
        , follows       : [{type: Schema.Types.ObjectId, ref: 'Stream'}]
    });
    this._streamSchema = Schema({
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
    streamFile: function(id, res) {
        var readstream = this.gfs.createReadStream({ _id: id });
        readstream.on('error', function (err) {
            console.log('Image ' + id + ' was not found:', err);
            res.status(404).send('Not found');
        });
        readstream.pipe(res);
    },
    listFiles: function() {
        this.gfs.files.find().toArray(function (err, files) {
            if (!err)
                console.log(files);
        })
    },
    uploadSun: function() {
        var writestream = this.gfs.createWriteStream([]);
        fs.createReadStream('docs/Sun.jpg').pipe(writestream);
    }

};

module.exports = Database;