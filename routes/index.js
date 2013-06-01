
var db = require('./../lib/Database');
/*
 * GET home page.
 */

exports.index = function(req, res){
  /*req.flash('info', 'Test');
    req.flash('info', 'Test');
    req.flash('success', 'Test');
    req.flash('error', 'Test');                   */
  res.render('index');
};

exports.image = function(req, res){
    var id = req.params.id;
    db.streamFile(id, res);
}

exports.listImages = function(req, res) {
    db.listFiles();
    res.send("see console");
}

exports.uploadSun = function(req,res ) {
    db.uploadSun();
    res.send("done");
}

exports.mystream = function(req,res ) {
    res.render('mystream', {title: 'mystream'});
}