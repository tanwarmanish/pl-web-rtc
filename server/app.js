import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import { initializeSocketServer } from './src/socket.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const SERVER = http.createServer(app);

initializeSocketServer(SERVER);
SERVER.listen(PORT,()=>{
    console.log(`Listening on Port: ${PORT}`);
})