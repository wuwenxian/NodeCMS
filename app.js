
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');
var db = require('./models/db_mongoose.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
// app.use(express.cookieParser());
app.use(express.cookieParser('some secret'));
app.use(express.session({
		secret : settings.cookieSecret,
		key : settings.db,
		cookie : {
			maxAge : 1000 * 60 * 60 * 24 * 30
		},
		store : new MongoStore({
			db : settings.db
		})
	}));

// app.param('user', function (req, res, next, id) {
// req.user = id;
// next();
// });

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// app.get('/', routes.index);
// app.get('/users', user.list);

db.connect(function (err) {
	if (err)
		throw err;
});

app.on('close', function (err) {
	db.disconnect(function (err) {});
});

http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});

routes(app);
