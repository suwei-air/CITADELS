
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');//, { title: '富饶之城' });
};

exports.roomlist = function(req, res){
  res.render('room-list');
};

exports.room = function(req, res){
  res.render('room');
};