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

    this.Stream = this._conn.model('Stream', require('./schemas/streamSchema'), 'streams');
    this.User   = this._conn.model('User',   require('./schemas/userSchema'), 'users');



};
Database.prototype = {

    // User
    getUserById: function(id) {
        return this.User.findById(id);
    },
    newUser: function(email, password) {
        var user = this.User();
        user.email = email;
        user.password = password;
        user.save();
        return user;
    },
    authUser: function(email, password) {
        var defer = Q.defer();
        var promise = this.User.findOne({email: email}).exec();
        promise.then(function (user) {
            user.comparePassword(password)
                .fail(function(err) {
                    defer.reject(new Error('Authentification failed'));
                }).then(function() {
                    defer.resolve(user);
                })

        }).then(null, function(err) {
            defer.reject(new Error('Authentification failed'));
        });
        return defer.promise;
    },




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