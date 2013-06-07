var db = require('./../lib/Database');

exports.pictures = function(req, res){
    if(req.session.user) {
        var list = db.listFiles();
        res.render('profile', {errorInfo: "", user: req.session.user.email, pwd: ""});
    } else {
        res.redirect("/");
    }
};

exports.profile = function(req, res){

    if(req.session.user) {
        res.render('profile', {errorInfo: "", user: req.session.user.email, pwd: ""});
    } else {
        res.redirect("/");
    }

};


exports.profileUpdate = function(req, res){
    var pwd = req.param('pwd');

    if(pwd.length >= 8) {

        req.session.user.password = pwd;
        req.session.save(function(err){
            // session saved
        });
        res.redirect("/")

    } else {
        req.flash('error', 'Please use a password with min. 8 characters');
        res.render('profile');
    }
};