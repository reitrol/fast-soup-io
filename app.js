
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , auth = require('./routes/auth')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , db = require('./lib/Database')
  , upload = require('./routes/upload')
  , flash = require('connect-flash')
  , Session = require('./lib/Session')
;

db.init('mongodb://soupio:rofl@5.9.81.44:27017/soupio');

// WebServer
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({uploadDir:'./uploads'}));
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());

// Exposes sessions to jade (e.g. #{session.user.email}
app.use(function(req,res,next){
	res.iosession = new Session(req);  // make visible for routes
	res.locals.iosession = res.iosession;  // make visible for pages    
    res.locals.req = req;
    next();
});
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/i/:id', routes.image);
app.get('/i', routes.listImages);
app.get('/register', auth.register);
app.get('/about', auth.about);
app.get('/mystream', routes.mystream);
app.get('/profile', user.profile);
app.get('/logout', auth.logout);

app.post('/register', auth.registerSubmit);
app.post('/login', auth.login);
app.post('/profile', user.profileUpdate);


app.get('/upload', upload.form);
app.post('/upload', upload.post);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
