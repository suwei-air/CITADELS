var User = require('../utils/user');
var Room = require('../utils/room');
var Game = require('../utils/game');
var SolidData = require('../utils/soliddata');

exports.game = function(socket){
  var cid = socket.id;
  var session = socket.handshake.session;
  console.log('welcome ' + session.name + '[cid=' + cid + ', sid=' + socket.handshake.cookies['sid']
    + '] to game[' + session.gameid + '].');

  // update user-socket list
  User.putUsername(session.name, socket);

  // try to join(or watch)
  Game.join(session.name, session.gameid);

  // boradcast game-info
  User.foreachUserConn(Game.getUsernameListByGameid(session.gameid), function(s){
    s.emit('message', { 'sender': 'System', 'message': session.name + ' joined/watching this game.' });
    s.emit('game-info', Game.getGameStatusById(session.gameid, session.name));
  });

  if ((!Game.isStarted(session.gameid)) && Game.isAllOnSpot(session.gameid)){
    Game.start(session.gameid);
    User.foreachUserConn(Game.getUsernameListByGameid(session.game), function(s){
      s.emit('game-info', Game.getGameStatusById(session.gameid, session.name));
    });
  }

  socket.on('take-action', function(action){
    console.log('try to change seat.');
    var actionResult = Game.takeAction(session.name, session.gameid, action);
    if (actionResult === false){
      socket.emit('take-action', { 'result': false, 'message': 'You cannot take this action!' });
    }
    else{
      User.foreachUserConn(Game.getUsernameListByGameid(session.gameid), function(s){
        s.emit('take-action', actionResult);
        s.emit('game-info', Game.getGameStatusById(session.gameid, session.name));
      });
    }
  });

  socket.on('disconnect', function(){
    User.remove(socket);
    console.log('goodbye ' + session.name + '[cid=' + cid + ', sid=' + socket.handshake.cookies['sid'] + ']');
  });
};
