var db = require('./../lib/Database');
var email = require('./../lib/Email');

exports.register = function(req, res){
    res.render('register', {user: "", pwd: ""});
};

exports.registerSubmit = function(req, res){
    var mail = req.param('mail');
    var pwd = req.param('pwd');

    if(!isValidMail(mail)) {
        req.flash('error', "Please enter a valid mail address");
        res.render('register', {user: mail, pwd: pwd});
        return;
    }
    if( pwd.length < 8 ) {
        req.flash('error', "Please enter at least 8 chars as password");
        res.render('register', {user: mail, pwd: pwd});
        return;
    }
    db.newUser(mail, pwd).then(function(user){
        return email.sendValidationMail(user);
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

    res.iosession.authUser(mail, pwd).then(function(user) {
	    req.flash('success', "Login successful!");
        res.redirect('/');
    }).fail(function(err) {
        req.flash('error', "Login failed. Please try again!");
        res.render('index');
    });
};
exports.logout = function(req, res) {
    res.iosession.logout();
    res.redirect('/');
};
