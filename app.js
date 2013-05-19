
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , auth = require('./routes/auth')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , Database = require('./lib/Database')
;

GLOBAL.db = new Database('mongodb://soupio:rofl@5.9.81.44:27017/soupio');

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
app.get('/i/:id', routes.image);
app.get('/i', routes.listImages);
app.get('/i_upload', routes.uploadSun);
app.get('/register', auth.register);
app.get('/about', auth.about);

app.post('/register', auth.registerSubmit);
app.post('/login', auth.login);
app.get('/logout', auth.logout);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
