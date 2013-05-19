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



function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}