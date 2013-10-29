var isUsernameValid = require('../sio/user').isUsernameValid;

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
  res.render('room');
};
