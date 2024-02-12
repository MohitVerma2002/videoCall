const { Server } = require("socket.io");
const io = new Server(8000, {
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connnected`, socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);

    io.to(room).emit("user:joined", { email, id: socket.id });

    socket.join(room);

    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call",({to , offer})=>{
    io.to(to).emit('incomming:call',{from:socket.id, offer});
  })

  socket.on("call:accepted",({to,ans})=>{
    io.to(to).emit('call:accepted',{from:socket.id, ans});
  })

  socket.on("peer:nego:needed",({to,offer})=>{
    io.to(to).emit('peer:nego:needed',{from:socket.id, offer});
  })

  socket.on("peer:nego:done",({to,ans})=>{
    io.to(to).emit('peer:nego:final',{from:socket.id, ans });
  })
});

// const express = require("express");
// const bodyParser = require("body-parser");
// const {Server} = require("socket.io");

// const io = new Server();
// const app =express();

// app.use(bodyParser.json());

// const emailToSocketMapping = new Map();

// io.on('connection',(socket) =>{
//     socket.on('joinRoom',(data)=>{
//         const {roomId , emailId} = data;
//         console.log('User', emailId, 'Joined Room' , roomId);
//         emailToSocketMapping.set(emailId, socket.id)
//         socket.join(roomId);
//         socket.broadcast.to(roomId).emit('userJoined',{emailId});
//     });
// })

// app.listen(8000,()=> console.log("HTTP server running at PORT 8000"));
// io.listen(8001);
