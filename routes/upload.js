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

    var isValidImage = isImage(req.files.image.name);

    if(isValidImage) {
        db.uploadFile(req.files.image.path).then(function() {
            req.flash('success', 'Upload successful!');
            res.render('upload');
        }).fail(function(err) {
            req.flash('error', 'Upload failed! Please try again!');
            res.render('upload');
        })
    } else {
        req.flash('error', 'Invalid image! (Accepted filetypes: jpg|jpeg|gif|png|bmp)');
        res.render('upload');
    }
};


function isImage(fileName)
{
    var re = /\.(jpg|jpeg|gif|png|bmp)$/;
    return re.test(fileName);
}