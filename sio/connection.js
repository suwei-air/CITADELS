var isUsernameValid = require('./user').isUsernameValid,
  putUsername = require('./user').putUsername;

// update session data
function setSession(sid, session){
  global.sessionStore.set(sid, session, function(){});
}

exports.connection = function(socket){
  var cid = socket.id;
  var session = socket.handshake.session;
  console.log('welcome ' + session.name + '[cid=' + cid + ', sid=' + socket.handshake.cookies['sid'] + ']');
  //console.log(global.users);

  // boradcast room-list
  socket.emit('room-list', global.rooms);

  // combine the socket to the username
  putUsername(socket, session.name);

  socket.on('commit-username', function(username){
    console.log(global.users);
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
      session.name = username;
      setSession(socket.handshake.cookies['sid'], session); // remember to update session
    }
  });

  socket.on('commit-newroom',function(newroom){
    rooms.push(newroom);
    socket.emit('room-list', global.rooms);
  });

  socket.on('disconnect', function(){
    console.log('on disconnect: cid=' + cid);
    var i = 0;
    for (i = 0; i<global.users.length; ++i){
      if (socket === global.users[i].connection){
        break;
      }
    }
    global.users.splice(i, 1);
    console.log('goodbye ' + session.name + '[cid=' + cid + ', sid=' + socket.handshake.cookies['sid'] + ']');
    //console.log(global.users);
  });
};
