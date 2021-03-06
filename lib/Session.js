var  db = require('./../lib/Database')
    ,Q   = require('q')
;

var Session = function(request) {
    this.request = request;
    this.s = request.session;
    this.local = {};
}
Session.prototype = {
    // can be called synchronous
    hasSession : function() {
        if(!this.s) return false;
        if(typeof(this.s.email) == 'undefined' || this.s.email == '') {
            console.log('has session: false');
            return false;
        }
        console.log('has session: true');
        return true;
    },
    // can be called synchronous
    logout: function() {
        this.local.user = null;
        this.s.destroy();
    },


    getUser : function() {
        var defer = Q.defer();
        var self = this;
        console.log("Session::getUser");
        if(typeof(this.local.user) == 'undefined' || this.local.user == null) {
            if(!this.hasSession()) {
                console.log("user has no session");
                defer.reject();
            }
            console.log("fetching user from database: " + this.s.email);
            db.getUserByMail(this.s.email).then(function(user) {
                console.log("got user from database");
                self.local.user = user;
                defer.resolve(user);
            }).done();
        } else {
            defer.resolve(this.local.user);
        }
        return defer.promise;
    },
    authUser : function(email, pwd) {
        var defer = Q.defer();
        var self = this;
        db.authUser(email, pwd).then(function(user) {
            console.log("self.s.email = " + user.email);
            self.s.email = user.email;
            console.log(self.s);
            defer.resolve(user);
        }).fail(function(err) {
            console.log("auth failed");
            self.s.email = '';
            defer.reject(err);
        });
        return defer.promise;
    }



}


module.exports = Session;