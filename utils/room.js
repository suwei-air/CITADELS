var rooms = [];
var roomSeq = 2; // incresing sequence number of room id

exports.init = function(){
  rooms = [];
};

exports.getList = function(){
  return rooms;
};

exports.add = function(newroom){
  newroom.id = roomSeq++;
  rooms.push(newroom);
  console.log('after add rooms=' + rooms);
  return true;
};

exports.getIdByName = function(name){
  var i = 0;
  for (i = 0; i<rooms.length; ++i){
    if (name == rooms[i].name){
      break;
    }
  }
  if (i != rooms.length){
    return rooms[i].id;
  }
  else{
    return -1;
  }
};

function getRoomById(roomid){
  var i = 0;
  for (i = 0; i<rooms.length; ++i){
    if (roomid == rooms[i].id){
      break;
    }
  }
  if (i != rooms.length){
    return rooms[i];
  }
  else{
    return false;
  }
}
exports.getRoomById = getRoomById;

exports.getUsernameListByRoomid = function(roomid){
  var room = getRoomById(roomid);
  if (room === false){
    return [];
  }
  var usernames=[];
  for (i in room.players){
    console.log('user=' + room.players[i]);
    if (room.players[i]){
      console.log('pushing ' + room.players[i]);
      usernames.push(room.players[i]);
    }
  }
  console.log('getUsernameListByRoomid returns ' + usernames);
  return usernames;
};

function hasSeat(username, roomid){
  var room = getRoomById(roomid);
  if (!room){
    return false;
  }
  var i = 0;
  for (i = 0; i<room.players.length; ++i){
    if (username == room.players[i]){
      break;
    }
  }
  console.log('hasSeat found i=' + i);
  return (i != room.players.length);
}
exports.hasSeat = hasSeat;

function join(username, roomid){
  if (hasSeat(username, roomid)){
    return true;
  }
  console.log('not seated.');
  // find room
  var i = 0;
  for (i = 0; i<rooms.length; ++i){
    if (roomid == rooms[i].id){
      break;
    }
  }
  if (i == rooms.length){
    return false;
  }
  console.log('room found: id=' + i);
  // room full
  if (rooms[i].playersNum == 8){
    return false;
  }
  console.log('room not full.');
  // take a seat
  for (var j = 0; j<8; ++j){
    if (rooms[i].players[j]){ // seat taken
      continue;
    }
    console.log('seat #' + j + ' is good.');
    rooms[i].players[j] = username;
    rooms[i].playersNum++;
    return true;
  }
  console.log('ah no, seat not found.');
  return false;
}
exports.join = join;

exports.changeSeat = function(username, seat, roomid){
  // find room
  var i = 0;
  for (i = 0; i<rooms.length; ++i){
    if (roomid == rooms[i].id){
      break;
    }
  }
  if (i == rooms.length){
    return false;
  }
  // room full
  if (rooms[i].playersNum == 8){
    return false;
  }
  // seat taken
  if (rooms[i].players[seat]){
    return false;
  }
  // leave orign seat
  for (var j = 0; j<8; ++j){
    if (username == rooms[i].players[j]){ // orign seat
      rooms[i].players[j] = null;
      rooms[i].playersNum--;
    }
  }
  // sit down
  rooms[i].players[seat] = username;
  rooms[i].playersNum++;
  return true;
};

exports.leave = function(username, roomid){
  // find room
  var i = 0;
  for (i = 0; i<rooms.length; ++i){
    if (roomid == rooms[i].id){
      break;
    }
  }
  if (i == rooms.length){
    return false;
  }
  // leave orign seat
  for (var j = 0; j<8; ++j){
    if (username == rooms[i].players[j]){ // orign seat
      rooms[i].players[j] = null;
      rooms[i].playersNum--;
    }
  }
  // destroy room which contains nobody
  for (i=0; i<rooms.length; ++i){ // WARN : can't replace with 'for (i in rooms)'
    console.log('in destroy loop, i=' + i + ', rooms=' + rooms);
    if (rooms[i].playersNum == 0){
      console.log('Destroy Room #' + i + '[roomid=' + rooms[i].id + '].');
      rooms.splice(i, 1);
      --i;
      console.log('after splice, i=' + i + ', rooms=' + rooms);
    }
  }
};

exports.isStarted = function(roomid){
  var room = getRoomById(roomid);
  if (typeof(room.gameid)=='undefined'){
    return false;
  }
  return room.gameid;
}