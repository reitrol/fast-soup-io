
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

// Datenbank
var db = GLOBAL.db = require('mongoose');
db.connect('mongodb://soupio:rofl@5.9.81.44:27017/soupio');

// Datenbank Modelle
var Schema = db.Schema;
GLOBAL.schema = {};
GLOBAL.schema.userSchema = db.Schema({
      email         : String
    , password      : String
    , stream        : {type: Schema.Types.ObjectId, ref: 'Stream'}
    , friends       : [{type: Schema.Types.ObjectId, ref: 'User'}]
    , follows       : [{type: Schema.Types.ObjectId, ref: 'Stream'}]
});
GLOBAL.schema.streamSchema = db.Schema({
      name          : String
    , entries       : [{
            image       : Schema.Types.ObjectId,
            text        : String,
            created     : {type: Date, default: Date.now},
            copied_from : { stream: {type: Schema.Types.ObjectId, ref: 'Stream'}, entry: Schema.Types.ObjectId }
      }]
});
GLOBAL.schema.User      = db.model('User', GLOBAL.schema.userSchema);
GLOBAL.schema.Stream    = db.model('Stream', GLOBAL.schema.streamSchema);

// WebServer
var app = GLOBAL.app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
