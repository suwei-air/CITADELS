var CARDS = require('./soliddata').CARDS;
var ROLES = require('./soliddata').ROLES;

var games = [];
var gameSeq = 0; // incresing sequence number of room id

exports.init = function(){
  games = [];
  gameSeq = 0;
};

exports.create = function(room){
  var game = new Object();
  game.id = gameSeq++;
  game.name = room.name;
  game.timeout = room.timeout;
  game.maxbuilding = room.maxbuilding;
  game.isStarted = false;
  game.players = new Array();
  var player, i;
  for (i in room.players){
    if (room.players[i] === null){
      continue;
    }
    player = new Object();
    player.name = room.players[i];
    player.isIn = false;
    player.role = null;
    player.publicRole = null;
    player.isKilled = false;
    player.isStolen = false;
    player.postActionOptions = null;
    player.cards = new Array();
    player.buildings = new Array();
    player.coins = 2;
    player.score = 0;
    game.players.push(player);
  }
  game.kingPosition = 0;
  game.onlookers = new Array();
  game.roleInAction = null;
  game.playerPosInAction = -1;
  game.period = null; // ChooseRole, PlayersRound
  game.round = null; // Pre-action, Action, Post-action
  game.rolesHidden = new Array();
  game.rolesShow = new Array();
  game.rolesToChoose = new Array();
  game.cardStack = new Array();
  game.cardDiscarded = new Array();
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
//exports.shuffle = shuffle;
function in_array(arr, e)
{
  for(i=0; i<arr.length && arr[i]!=e; i++);
  return !(i==arr.length);
}

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
        game.rolesToChoose.push(ROLES[i].name);
      }
      // shuffle the role cards
      {
        game.rolesToChoose = shuffle(game.rolesToChoose);
      } while(game.rolesToChoose[0]!='King');
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
    if (game.players[i].role == role){
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
      game.roleInAction = ROLES[i].name;
      break;
    }
  }
  game.round = 'Pre-action';
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

function nextPlayer(game){
  // find current role
  var curPos, nextPos;
  for (curPos=0; curPos<ROLES.length; ++curPos){
    if (ROLES[curPos].name==game.players[game.playerPosInAction].role){
      break;
    }
  }
  // find next role and return true, otherwise return false
  for (++curPos; curPos<ROLES.length; ++curPos){
    nextPos = getPlayerPosByRole(game, ROLES[curPos].name);
    if (nextPos !== false && game.players[nextPos].isKilled===false){
      game.playerPosInAction = i;
      game.roleInAction = ROLES[curPos].name;
      game.period = 'Pre-action';
      return true;
    }
  }
  return false;
}

function isFinished(game){
  for (i in game.players){
    if (game.players[i].buildings.length >= game.maxbuilding){
      return true;
    }
  }
  return false;
}

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
    if (game.players[i].name == username){
      player.cards = game.players[i].cards;
      player.role = game.players[i].role;
    }
    else{
      player.cards = null;
      player.role = game.players[i].publicRole;
    }
    status.players.push(player);
  }
  status.curStep = new Object();
  status.curStep.username = game.players[game.playerPosInAction].name;
  status.curStep.period = game.period;
  status.curStep.round = game.round;
  switch(game.period){
    case 'ChooseRole':
      status.curStep.rolesToChoose = game.rolesToChoose;
      status.curStep.rolesShow = game.rolesShow;
      status.curStep.rolesHiddenNum = game.rolesHidden.length;
      break;
    case 'PlayersRound':
      switch(game.round){
        case 'Pre-action':
          // add post-action options
          game.players[game.playerPosInAction].postActionOptions = new Array();
          var option = new Object();
          option.option = 'Build'; // everyone can build once
          game.players[game.playerPosInAction].postActionOptions.push(option);
          switch(game.players[game.playerPosInAction].role){
            case 'Assassin':
              option = new Object();
              option.option = 'Skill';
              option.skill = 'Kill';
              game.players[game.playerPosInAction].postActionOptions.push(option);
              break;
            case 'Thief':
              option = new Object();
              option.option = 'Skill';
              option.skill = 'Steal';
              game.players[game.playerPosInAction].postActionOptions.push(option);
              break;
            case 'Magician':
              option = new Object();
              option.option = 'Skill';
              option.skill = 'Switch-card';
              game.players[game.playerPosInAction].postActionOptions.push(option);
              break;
            case 'Architect':
              option = new Object();
              option.option = 'Build';
              game.players[game.playerPosInAction].postActionOptions.push(option);
              option = new Object();
              option.option = 'Build';
              game.players[game.playerPosInAction].postActionOptions.push(option);
              break;
            case 'Warlord':
              option = new Object();
              option.option = 'Skill';
              option.skill = 'Destroy';
              game.players[game.playerPosInAction].postActionOptions.push(option);
            case 'King':
            case 'Bishop':
            case 'Merchant':
              option = new Object();
              option.option = 'Skill';
              option.skill = 'Tax';
              game.players[game.playerPosInAction].postActionOptions.push(option);
              break;
          }
          if (in_array(game.players[game.playerPosInAction].buildings, '实验室')){
            option = new Object();
            option.option = 'Building-skill';
            option.building = '实验室';
            game.players[game.playerPosInAction].postActionOptions.push(option);
          }
          if (in_array(game.players[game.playerPosInAction].buildings, '铁匠铺')){
            option = new Object();
            option.option = 'Building-skill';
            option.building = '铁匠铺';
            game.players[game.playerPosInAction].postActionOptions.push(option);
          }
          // process stealing
          if (game.players[game.playerPosInAction].isStolen){
            var pos = getPlayerPosByRole(game, 'Thief');
            if (pos !== false){
              game.players[pos].coins += game.players[game.playerPosInAction].coins;
              game.players[game.playerPosInAction].coins = 0;
            }
          }
          game.round = 'Action';
          return getGameStatusById(gameid, username);
          break;
        case 'Action':
          // nothing to do?
          break;
        case 'Action-card':
          break;
        case 'Post-action':
          break;
      }
      break;
    case 'End':
      // TODO : calculate scores
      break;
  }
  return status;
}
exports.getGameStatusById = getGameStatusById;

