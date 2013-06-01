var db = require('./../lib/Database');
var email = require('./../lib/Email');

exports.register = function(req, res){
    res.render('register', {errorInfo: "", user: "", pwd: "", isDisabled: "false"});
};

exports.registerSubmit = function(req, res){
    var mail = req.param('mail');
    var pwd = req.param('pwd');

    if(!isValidMail(mail)) {
        res.flash('error', "Please enter a valid mail address");
        res.render('register');
        return;
    }
    if( pwd.length < 8 ) {
        res.flash('error', "Please enter at least 8 chars as password");
        res.render('register');
        return;
    }
    db.newUser(mail, pwd).then(function(user){
        //email.sendValidationMail(user); // TODO: Currently not working
    }).then(function() {
        req.flash('success', "Thank you for your registration! \n" +
            "An email has been sent to your registered email address!");
        res.redirect('/');

    }).fail(function(err) {
        req.flash('error', err + '! Please try agian.');
        res.render('register');
    });
};


function isValidMail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

exports.about = function(req, res){
    res.render('about');
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
    res.render('logout');
};