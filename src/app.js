
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
app.get('/room', function(req, res){
  res.render('room');
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
function isUsernameValid(username){
  var i = 0;
  for (i = 0; i<users.length; ++i){
    if (username == users[i].username){
      break;
    }
  }
  if (i != users.length){
    return false;
  }
  else{
    return true;
  }
}
function putUsername(socket, username){
  var i = 0;
  for (i = 0; i<users.length; ++i){
    if (socket === users[i].connection){
      break;
    }
  }
  users[i] = {"username": username, "connection": socket};
}
io.on('connection', function(socket){
  var cid = socket.id;
  console.log('on connection: cid=' + cid);
  socket.emit('room-list', rooms);

  // Generate username
  var usernameNum = 0;
  for (usernameNum; !isUsernameValid("玩家" + usernameNum); ++usernameNum){}
  var usernameGenerated = "玩家" + usernameNum;
  socket.emit("username", usernameGenerated);
  putUsername(socket, usernameGenerated);

  socket.on('commit-username', function(username){
    console.log(users);
    console.log("cid=" + cid + ", request username=" + username);
    if (!isUsernameValid(username)){
      socket.emit('commit-username', {
        "result": false,
        "message": "Username '" + username + "' already in use!"
      });
    }
    else{
      putUsername(socket, username);
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
    var i = 0;
    for (i = 0; i<users.length; ++i){
      if (socket === users[i].connection){
        break;
      }
    }
    users.splice(i, 1);
    console.log(users);
  });
});
