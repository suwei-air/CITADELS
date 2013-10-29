var rooms = [];
var roomSeq = 2; // incresing sequence number of room id

exports.init = function(){
  rooms = [
    {'id': 0, "name": "first room", "timeout": 30, "maxbuilding":8, "players": 5, "seats": 8},
    {'id': 1, "name": "second room", "timeout": 15, "maxbuilding":9, "players": 3, "seats": 8}
  ];
};

exports.getList = function(){
  return rooms;
};

exports.add = function(newroom){
  newroom.id = roomSeq++;
  rooms.push(newroom);
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
