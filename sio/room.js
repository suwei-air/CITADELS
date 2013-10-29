var rooms = [];

exports.init = function(){
  rooms = [
    {"name": "first room", "timeout": 30, "maxbuilding":8, "players": 5, "seats": 8},
    {"name": "second room", "timeout": 15, "maxbuilding":9, "players": 3, "seats": 8}
  ];
};

exports.getList = function(){
  return rooms;
};
