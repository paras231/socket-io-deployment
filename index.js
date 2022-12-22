const http = require('http');
const cors = require('cors');
const path = require("path");
const express = require('express');
const socketio = require('socket.io');
 const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
 const router = require('./router');
 const app = express();
 const server = http.createServer(app);

 // Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "server/config/config.env" });
}

 const io = socketio(server,{
  cors: {
    origin: "*",
  },
});  

app.use(cors());
app.use(router);

io.on("connection",(socket)=>{
 
  console.log(socket.id);
  socket.on('join',({name,room},callback)=>{
    const { error, user } = addUser({ id: socket.id, name, room });
    if(error) return callback(error);
    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    callback();
    console.log(name,room);
  })
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
  
    io.to(user.room).emit('message', { user: user.name, text: message });
  
    callback();
  });
  
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
  
    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
}) 



server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));