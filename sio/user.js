exports.isUsernameValid = function isUsernameValid(username){
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
};

exports.putUsername = function putUsername(socket, username){
  var i = 0;
  for (i = 0; i<global.users.length; ++i){
    if (socket === global.users[i].connection){
      break;
    }
  }
  global.users[i] = {"username": username, "connection": socket};
};
