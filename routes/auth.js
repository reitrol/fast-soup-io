/*
 * GET register page.
 */

var expect = require('chai');

exports.register = function(req, res){

    console.log("get...");

    res.render('register', { title: 'Express' });

};

exports.registerSubmit = function(req, res){
    console.log("post...");

    var mail = req.param('mail');
    var pwd = req.param('pwd');

    var isValidUser = validateEmail(mail);


    console.log("login: " + mail);
    console.log(isValidUser);
    console.log("password:" + pwd);

    if(isValidUser) {

        GLOBAL.db.newUser(mail, pwd).then("my function").fail("error handling")
    }

    res.render('register', { title: 'Fast soup-io' });

};

<<<<<<< HEAD


function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
=======
exports.about = function(req, res){
    res.render('about', { title: 'Fast soup-io' });
};


exports.login = function(req, res) {
    var mail = req.param('mail');
    var pwd  = req.param('pwd');

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

>>>>>>> 747b655381c4d29547687f2a8b20d393bdd9455b
