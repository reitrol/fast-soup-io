var db = require('./../lib/Database');

exports.pictures = function(req, res){
    if(res.iosession.hasSession()) {
        var list = db.listFiles();
        res.render('profile', {errorInfo: "", user: res.iosession.getUser().email, pwd: ""});
    } else {
        res.redirect("/");
    }
};

exports.profile = function(req, res){

    if(res.iosession.hasSession()) {
        res.render('profile', {errorInfo: "", user: res.iosession.getUser().email, pwd: ""});
    } else {
        res.redirect("/");
    }

};


exports.profileUpdate = function(req, res){
    var pwd = req.param('pwd');

    if(pwd.length >= 8) {

        res.iosession.getUser().password = pwd;
        res.iosession.getUser().save(function(err){
            // session saved
        });
        res.redirect("/")

    } else {
        req.flash('error', 'Please use a password with min. 8 characters');
        res.render('profile');
    }
};
