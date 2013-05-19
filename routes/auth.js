exports.register = function(req, res){

    console.log("get...");

    res.render('register', { title: 'Express' });

};

exports.registerSubmit = function(req, res){


    console.log("post...");

    var mail = req.param('mail');
    var pwd = req.param('pwd');

    console.log(mail);
    console.log(pwd);


    GLOBAL.db.newUser(mail, pwd).then("my function").fail("error handling")

    //console.log(user);


    res.render('register', { title: 'Fast soup-io' });

};

exports.about = function(req, res){
    res.render('about', { title: 'Fast soup-io' });
};

