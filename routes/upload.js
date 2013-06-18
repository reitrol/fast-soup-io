var db = require('./../lib/Database')
    , streamController = require('./../lib/StreamController')
;

exports.form = function(req, res) {
    res.render('upload');
}

exports.post = function(req, res) {
    if(!res.iosession.hasSession()) {
        req.flash('error', 'not authenticated');
        res.redirect('/');
        return;
    }

    var isValidImage = isImage(req.files.image.name);
    var file;
    if(isValidImage) {
        db.uploadFile(req.files.image.path).then(function(fileObj) {
            // fetch user
            file = fileObj;
            return res.iosession.getUser();
        }).then(function(user) {
            // image is now in database, create a new entry
            console.log("inserting new post");
            return streamController.post(user, file._id, 'Lorem ipsum');
        }).then(function() {
            // everthing ok
            req.flash('success', 'Upload successful!');
            res.redirect('mystream');
        }).fail(function(err) {
            req.flash('error', "Upload failed");
            console.log(err);
            if(req.param('uploadType') == 'inline') {
                res.redirect('/');
            } else {
                res.render('upload');
            }
        });
    } else {
        req.flash('error', 'Invalid image! (Accepted filetypes: jpg|jpeg|gif|png|bmp)');
        if(req.param('uploadType') == 'inline') {
            res.redirect('/');
        } else {
            res.render('upload');
        }
    }
};


function isImage(fileName)
{
    var re = /\.(jpg|jpeg|gif|png|bmp)$/;
    return re.test(fileName);
}