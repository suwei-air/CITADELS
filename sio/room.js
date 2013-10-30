var user = require('../utils/user');
var room = require('../utils/room');

// update session data
//function setSession(sid, session){
//  global.sessionStore.set(sid, session, function(){});
//}

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
/*
  // combine the socket to the username
  user.putUsername(session.name, socket);

  socket.on('commit-username', function(username){
    console.log("cid=" + cid + ", request username=" + username);
    if (!user.isUsernameValid(username, socket)){
      socket.emit('commit-username', {
        "result": false,
        "message": "Username '" + username + "' already in use!"
      });
    }
    else{
      user.putUsername(username, socket);
      socket.emit('commit-username', {
        "result": true,
        "message": "Username '" + username + "' confirmed."
      });
      session.name = username;
      setSession(socket.handshake.cookies['sid'], session); // remember to update session
    }
  });

  socket.on('commit-newroom',function(newroom){
    if (room.add(newroom)){
      socket.emit('commit-newroom', {
        'result': true,
        'message': 'Room created.',
        'roomid': room.getIdByName(newroom.name)
      });
    }
    else{
      socket.emit('commit-newroom', { 'result': false, 'message': 'Failed creating room.' });
      socket.emit('room-list', room.getList()); // refresh room list
    }
  });
*/
  socket.on('disconnect', function(){
    user.remove(socket);
    console.log('goodbye ' + session.name + '[cid=' + cid + ', sid=' + socket.handshake.cookies['sid'] + ']');
  });
};
