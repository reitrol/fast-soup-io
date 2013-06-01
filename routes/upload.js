var db = require('./../lib/Database');

exports.form = function(req, res) {
    /*res.write(
        '<form method="post" enctype="multipart/form-data" action="/upload">' +
        '<input type="file" name="image">' +
        '<input type="submit">' +
        '</form>'
    );
    */
    res.render('upload', {title: 'upload'});
}

exports.post = function(req, res) {
    db.uploadFile(req.files.image.path).then(function() {
        res.end("done");
    })
}