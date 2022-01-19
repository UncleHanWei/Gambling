const { Server } = require('socket.io');
const io = new Server();
const socketConfig = {
  io: io
};

let admin_id;
io.on("connection", (socket) => {
  console.log('socket connected successfully');

  socket.on('start', (arg) => {
    admin_id = socket.id;
    io.emit('start', { game_id: arg['game_id'] });
  })
  
  socket.on('stake', (arg) => {
    let user = arg['user'];
    let stake = arg['stake'];
    let num = arg['num'];
    io.to(admin_id).emit('stake', { user: user, stake: stake, num: num });
  })
  
  socket.on('draw', (arg) => {
    io.emit('draw', { game_id: arg['game_id'], num: arg['num']});
  })

})

module.exports = socketConfig;
