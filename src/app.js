var express = require('express');
var http = require('http');
var path = require('path');
var sio = require('socket.io');
var routes = require('./routes');
var user = require('./routes/user');
var sioConnection = require('./sio/connection').connection;
var sioAuthorization = require('./sio/authorization').authorization;

global.sessionStore = new express.session.MemoryStore({reapInterval: 60000 * 10});
global.SECRET = 'CITADELS';

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  store: global.sessionStore,
  key: 'sid',
  secret: global.SECRET
}));
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/room-list', routes.roomlist);
app.get('/room', routes.room);
app.get('/users', user.list);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = sio.listen(server);
global.users = [];
global.rooms = [
  {"name": "first room", "timeout": 30, "maxbuilding":8, "players": 5, "seats": 8},
  {"name": "second room", "timeout": 15, "maxbuilding":9, "players": 3, "seats": 8}
];

io.set('authorization', sioAuthorization);
io.on('connection', sioConnection);
