var Q   = require('q'),
    db  = require('./../lib/Database');




var Stream = function() {

}
Stream.prototype = {
    addPicture: function(user, image_id, text) {
        var defer = Q.defer();
        var self = this;

        if(!user) {
            defer.reject('Unknown user');
            return defer.promise;
        }

        var stream = user.stream;
        if(!stream) {
            // user has no stream yet
            stream = db.g
        }





        return defer.promise;
    }

}

module.exports = Stream;