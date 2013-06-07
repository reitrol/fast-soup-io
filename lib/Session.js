var db = require('./../lib/Database');

var Session = function(request) {
    this.request = request;
    this.s = request.session;
    this.local = {};
}
Session.prototype = {
    hasSession : function() {
        if(!this.s) return false;
        if(typeof(this.s.email) == 'undefined' || this.s.email == '') {
            //console.log('has session: false');
            return false;
        }
        //console.log('has session: true');
        return true;
    },
    getUser : function() {
        if(typeof(this.local.user) == 'undefined' || this.local.user == null) {
            //console.log('getUser: fetch');
            if(!this.hasSession()) return null;
            this.local.user = db.getUserById(this.s.email);
        }
        //console.log('getUser');
        return this.local.user;
    },
    authUser : function(email, pwd, funcValid, funcInvalid) {
        //console.log('auth(' + email + ', ' + pwd + ')');
        var self = this;
        db.authUser(email, pwd)
            .then(function(user) {
                //console.log('auth success');
                self.s.email = user.email;
                //console.log('auth success');
                funcValid(user);
            }).fail(function(err) {
                //console.log('auth fail');
                self.s.email = '';
                //console.log('auth fail');
                funcInvalid(err);
            });
    },
    logout: function() {
        this.local.user = null;
        this.s.destroy();
    }

}


module.exports = Session;