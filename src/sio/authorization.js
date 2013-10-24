exports.authorization = function(handshakeData, callback){
  // based on : http://cnodejs.org/topic/50264c5ef767cc9a511c71b1

  //没有cookie则退出
  if (!handshakeData.headers.cookie)
    return callback('socket.io: no found cookie.', false);

  //根据cookie找sessionId,https://github.com/DanielBaulig/sioe-demo/blob/master/app.js
  var signedCookies = require('express/node_modules/cookie').parse(handshakeData.headers.cookie);
  handshakeData.cookies = require('connect').utils.parseSignedCookies(signedCookies, global.SECRET);

  //根据sessionId找username
  global.sessionStore.get(handshakeData.cookies['sid'], function(err,session){
    if(err || !session) return callback('socket.io: no found session.', false);
    handshakeData.session = session;
    return callback(null, true);
/*    if(handshakeData.session.name){
      console.log('in sio, session.name=' + handshakeData.session.name);
      return callback(null, true);
    }else{
      return callback('socket.io: no found session.name', false);
    }
*/
  });
};
