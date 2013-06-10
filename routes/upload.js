var db = require('./../lib/Database')
    , streamController = require('./../lib/StreamController')
;

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
    if(!res.iosession.hasSession()) {
        req.flash('error', 'not authenticated');
        res.redirect('/');
        return;
    }

    function sendAnswer() {
        if(req.param('uploadType') == 'inline') {
            res.redirect('/');
        } else {
            res.render('upload');
        }
    }

    var isValidImage = isImage(req.files.image.name);

    if(isValidImage) {
        db.uploadFile(req.files.image.path).then(function(file) {
            req.flash('success', 'Upload successful!');

            // image is now in database, create a new entry
            streamController.post(res.iosession.getUser(), file._id, 'Lorem ipsum').then(function() {
                // everthing ok
                req.flash('success', 'File uploaded');
                sendAnswer();
                return;
            }).fail(function(err) {
                req.flash('error', 'Creating a post failed');
                sendAnswer();
                return;
            });
        }).fail(function(err) {
            req.flash('error', 'Uploading failed. Please try again!');
            sendAnswer();
            return;
        })
    } else {
        req.flash('error', 'Invalid image! (Accepted filetypes: jpg|jpeg|gif|png|bmp)');
        sendAnswer();
        return;
    }
};


function isImage(fileName)
{
    var re = /\.(jpg|jpeg|gif|png|bmp)$/;
    return re.test(fileName);
}