var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var WebSocketServer = require('websocket').server;
var business = require('./business');

var users = require('./routes/users');

var app = express();
var routes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

//error handlers
app.use(function(err, req, res, next) {
	console.error(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

// server
var server = app.listen(3000, function () {
	  var host = server.address().address;
	  var port = server.address().port;
	  console.log('app listening at http://%s:%s', host, port);
});

// websocket
var wsServer = new WebSocketServer({
    httpServer: server,    
    autoAcceptConnections: false
});
wsServer.on('request', function(request) {
	try{
		business.broadcaster.register(request.accept(null, request.origin));
		console.log((new Date()) + ' Connection accepted.');
	}catch(e){
		console.error(e.stack);
	}	
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
