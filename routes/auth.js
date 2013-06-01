var db = require('./../lib/Database');
var email = require('./../lib/Email');

exports.register = function(req, res){
    res.render('register', {title: 'Fast soup-io', errorInfo: "", user: "", pwd: "", isDisabled: "false"});
};

exports.registerSubmit = function(req, res){
    var mail = req.param('mail');
    var pwd = req.param('pwd');

    if(isValidMail(mail) && pwd.length >= 8) {

        db.newUser(mail, pwd).then(function(user){

            email.sendValidationMail(user);

        }).then(function() {

            res.render('register', {title: 'Fast soup-io', errorInfo: "Thank you for your registration! " +
                "An email has been sent to your registered email address!", user: mail, pwd: pwd,
                isDisabled : "disabled"});


        }).fail(function(err) {
            res.render('register', {title: 'Fast soup-io', errorInfo: err + "! Please try again.", user: mail, pwd: pwd,
                isDisabled : "false"});
        });



    } else {
        res.render('register', {title: 'Fast soup-io', errorInfo: "Please insert a valid email address " +
            "and a correct password (min. 8 characters).", user: mail, pwd: pwd, isDisabled : "false"});
    }
};


function isValidMail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

exports.about = function(req, res){
    res.render('about', { title: 'Fast soup-io' });
};


exports.login = function(req, res) {
    var mail = req.param('mail');
    var pwd  = req.param('password');

    db.authUser(mail, pwd)
        .then(function(user) {
            req.session.user = user;
            res.redirect('/');
        }).fail(function(err) {
           res.end("login failed");
        });
};
exports.logout = function(req, res) {
    req.session.destroy();
    res.render('logout', { title: 'Fast soup-io' });
};