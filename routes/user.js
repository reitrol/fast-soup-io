var db = require('./../lib/Database');

exports.pictures = function(req, res){
    if(req.iosession.hasSession()) {
        var list = db.listFiles();
        res.render('profile', {errorInfo: "", user: req.iosession.getUser().email, pwd: ""});
    } else {
        res.redirect("/");
    }
};

exports.profile = function(req, res){

    if(req.iosession.hasSession()) {
        res.render('profile', {errorInfo: "", user: req.iosession.getUser().email, pwd: ""});
    } else {
        res.redirect("/");
    }

};


exports.profileUpdate = function(req, res){
    var pwd = req.param('pwd');

    if(pwd.length >= 8) {

        req.iosession.getUser().password = pwd;
        req.iosession.getUser().save(function(err){
            // session saved
        });
        res.redirect("/")

    } else {
        req.flash('error', 'Please use a password with min. 8 characters');
        res.render('profile');
    }
};
