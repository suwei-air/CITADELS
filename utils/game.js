var games = [];
var gameSeq = 1; // incresing sequence number of room id

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
      'kingPosition': 0,
      'onlookers': [],
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
  var game = new Object();
  game.id = gameSeq++;
  game.name = room.name;
  game.timeout = room.timeout;
  game.maxbuilding = room.maxbuilding;
  game.players = new Array();
  var player, i;
  for (i in room.players){
    if (room.players[i] === null){
      continue;
    }
    player = new Object();
    player.name = room.players[i];
    player.role = null;
    player.isKilled = false;
    player.isRobbed = false;
    player.isTaxed = true;
    player.cards = new Array();
    player.buildings = new Array();
    player.coins = 2;
    game.players.push(player);
  }
  game.kingPosition = 0;
  game.onlookers = new Array();
  game.roleInAction = null;
  game.period = null;
  game.rolesHidden = new Array();
  game.rolesShow = new Array();
  game.rolesToChoose = new Array();
  game.cardStack = new Array();
  game.cardDiscarded = new Array();
  game.isStarted = false;
  games.push(game);
  return game.id;
};

function shuffle(arr){
  var ret = [];
  var pos;
  while (arr.length > 0){
    pos = round(random()*arr.length);
    ret.push(arr[pos]);
    arr.splice(pos, 1);
  }
  return ret;
}
exports.shuffle = shuffle;

function getGameById(gameid){
  var i = 0;
  for (i = 0; i<games.length; ++i){
    if (gameid == games[i].id){
      break;
    }
  }
  if (i != games.length){
    return games[i];
  }
  else{
    return false;
  }
}
exports.getGameById = getGameById;

exports.getUsernameListByGameid = function(gameid){
  var usernames=[];
  var game = getGameById(gameid);
  if (game !== false){
    for (i in game.players){
      console.log('pushing ' + game.players[i].name);
      usernames.push(game.players[i].name);
    }
    for (i in game.onlookers){
      console.log('pushing ' + game.players[i].name);
      usernames.push(game.onlookers[i]);
    }
  }
  console.log('getUsernameListByGameid returns ' + usernames);
  return usernames;
};

exports.join = function(username, gameid){
  var game = getGameById(gameid);
  if (game !== false){
    for (i in game.players){
      if (game.players[i].name == username){
        console.log(username + ' is a player in Game #' + gameid);
        return true;
      }
    }
    console.log(username + ' is a onlooker in Game #' + gameid);
    return true;
  }
  return false;
};

function start(gameid){
  var game = getGameById(roomid);
  game.kingPosition = round(random()*game.players.length);
  game.isStarted = true;
}
exports.start = start;

function isStarted(gameid){
  return getGameById(gameid).isStarted;
}
exports.isStarted = isStarted;

function isAllOnSpot(gameid){
  
}
exports.isAllOnSpot = isAllOnSpot;

function getGameStatusById(gameid){

}
exports.getGameStatusById = getGameStatusById;

function takeAction(username, gameid, action){
  var ret = new Object();
  ret.result = true;
  ret.message = '';
  ret.lastStep = new Object();
  ret.nextStep = new Object();
}
exports.takeAction = takeAction;
