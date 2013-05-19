exports.register = function(req, res){
    res.render('register', { title: 'Fast soup-io' });
};

exports.about = function(req, res){
    res.render('about', { title: 'Fast soup-io' });
};

