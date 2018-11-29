'use strict';

// 채팅같은거.. 웹상에서 서로서로 바로 확인할 때
// 프로젝트의 평점이나 거절사유 보낼 때 써도됨
exports.connect = (socket) => {
  console.log('connection');

  socket.emit('asd', 'haha');
};
