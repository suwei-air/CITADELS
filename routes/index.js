var isUsernameValid = require('../utils/user').isUsernameValid;

exports.index = function(req, res){
  res.render('index');//, { title: '富饶之城' });
};

exports.roomlist = function(req, res){
  if (typeof(req.session.name)=='undefined'){
    // Generate username
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
