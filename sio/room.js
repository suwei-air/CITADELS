var user = require('../utils/user');
var room = require('../utils/room');
var game = require('../utils/game');

exports.room = function(socket){
  var cid = socket.id;
  var session = socket.handshake.session;
  console.log('welcome ' + session.name + '[cid=' + cid + ', sid=' + socket.handshake.cookies['sid']
    + '] to room[' + session.roomid + '].');

  // update user-socket list
  user.putUsername(session.name, socket);

  // try to join
  room.join(session.name, session.roomid);

  // boradcast room-info
  user.foreachUserConn(room.getUsernameListByRoomid(session.roomid), function(s){
    console.log('sending room-info to ' + s);
    s.emit('room-info', room.getRoomById(session.roomid));
  });
  //socket.emit('room-info', room.getRoomById(session.roomid));

  // broadcast room-list info to others in lobby
  user.foreachUserConn(user.getUsernameList(), function(s){
    console.log('sending room-list to ' + s);
    s.emit('room-list', room.getList());
  });

  // TODO : boradcast room-info once changed [done]
  // -- someone joined this room [done]
  // -- someone in this room changed seat [done]
  // -- someone left this room [done]

  socket.on('change-seat', function(data){
    console.log('try to change seat.');
    room.changeSeat(session.name, data.pos, session.roomid);
    // boradcast room-info
    user.foreachUserConn(room.getUsernameListByRoomid(session.roomid), function(s){
      console.log('sending room-info to ' + s);
      s.emit('room-info', room.getRoomById(session.roomid));
    });
    //socket.emit('room-info', room.getRoomById(session.roomid));
  });

  socket.on('leave-room', function(data){
    room.leave(session.name, session.roomid);
    socket.emit('leave-room', {'result': true, 'message': 'OK, you\'re leaving now. See ya.'});
    // boradcast room-info
    user.foreachUserConn(room.getUsernameListByRoomid(session.roomid), function(s){
      console.log('sending room-info to ' + s);
      s.emit('room-info', room.getRoomById(session.roomid));
    });
    // broadcast room-list info to others in lobby
    user.foreachUserConn(user.getUsernameList(), function(s){
      console.log('sending room-list to ' + s);
      s.emit('room-list', room.getList());
    });
  });

  socket.on('start', function(data){
    var gameid = game.create(room.getRoomById(session.roomid));
    if (gameid === false){
      socket.emit('start', {'result': false, 'message': 'Game can\'t be started.'});
    }
    else{
      // boradcast to players in the same room
      user.foreachUserConn(room.getUsernameListByRoomid(session.roomid), function(s){
        console.log('sending \'starting game\' to ' + s);
        s.emit('start', {'result': true, 'message': 'Game #' + gameid + ' is starting...', 'gameid': gameid});
      });
    }
  });

  socket.on('disconnect', function(){
    user.remove(socket);
    console.log('goodbye ' + session.name + '[cid=' + cid + ', sid=' + socket.handshake.cookies['sid'] + ']');
  });
};
