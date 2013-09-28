
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var sio = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('CITADELS'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/room-list', function(req, res){
  res.render('room-list');
});
app.get('/users', user.list);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = sio.listen(server);
var users = [];
var rooms = [
  {"name": "first room", "timeout": 30, "maxbuilding":8, "players": 5, "seats": 8},
  {"name": "second room", "timeout": 15, "maxbuilding":9, "players": 3, "seats": 8}
];
io.on('connection', function(socket){
  var cid = socket.id;
  console.log('on connection: cid=' + cid);
  socket.emit('room-list', rooms);

  socket.on('commit-username', function(username){
    var i = 0;
    for (i = 0; i<users.length; ++i){
      if (username === users[i].username){
        break;
      }
    }
    if (i != users.length){
      socket.emit('commit-username', {
        "result": false,
        "message": "Username '" + username + "' already in use!"
      });
    }
    else{
      users.push({"username": username, "connection": socket});
      socket.emit('commit-username', {
        "result": true,
        "message": "Username '" + username + "' confirmed."
      });
    }
  });

  socket.on('commit-newroom',function(newroom){
    rooms.push(newroom);
    socket.emit('room-list',rooms);
  });

  socket.on('disconnect', function(){
    console.log('on disconnect: cid=' + cid);
  });
});
