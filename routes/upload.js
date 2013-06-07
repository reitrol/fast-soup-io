var db = require('./../lib/Database');

exports.form = function(req, res) {
    /*res.write(
        '<form method="post" enctype="multipart/form-data" action="/upload">' +
        '<input type="file" name="image">' +
        '<input type="submit">' +
        '</form>'
    );
    */
    res.render('upload');
}

exports.post = function(req, res) {
    db.uploadFile(req.files.image.path).then(function() {
        req.flash('error', 'Upload successful!');
        res.render('upload');
    }).fail(function(err) {
        req.flash('error', 'Upload failed! Please try again!');
        res.render('upload');
    })
};