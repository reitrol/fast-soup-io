var Q   = require('q'),
    db  = require('./../lib/Database');

var StreamController = {
    post: function(user, image_id, text) {
        var defer = Q.defer();
        var self = this;

        console.log("StreamController::post");
        if(!user) {
            defer.reject('Unknown user');
            return defer.promise;
        }

        console.log("creating new post");
        var post = db.getNewPost();
        post.image = image_id;
        post.text = text

        console.log("saving post");
        db.save(post).then(function() {
            console.log("post saved");
            if(!user.stream) {
                console.log("user has no stream, creating one");
                return db.getNewStream(user);
            }
            console.log("user has stream, populate it");
            return db.populateStream(user.stream);
        }).then(function(stream) {
            console.log("stream is now available");
            if(!stream.name) {
                console.log("stream has no name, giving one");
                stream.name = "stream name";
            }
            if(!stream.entries) {
                console.log("stream has no entries, creating empty array");
                stream.entries = [];
            }
            console.log("push post in stream");
            stream.entries.push(post);
            console.log("sending save request");
            return db.save(stream);
        }).then(function() {
                console.log("save successful");
                defer.resolve();
        }).fail(function(err) {
                console.log("save failed: " + err);
                defer.reject(err);
        });

    /*
        post.save(function(err) {
            if(err) {
                defer.reject("failed to create post: " + err);
            } else {
                var stream = db.loadStream(user.stream);
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
                    if(!stream.entries) {
                        stream.entries = [];
                    }
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
        });      */

        return defer.promise;
    },
    repost: function(user, foreign_post_id, text) {
        var defer = Q.defer();
        var self = this;

        if(!user) {
            defer.reject("Unkown user");
            return defer.promise;
        }

        console.log("fetching current user stream");
        var stream = user.stream;
        if(!stream) {
            defer.reject("Please post at least one photo before reposting");
            return defer.promise;
        }

        console.log("populating current user stream");
        db.populateStream(stream).then(function(streamObj) {
            stream = streamObj;
            console.log("fetching foreign post");
            return db.getPostById(foreign_post_id);
        }).then(function(foreign_post) {
            if(!foreign_post) {
                defer.reject("Cannot find post with id " + foreign_post_id);
            }
            console.log("foreign post loaded");
            var post = db.getNewPost();
            post.image = foreign_post.image;
            post.text = text;
            post.copied_from = foreign_post_id;

            console.log("saving new post");
            return db.save(post);
        }).then(function(post) {
            console.log("pushing new post to stream");
            stream.entries.push(post);
            return db.save(stream);
        }).then(function() {
            defer.resolve();
        }).fail(function(err) {
            defer.reject(err);
        });

        /*
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
        */
        return defer.promise;
    }

}

module.exports = StreamController;