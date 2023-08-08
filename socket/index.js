import { Server } from "socket.io";

const io = new Server({ 
    cors: {
        origin:'http://localhost:3000'
    }
});
  let onlineUsers = [];
  const addUser = (username,socketId) => {
    !onlineUsers.some((user) => user.username === username) && 
    onlineUsers.push ({username,socketId})
  }
  const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  }
  const getUser = (username) => {
    return onlineUsers.find((user) => user.username === username);
  }
io.on("connection", (socket) => {
  // io.emit('firstEvent','hello this test!!');
  socket.on('newUser',(username) => {
    addUser(username,socket.id)
  })
  socket.on('sendNotification',({sendName,reciverName,type}) => {
    const recive = getUser(reciverName);
    io.to(recive.socketId).emit('getNotification', {
      sendName,
      type
    });
  })
  socket.on('disconnect', () => {
   removeUser(socket.id);
  })
});

io.listen(5000);