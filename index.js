import { Server, Socket } from "socket.io";
import dotenv from 'dotenv';
dotenv.config();

import Connection from './database/db.js'

import docController from "./controller/docController.js";
import { updateDoc } from "./controller/docController.js";
// const PORT = 9000;

Connection(process.env.URL);

const io = new Server(process.env.PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async(docId) => {
    const document = await docController(docId)
    socket.join(docId);
    socket.emit("load-document", document.data);
    
    socket.on("send-changes", (delta) => {
      // console.log('delta', delta);
      socket.broadcast.to(docId).emit("receive-changes", delta);
    });
    
    socket.on('save-document', async (data,name)=>{
      console.log("name coming");
      await updateDoc(docId, data);
    });
  });
  socket.on('anmol',(name)=>{
    console.log('name is '+name);
  })
});
