var db = require('./../lib/Database');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.profile = function(req, res){

    if(req.session.user) {
        res.render('profile', {title: 'Fast soup-io', errorInfo: "", user: req.session.user.email, pwd: ""});
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
        res.render('profile', {title: 'Fast soup-io', errorInfo: "Please insert a valid password " +
            "(min. 8 characters).", user: req.session.user.email, pwd: pwd});
    }
};