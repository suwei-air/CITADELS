var users = [];
exports.init = function(){
  users = [];
};

exports.getList = function(){
  return users;
};

exports.isUsernameValid = function(username, socket){
  var i = 0;
  for (i = 0; i<users.length; ++i){
    if (username == users[i].username){
      break;
    }
  }
  if (i != users.length && users[i].connection != socket){
    return false;
  }
  else{
    return true;
  }
};

exports.putUsername = function(username, socket){
  var i = 0;
  for (i = 0; i<users.length; ++i){
    if (socket === users[i].connection){
      break;
    }
  }
  users[i] = {"username": username, "connection": socket};
};

exports.remove = function(socket){
  var i = 0;
  for (i = 0; i<users.length; ++i){
    if (socket === users[i].connection){
      break;
    }
  }
  users.splice(i, 1);
};