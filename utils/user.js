var users = [];
exports.init = function(){
  users = [];
};

exports.getList = function(){
  return users;
};

exports.getUsernameList = function(){
  console.log('in getUsernameList, users=' + users);
  var usernames=[];
  for (i in users){
    console.log('user=' + users[i]);
    console.log('pushing ' + users[i].username);
    usernames.push(users[i].username);
  }
  console.log('getUsernameList returns ' + usernames);
  return usernames;
};

exports.foreachUserConn = function(usernames, func){
  console.log('usernames='+usernames);
  for (var i=0; i<usernames.length; ++i){
    for (var j=0; j<users.length; ++j){
      if (usernames[i] == users[j].username){
        func(users[j].connection);
        break;
      }
    }
  }
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