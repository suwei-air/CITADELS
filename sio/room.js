var user = require('../utils/user');
var room = require('../utils/room');
var game = require('../utils/game');

exports.room = function(socket){
  var cid = socket.id;
  var session = socket.handshake.session;
  console.log('welcome ' + session.name + '[cid=' + cid + ', sid=' + socket.handshake.cookies['sid']
    + '] to room[' + session.roomid + '].');

  // try to join
  room.join(session.name, session.roomid);

  // boradcast room-info
  socket.emit('room-info', room.getRoomById(session.roomid));

  // TODO : boradcast room-info once changed

  socket.on('change-seat', function(data){
    console.log('try to change seat.');
    room.changeSeat(session.name, data.pos, session.roomid);
    socket.emit('room-info', room.getRoomById(session.roomid));
  });

  socket.on('leave-room', function(data){
    room.leave(session.name, session.roomid);
    socket.emit('leave-room', {'result': true, 'message': 'OK, you\'re leaving now. See ya.'})
  });

  socket.on('start', function(data){
    // TODO : boradcast to players in the same room
    var gameid = game.create(room.getRoomById(session.roomid));
    if (gameid === false){
      socket.emit('start', {'result': false, 'message': 'Game can\'t be started.'});
    }
    else{
      socket.emit('start', {'result': true, 'message': 'Game #' + gameid + ' is starting...', 'gameid': gameid});
    }
  });

  socket.on('disconnect', function(){
    user.remove(socket);
    console.log('goodbye ' + session.name + '[cid=' + cid + ', sid=' + socket.handshake.cookies['sid'] + ']');
  });
};
