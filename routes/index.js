
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Fast soup-io' });
};

exports.image = function(req, res){
    var id = req.params.id;
    GLOBAL.db.streamFile(id, res);
}

exports.listImages = function(req, res) {
    GLOBAL.db.listFiles();
    res.send("see console");
}

exports.uploadSun = function(req,res ) {
    GLOBAL.db.uploadSun();
    res.send("done");
}

exports.mystream = function(req,res ) {
    res.render('mystream', {title: 'mystream'});
}