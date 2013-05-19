var email = require('email'),
    bcrypt = require('bcrypt'),
    Q = require('q')

;

// TODO: move to config file
var server  = email.server.connect({
    user:    "username",
    password:"password",
    host:    "smtp.gmail.com",
    ssl:     true
});


exports.sendValidationMail = function(user) {
    var deferred = Q.defer();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return deferred.reject(err);

        user.validateHash = salt;
        user.save();

        server.send({
            text:    "click here to validate your account: ",
            from:    "fast.soup.io",
            to:      user.email,
            subject: "validate account"
        }, function(err, message) {
            if(err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(message);
            }
        });

    });


    return deferred.promise;
}

exports.validate = function(user, hash) {
    if(user.hash == hash) {
        user.hash = null;
        user.emailValidated = true;
        user.save();
        return true;
    } else {
        return false;
    }
}