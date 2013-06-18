var Mongoose    = require('mongoose'),
    Grid        = require('gridfs-stream'),
    Q           = require('q'),
    util        = require('util'),
    fs          = require('fs')
;

var Database = function() {
    this.init = function(url) {
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
        this.Post   = this._conn.model('Post',   require('./schemas/postSchema'), 'posts');

    };


    this.save = function(obj) {
        var defer = Q.defer();
        obj.save(function(err) {
            if(err) {
                defer.reject(err);
            } else {
                defer.resolve(obj);
            }
        })
        return defer.promise;
    }

    this.populateStream = function(stream) {
        var defer = Q.defer();
        console.log("Database::populateStream");
        console.log(util.inspect(stream));
        this.Stream.findById(stream).populate('entries').exec(function(err, stream) {
            if(err) {
                defer.reject(err);
            } else {
                defer.resolve(stream);
            }
        });

        return defer.promise;
    }
    this.streamFile = function(id, res) {
        var readstream = this.gfs.createReadStream({_id: id });
        readstream.on('error', function (err) {
            console.log('Image ' + id + ' was not found:', err);
            res.status(404).send('Not found');
        });
        readstream.pipe(res);
    };
    this.listFiles = function() {
        var defer = Q.defer();
        this.gfs.files.find().toArray(function (err, files) {
            if(err) {
                defer.reject(err);
            } else {
                defer.resolve(files);
            }
        })
        return defer.promise;
    };
    this.newUser = function(email, password) {
        var self = this;
        var defer = Q.defer();

        this.User.findOne({email: email}, function(err, user) {
            if(!user) {
                // No user found
                var user = self.User();
                user.email = email;
                user.password = password;
                user.save(function(err) {
                    if(err) {
                        defer.reject(err);       // TODO: Only in debug mode. May contain sensitive informations
                    } else {
                        defer.resolve(user);
                    }
                })
            } else {
                // There is already a user with this mail
                defer.reject("Email already registered");
            }

        });
        return defer.promise;
    };
    this.authUser = function(email, password) {
        var defer = Q.defer();
        var promise = this.User.findOne({email: email}).exec();
        promise.then(function (user) {
            user.comparePassword(password)
                .fail(function(err) {
                    defer.reject('Authentification failed');
                 }).then(function() {
                    defer.resolve(user);
                 })

         }).then(null, function(err) {
                defer.reject('Authentification failed');
         });
        return defer.promise;
    };

    this.uploadFile = function(filename) {
        var deferred = Q.defer();
        var writestream = this.gfs.createWriteStream([]);
        var readstream = fs.createReadStream(filename);
        readstream.pipe(writestream);
        readstream.on('close', function () {
            fs.unlink(filename, function(err) {
                if(err) {
                    console.warn("Could not delete file: " + filename);
                }
            });
        });
        writestream.on('close', function(file) {
            console.log("db::uploadFile writestream.close: file: " + util.inspect(file));
            deferred.resolve(file);
        });
        return deferred.promise;
    };
    this.getUserByMail = function(email) {
        var defer = Q.defer();

        this.User.findOne({email: email}).exec()
            .then(function(user) {
                console.log("Database::getUserByMail got response from db");
                defer.resolve(user);
            }).then(null, function(err) {
                defer.reject(err);
        });

        return defer.promise;
    }
    this.getForeignStreamOfUser = function(email) {
        var defer = Q.defer();
        var self = this;

        this.User.findOne({email: email}).exec()
        .then(function(user) {
            console.log("user for foreign stream found");
            if(!user.stream) defer.reject();
            return self.populateStream(user.stream);
        }).then(function(stream) {
            console.log("stream for foreign populated");
            defer.resolve(stream);
        }).then(null, function(err) {
            console.log("Error while loading foreign stream: " + err);
            defer.reject("cannot load stream");
        });


        return defer.promise;
    }







    this.getNewStream = function(user) {
        var defer = Q.defer();
        var stream = this.Stream();
        user.stream = stream;
        user.save(function(err) {
            if(err) {
                defer.reject(err);
            } else {
                defer.resolve(stream);
            }
        });
        return defer.promise;
    }

    this.getNewPost = function() {
        console.log("creating new post");
        return this.Post();
    }
    this.getPostById = function(id) {
        var defer = Q.defer();
        this.Post.findById(id).exec().then(function(post) {
            defer.resolve(post);
        }).then(null, function(err) {
            defer.reject(err);
        });
        return defer.promise;
    }


    this.getUserById = function(id) {
        return this.User.findById(id);
    };









}
Database.instance = null;

Database.getInstance = function() {
    if(this.instance === null) {
        this.instance = new Database();
    }
    return this.instance;
}


module.exports = Database.getInstance();