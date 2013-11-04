var games = [];
var gameSeq = 0; // incresing sequence number of room id

exports.init = function(){
  games = [
    {
      'id': 0,
      'name': 'first room',
      'timeout': 30,
      'maxbuilding':8,
      'players': [
        {
          'name': 'a',
          'role': 'king',
          'isKilled': false,
          'cards': [],
          'buildings': [],
          'coins': 4
        }
      ],
      'roleInAction': 'Thief',
      'period': 'MoneyOrCard',
      'rolesHidden': [],
      'rolesShow': [],
      'rolesToChoose': [],
      'cardStack': [],
      'cardDiscarded': []
    }
  ];
};

exports.create = function(room){
  return 0;
};
