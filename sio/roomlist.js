var user = require('../utils/user');
var room = require('../utils/room');

// update session data
function setSession(sid, session){
  global.sessionStore.set(sid, session, function(){});
}

exports.roomList = function(socket){
  var cid = socket.id;
  var session = socket.handshake.session;
  console.log('welcome ' + session.name + '[cid=' + cid + ', sid=' + socket.handshake.cookies['sid'] + ']');

  // boradcast room-list
  socket.emit('room-list', room.getList());

  // TODO : boradcast room-list once changed [done]
  // -- someone create a room [done]
  // -- last one leave room(room destroy) [done]
  // -- some one join a room [done]
  // -- some one back to lobby [done]

  // TODO : boradcast just to everyone in lobby, not to anyone in room/game

  // combine the socket to the username
  user.putUsername(session.name, socket);
  console.log('combine the socket to the username');

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
    }
    // broadcast to refresh room list
    user.foreachUserConn(user.getUsernameList(), function(s){
      console.log('sending room-list to ' + s);
      s.emit('room-list', room.getList());
    });
  });

  socket.on('disconnect', function(){
    user.remove(socket);
    console.log('goodbye ' + session.name + '[cid=' + cid + ', sid=' + socket.handshake.cookies['sid'] + ']');
  });
};
