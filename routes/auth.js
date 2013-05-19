/*
 * GET register page.
 */

exports.register = function(req, res){
    res.render('register', {title: 'Fast soup-io', errorInfo: ""});
};

exports.registerSubmit = function(req, res){
    var mail = req.param('mail');
    var pwd = req.param('pwd');

    var isValidUser = validateEmail(mail);

    if(isValidUser && pwd.length >= 8) {

        GLOBAL.db.newUser(mail, pwd).then(function(user) {
            req.session.user = user;
            res.end("registration successfull");
        }).fail(function(err) {
            res.end("registration failed");
        });


    } else {
        res.render('register', {title: 'Fast soup-io', errorInfo: "Please insert a valid email address " +
            "and a correct password (min. 8 characters)."});
    }
};


function validateEmail(email)
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

    GLOBAL.db.authUser(mail, pwd)
        .then(function(user) {
            req.session.user = user;
            res.end("login successfull");
        }).fail(function(err) {
           res.end("login failed");
        });
};
exports.logout = function(req, res) {
    req.session.destroy();
};