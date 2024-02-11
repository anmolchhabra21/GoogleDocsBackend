import { Server, Socket } from "socket.io";
import dotenv from 'dotenv';
dotenv.config();
import Redis  from "ioredis";

const pub = new Redis(process.env.REDIS_URI);
const sub = new Redis(process.env.REDIS_URI);

// import Connection from './database/db.js'

import docController from "./controller/docController.js";
// import { updateDoc } from "./controller/docController.js";
// const PORT = 9000;

// Connection(process.env.URL);

const io = new Server(process.env.PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

sub.subscribe("MESSAGES");
sub.on("message", (channel, message)=>{
  if (channel === "MESSAGES") {
    console.log("new message from redis", message);
    const { delta, docId, senderId } = JSON.parse(message);
    io.sockets.sockets.get(senderId).broadcast.to(docId).emit("receive-changes", delta);
  }
})
io.on("connection", (socket) => {

  console.log("connected");
  socket.on("get-document", async(docId) => {
    // const document = await docController(docId)
    socket.join(docId);
    // socket.emit("load-document", document.data);
    socket.emit("load-document", "hello");
    
    socket.on("send-changes", async(delta) => {
      console.log('delta', delta, docId);
      await pub.publish('MESSAGES', JSON.stringify({delta, docId, senderId: socket.id}));
          // socket.broadcast.to(docId).emit("receive-changes", delta);
        });
        
        socket.on('save-document', async (data,name)=>{
          console.log("name coming", data);
          // await updateDoc(docId, data);
        });
      });
      
    });
    