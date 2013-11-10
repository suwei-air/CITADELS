var CARDS = require('./soliddata').CARDS;
var ROLES = require('./soliddata').ROLES;

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
          'isIn': false,
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
    player.publicRole = null;
    player.isIn = false;
    player.isKilled = false;
    player.isRobbed = false;
    player.isTaxed = false;
    player.cards = new Array();
    player.buildings = new Array();
    player.coins = 2;
    game.players.push(player);
  }
  game.kingPosition = 0;
  game.onlookers = new Array();
  game.roleInAction = null;
  game.playerPosInAction = -1;
  game.period = null; // ChooseRole, PlayersRound
  game.round = null; // TODO : ...
  game.rolesHidden = new Array();
  game.rolesShow = new Array();
  game.rolesToChoose = new Array();
  game.cardStack = new Array();
  game.cardDiscarded = new Array();
  game.isStarted = false;
  games.push(game);
  room.gameid = game.id;
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
        game.players[i].isIn = true;
        return true;
      }
    }
    console.log(username + ' is a onlooker in Game #' + gameid);
    game.onlookers.push(username);
    return true;
  }
  return false;
};

function beginChooseRoles(game){
  game.period = 'ChooseRole';
  game.playerPosInAction = game.kingPosition;
  game.rolesToChoose = new Array();
  game.rolesShow = new Array();
  game.rolesHidden = new Array();
  switch(game.players.length){
    case 3:
      break;
    case 4:
      // add all the role cards to rolesToChoose
      for (var i=0; i<8; ++i){
        game.rolesToChoose.push(ROLES[i]);
      }
      // shuffle the role cards
      {
        game.rolesToChoose = shuffle(game.rolesToChoose);
      } while(game.rolesToChoose[0].name!='King');
      // 1 up and 1 down
      game.rolesShow.push(game.rolesToChoose.shift());
      game.rolesHidden.push(game.rolesToChoose.shift());
      break;
    case 5:
      break;
    case 6:
      break;
    case 7:
      break;
  }
}
function endChooseRoles(game){
  switch(game.players.length){
    case 3:
      break;
    case 4:
      // 1 up and 1 down
      game.rolesShow.push(game.rolesToChoose.shift());
      game.rolesHidden.push(game.rolesToChoose.shift());
      break;
    case 5:
      break;
    case 6:
      break;
    case 7:
      break;
  }
}

function getPlayerPosByRole(game, role){
  var i;
  for (i=0; i<game.players.length; ++i){
    if (game.players[i].role.name == 'role'){
      break;
    }
  }
  if (i == game.players.length){
    return false;
  }
  return i;
}

function beginPlayersRound(game){
  game.period = 'PlayersRound';
  var i, pos;
  for (i in ROLES){
    pos = getPlayerPosByRole(game, ROLES[i].name);
    if (pos !== false){
      game.playerPosInAction = pos;
      break;
    }
  }
  game.round = 'Begin'; // TODO
}
function endPlayersRound(game){
  var pos = getPlayerPosByRole(game, 'King');
  if (pos !== false){
    game.kingPosition = pos;
  }
}

function start(gameid){
  var game = getGameById(gameid);
  game.kingPosition = round(random()*game.players.length);
  game.isStarted = true;
  // add and shuffle cards
  var i, j;
  for (i in CARDS){
    for (j = 0; j<CARDS[i].number; ++j){
      game.cardStack.push(CARDS[i]);
    }
  }
  game.cardStack = shuffle(game.cardStack);
  // give everyone 4 cards
  for (i in game.players){
    for (j = 0; j<4; ++j){
      game.players[i].cards.push(game.cardStack.shift());
    }
  }
  // start the first step
  beginChooseRoles(game);
}
exports.start = start;

function isStarted(gameid){
  return getGameById(gameid).isStarted;
}
exports.isStarted = isStarted;

function isAllOnSpot(gameid){
  var game = getGameById(gameid);
  for (i in game.players){
    if (game.players[i].isIn === false){
      console.log(game.players[i].name + ' is absent.');
      return false;
    }
  }
  return true;
}
exports.isAllOnSpot = isAllOnSpot;

function getGameStatusById(gameid, username){
  var game = getGameById(gameid);
  var status = new Object();
  status.players = new Array();
  var player;
  for (i in game.players){
    player = new Object();
    player.name = game.players[i].name;
    player.coins = game.players[i].coins;
    player.buildings = game.players[i].buildings;
    player.cardNum = game.players[i].cards.length;
    // TODO : show everyone's cards only for debug
    //if (game.players[i].name == username){
      player.cards = game.players[i].cards;
      player.role = game.players[i].role;
    //}
    //else{
    //  player.cards = null;
    //  player.role = game.players[i].publicRole;
    //}
    status.players.push(player);
  }
  status.curStep = new Object();
  status.curStep.username = game.players[game.playerPosInAction].name;
  status.curStep.period = game.period;
  switch(game.period){
    case 'ChooseRole':
      status.curStep.rolesToChoose = game.rolesToChoose;
      status.curStep.rolesShow = game.rolesShow;
      status.curStep.rolesHiddenNum = game.rolesHidden.length;
      break;
    case 'PlayersRound':
      // TODO
      break;
  }
  return status;
}
exports.getGameStatusById = getGameStatusById;

function takeAction(username, gameid, action){
  /*
  action={
  period: ChooseRole
  roleChosen: Assassin
  }
  */
  var game = getGameById(gameid);
  if (game.players[game.playerPosInAction].name!=username || game.period!=action.period){
    return false;
  }
  var i, j;
  switch(action.period){
    case 'ChooseRole':
      for (i=0; i<game.rolesToChoose.length; ++i){
        if (game.rolesToChoose[i].name == action.roleChosen){
          break;
        }
      }
      if (i==game.rolesToChoose.length){ // not valid
        return false;
      }
      // choose
      game.players[game.playerPosInAction].role = game.rolesToChoose[i];
      game.rolesToChoose.splice(i, 1);
      // next one
      game.playerPosInAction = (playerPosInAction + 1) % game.players.length;
      if (game.playerPosInAction == game.kingPosition){ // finish
        endChooseRoles(game);
        // TODO : beginPlayersRound(game);
      }
      break;
  }
}
exports.takeAction = takeAction;
