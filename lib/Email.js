var email = require('emailjs'),
    bcrypt = require('bcrypt'),
    Q = require('q')

;

var server  = email.server.connect({
    user:    "ENTER USER HERE",
    password:"ENTER PASSWORD HERE",
    host:    "ENTER HOST HERE",
    ssl:     true
});


exports.sendValidationMail = function(user) {
    var deferred = Q.defer();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return deferred.reject(err);

        //user.validateHash = salt;
        //user.save();

        server.send({
            text:    "click here to validate your account: ",
            from:    "ENTER MAIL FROM HERE",
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
};