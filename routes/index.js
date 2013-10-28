
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');//, { title: '富饶之城' });
};

exports.roomlist = function(req, res){
  req.session.name = 'JUSTaNAME';
  console.log('in express, session.name=' + req.session.name);
  res.render('room-list');
};

exports.room = function(req, res){
  res.render('room');
};