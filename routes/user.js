var db = require('./../lib/Database');

exports.profile = function(req, res){
    if(res.iosession.hasSession()) {
        res.iosession.getUser().then(function(user) {
            res.render('profile', {errorInfo: "", user: user.email, pwd: ""});
        });
    } else {
        res.redirect("/");
    }

};


exports.profileUpdate = function(req, res){
    var pwd = req.param('pwd');

    if(pwd.length < 8) {
        req.flash('error', 'Please use a password with min. 8 characters');
        res.render('profile');
        return;
    }

    res.iosession.getUser().then(function(user) {
        user.password = pwd;
        return db.save(user);
    }).then(function() {
        req.flash('success', 'Profile saved');
        res.redirect("/")
    }).fail(function(err) {
        res.render('error', {error: err});
    });
};