function takeAction(username, gameid, action){
  var ret = new Object();
  ret.result = true;
  var game = getGameById(gameid);
  if (game.players[game.playerPosInAction].name!=username || game.period!=action.period){
    return false;
  }
  var i, j;
  switch(action.period){
    case 'ChooseRole':
      /*
      action={
      period: ChooseRole
      roleChosen: Assassin
      }
      */
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
      ret.message = game.players[game.playerPosInAction].name + ' chooses ' + game.rolesToChoose[i];
      game.rolesToChoose.splice(i, 1);
      // next one
      game.playerPosInAction = (playerPosInAction + 1) % game.players.length;
      if (game.playerPosInAction == game.kingPosition){ // finish
        endChooseRoles(game);
        beginPlayersRound(game);
      }
      break;
    case 'PlayersRound':
      switch(action.round){
        case 'Action':
        /*
          action={
          period: PlayersRound
          round: Action
          choose: Money/Card
          }
          */
          switch(action.choose){
            case 'Money':
              game.players[game.playerPosInAction].coins += 2;
              ret.message = username + ' takes 2 coins.';
              if (game.players[game.playerPosInAction].role == 'Merchant'){
                game.players[game.playerPosInAction].coins += 1;
                ret.message += username + ' takes 1 coins.';
              }
              if (game.players[game.playerPosInAction].role == 'Architect'){
                game.players[game.playerPosInAction].cards.push(game.cardStack.shift());
                game.players[game.playerPosInAction].cards.push(game.cardStack.shift());
                ret.message += username + ' takes 2 cards.';
              }
              game.round = 'Post-action';
              break;
            case 'Card':
              game.round = 'Action-card';
              ret.message = username + ' wants card(s).';
              break;
            default:
              return false;
          }
          break;
        case 'Action-card':
          /*
          action={
          period: PlayersRound
          round: Action-card
          choose: 神庙
          }
          */
          if (action.choose == game.cardStack[0]){
            game.players[game.playerPosInAction].cards.push(game.cardStack.shift());
            game.cardDiscarded.push(game.cardStack.shift());
          }
          else if (action.choose == game.cardStack[1]){
            game.cardDiscarded.push(game.cardStack.shift());            
            game.players[game.playerPosInAction].cards.push(game.cardStack.shift());
          }
          else{
            return false;
          }
          ret.message = username + ' takes 1 card.';
          if (game.players[game.playerPosInAction].role == 'Merchant'){
            game.players[game.playerPosInAction].coins += 1;
            ret.message += username + ' takes 1 coins.';
          }
          if (game.players[game.playerPosInAction].role == 'Architect'){
            game.players[game.playerPosInAction].cards.push(game.cardStack.shift());
            game.players[game.playerPosInAction].cards.push(game.cardStack.shift());
            ret.message += username + ' takes 2 cards.';
          }
          game.round = 'Post-action';
          break;
        case 'Post-action':
          /*
          action={
          period: PlayersRound
          round: Post-action
          choose: Build/Skill/Building-skill
          building: 神庙 [if choose=Build]
          skill: Kill/Steal/Switch-card/Tax/Destroy[if choose=Skill] || 
          target: role-name[if skill=Kill/Steal]/user-name[if skill=Switch-card]/{owner:username, building:神庙}[if skill=Destroy]
          }
          */
          switch(action.choose){
            case 'Build':
              // check if has card
              for (j=0; j<game.players[game.playerPosInAction].cards.length; ++j){
                if (game.players[game.playerPosInAction].cards[j] == action.building){
                  break;
                }
              }
              if (j == game.players[game.playerPosInAction].cards.length){
                return false;
              }
              // check if can build
              for (i=0; i<game.players[game.playerPosInAction].postActionOptions.length; ++i){
                if (game.players[game.playerPosInAction].postActionOptions[i].option == 'Build'){
                  break;
                }
              }
              if (i == game.players[game.playerPosInAction].postActionOptions.length){
                return false;
              }
              // build
              game.players[game.playerPosInAction].postActionOptions.shuffle(i, 1);
              game.players[game.playerPosInAction].cards.shuffle(j, 1);
              game.players[game.playerPosInAction].buildings.push(action.building);
              ret.message = username + ' builds ' + action.building + '.';
              break;
            case 'Skill':
              break;
            case 'Building-skill':
              break;
            default:
              return false;
          }
          break;
        case 'Pass':
          ret.message = username + ' pass.';
          if (!nextPlayer(game)){
            endPlayersRound(game);
            if (isFinished(game)){
              game.period = 'End';
            }
            else{
              beginChooseRoles(game);              
            }
          }
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return ret;
}
exports.takeAction = takeAction;
