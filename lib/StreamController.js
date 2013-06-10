var Q   = require('q'),
    db  = require('./../lib/Database');

var StreamController = {
    post: function(user, image_id, text) {
        var defer = Q.defer();
        var self = this;

        if(!user) {
            defer.reject('Unknown user');
            return defer.promise;
        }

        var post = db.getNewPost();
        post.image = image_id;
        post.text = text;
        post.save(function(err) {
            if(err) {
                defer.reject("failed to create post: " + err);
            } else {
                var stream = user.stream;
                if(!stream) {
                    // user has no stream yet
                    db.getNewStream(user).then(function(stream) {
                        stream.name = "stream name";
                        stream.entries.push(post);
                        stream.save(function(err) {
                            if(err) {
                                defer.reject(err);
                                return;
                            }
                            defer.resolve();
                        });
                    }).fail(function(err) {
                            defer.reject(err);
                    });
                } else {
                    // user has a stream
                    stream.entires.push(post);
                    stream.save(function(err) {
                        if(err) {
                            defer.reject(err);
                        } else {
                            defer.resolve();
                        }
                    });
                }
            }
        });

        return defer.promise;
    },
    repost: function(user, foreign_post_id, text) {
        var defer = Q.defer();
        var self = this;

        if(!user) {
            defer.reject("Unkown user");
            return defer.promise;
        }
        var stream = user.stream;
        if(!stream) {
            defer.reject("Please post at least one photo before reposting");
            return defer.promise;
        }

        var foreign_post = db.getPostById(foreign_post_id);
        var post = db.getNewPost();
        if(!foreign_post) {
            defer.reject("Cannot find post with id " + foreign_post_id);
            return defer.promise;
        }

        post.image = foreign_post.image;
        post.text = text;
        post.copied_from = foreign_post_id;

        post.save(function(err) {
            if(err) {
                defer.reject(err);
                return;
            }

            stream.entires.push(post);
            stream.save(function(err) {
                if(err) {
                    defer.reject(err);
                    return;
                }
                defer.resolve();
            })
        });

        return defer.promise;
    }

}

module.exports = StreamController;