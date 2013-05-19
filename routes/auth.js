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


    //user = GLOBAL.db.newUser(mail, pwd);

    //console.log(user);


    res.render('register', { title: 'Express' });

};

