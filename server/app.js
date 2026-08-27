import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import express from 'express';
import { initWSS } from './src/wss.js';

const app = express();
app.use(express.static('client'))
app.get('/', (req, res) => {
    const ROOT = process.cwd();
    const INDEX_PATH = `${ROOT}/client/index.html`;
    res.sendFile(INDEX_PATH);
});



const server = http.createServer(app);
initWSS(server);

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server listening on PORT:${PORT}`);
})