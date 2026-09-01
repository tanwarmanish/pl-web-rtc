import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import * as State from './src/state.js';
import { initializeSocketServer } from './src/socket.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const SERVER = http.createServer(app);

// app.get('/create/:uid',(req,res)=>{
//     const params = req.params;
//     let uid = +params.uid;
//     if(uid<1000 || uid>=10000) return res.error('Error...');
//     const roomID = State.generateRoomId();
//     res.send(roomID);
// })


initializeSocketServer(SERVER);
SERVER.listen(PORT,()=>{
    console.log(`Listening on Port: ${PORT}`);
})