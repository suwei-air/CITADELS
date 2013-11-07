var isUsernameValid = require('../utils/user').isUsernameValid;
var Room = require('../utils/room');

exports.index = function(req, res){
  res.render('index');//, { title: '富饶之城' });
};

exports.roomlist = function(req, res){
  if (typeof(req.session.name)=='undefined'){
    // Generate username
    // TODO : if someone redirect to other page (or close window for a while),
    //        at the same time, somebody else entered the lobby and get the same username,
    //        there will be more than one user has the same username !!
    //        Maybe checking username in session database is a good idea.
    var usernameNum = 0;
    for (usernameNum; !isUsernameValid("玩家" + usernameNum, null); ++usernameNum){}
    req.session.name = '玩家' + usernameNum;
  }
  res.render('room-list', { username: req.session.name });
};

exports.room = function(req, res){
  if (typeof(req.session.name)=='undefined'){
    res.redirect('room-list');
  }
  console.log('Enter room[id=' + req.query.id + '].');
  if (Room.isStarted(req.query.id) !== false){
    res.redirect('game?id=' + Room.isStarted(req.query.id));
  }
  req.session.roomid=req.query.id;
  res.render('room');
};

exports.game = function(req, res){
  if (typeof(req.session.name)=='undefined'){
    res.redirect('room-list');
  }
  console.log('Somebody named \'' + req.session.name + '\' join Game #' + req.query.id + '.');
  req.session.gameid = req.query.id;
  res.render('game');  
};
