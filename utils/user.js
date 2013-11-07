var users = [];
exports.init = function(){
  users = [];
};

exports.getList = function(){
  return users;
};

exports.getUsernameList = function(){
  var usernames=[];
  for (i in users){
    console.log('pushing ' + users[i].username);
    usernames.push(users[i].username);
  }
  console.log('getUsernameList returns ' + usernames);
  return usernames;
};

exports.foreachUserConn = function(usernames, func){
  console.log('usernames='+usernames);
  for (var i in usernames){
    for (var j in users){
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
  // WARN : YOU CAN'T REPLACE THIS WITH 'for (i in users)' !!!
  //        BECAUSE ENVN IF NO MATCH USERNAME FOUND, i WOULD NEVER REATCH users.length !!!
  //        SO, you can only replace 'for (i=0;i<users.length;++i)' with 'for (i in users)'
  //        if you don't rely on final value of 'i' to determine any match found or not.
    if (username == users[i].username){
      break;
    }
  }
  if (i != users.length && users[i].connection != socket){
    console.log(username + ' is invalid!');
    return false;
  }
  else{
    console.log(username + ' is valid.');
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
  // assume there must be a match result
  for (i in users){
    if (socket === users[i].connection){
      break;
    }
  }
  users.splice(i, 1);
};