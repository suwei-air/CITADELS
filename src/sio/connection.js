function isUsernameValid(username){
  var i = 0;
  for (i = 0; i<global.users.length; ++i){
    if (username == global.users[i].username){
      break;
    }
  }
  if (i != global.users.length){
    return false;
  }
  else{
    return true;
  }
}
function putUsername(socket, username){
  var i = 0;
  for (i = 0; i<global.users.length; ++i){
    if (socket === global.users[i].connection){
      break;
    }
  }
  global.users[i] = {"username": username, "connection": socket};
}

exports.connection = function(socket){
  var cid = socket.id;
  console.log('on connection: cid=' + cid);
  var session = socket.handshake.session;
  console.log('session.name=' + session.name);
  // TODO : How to change session data in socket.io???

  socket.emit('room-list', global.rooms);

  // Generate username
  var usernameNum = 0;
  for (usernameNum; !isUsernameValid("玩家" + usernameNum); ++usernameNum){}
  var usernameGenerated = "玩家" + usernameNum;
  socket.emit("username", usernameGenerated);
  putUsername(socket, usernameGenerated);

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
    console.log(global.users);
  });
};