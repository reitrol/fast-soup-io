
var db = require('./../lib/Database');

exports.index = function(req, res){
    if(res.iosession.hasSession()) {
        // user is logged in
        res.redirect('mystream');
    } else {
        res.render('index');
    }
};

exports.image = function(req, res){
    var id = req.params.id;
    db.streamFile(id, res);
}

exports.listImages = function(req, res) {
    db.listFiles.then(function(pictures) {
        res.send(pictures);
    }).fail(function(err) {
        res.render('error', {error: err});
    });


}

exports.mystream = function(req,res ) {
    res.iosession.getUser().then(function(user) {
        return db.populateStream(stream);
    }).then(function(stream) {
        res.render('mystream', {stream: stream});
    }).fail(function(err) {
        res.render('error', {error: err});
    });
}