
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: '富饶之城' });
};