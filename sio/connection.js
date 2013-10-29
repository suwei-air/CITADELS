var user = require('./user');
var room = require('./room');

// update session data
function setSession(sid, session){
  global.sessionStore.set(sid, session, function(){});
}

exports.connection = function(socket){
  var cid = socket.id;
  var session = socket.handshake.session;
  console.log('welcome ' + session.name + '[cid=' + cid + ', sid=' + socket.handshake.cookies['sid'] + ']');

  // boradcast room-list
  socket.emit('room-list', room.getList());

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
    room.add(newroom);
    socket.emit('room-list', room.getList());
  });

  socket.on('disconnect', function(){
    user.remove(socket);
    console.log('goodbye ' + session.name + '[cid=' + cid + ', sid=' + socket.handshake.cookies['sid'] + ']');
  });
};
