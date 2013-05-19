
exports.form = function(req, res) {
    res.write(
        '<form method="post" enctype="multipart/form-data" action="/upload">' +
        '<input type="file" name="image">' +
        '<input type="submit">' +
        '</form>'
    );
    res.end('');
}

exports.post = function(req, res) {
    GLOBAL.db.uploadFile(req.files.image.path).then(function() {
        res.end("done");
    })
}