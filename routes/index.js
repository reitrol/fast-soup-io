
var db = require('./../lib/Database'),
    Q = require('q');

exports.index = function(req, res){
    if(res.iosession.hasSession()) {
        // user is logged in
        console.log("index::index  user has session");
        res.redirect('mystream');
    } else {
        console.log("index::index user has no session");
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
    console.log("index::mystream");
    console.log("fetching user");
    res.iosession.getUser().then(function(user) {
        console.log("populating stream");
        if(!user.stream) {
            console.log("user has now stream");
            var d = new Q.defer();
            d.resovle(null);
            return d.promise;
        }
        return db.populateStream(user.stream);
    }).then(function(stream) {
        console.log("got stream, render");
        console.log(require('util').inspect(stream));
        res.render('mystream', {stream: stream});
    }).fail(function(err) {
        console.log(err);
        //res.render('error', {error: err});
        res.render('index');
    });
}