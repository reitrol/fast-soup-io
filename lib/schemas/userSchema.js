var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema,
    bcrypt = require('bcrypt'),
    Q = require('q'),
    SALT_WORK_FACTOR = 10
;


var schema = Schema({
    email         : String
    , password      : String
    , stream        :  {type: Schema.Types.ObjectId, ref: 'Stream'}
    , friends       : [{type: Schema.Types.ObjectId, ref: 'User'}]
    , follows       : [{type: Schema.Types.ObjectId, ref: 'Stream'}]
});

schema.pre('save', function(next) {
    var user = this;
    if(!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

schema.methods.comparePassword = function(candidatePassword) {
    var defer = Q.defer();
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {
            defer.reject(new Error(err));
        } else {
            if(!isMatch) {
                defer.reject("auth error");
            } else {
                defer.resolve();
            }
        }
    });
    return defer.promise;
};



module.exports = schema;