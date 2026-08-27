import { WebSocketServer } from 'ws';
export let wss = null;
const connections = new Map();

export function initWSS(server){
    wss = new WebSocketServer({server});
    return wss;
}

wss.on('connection',handleConnection);



function handleConnection(ws,req){
    const userId = req.extractQueryParam(req,'userId');
    addConnection(userId);
    ws.on('message',(message)=>handlePeerMessage(userId,message));
    ws.on('close',()=>handlePeerDisconnect(userId));
    ws.on('error',()=>console.log("Something went wrong..."));
}

function handlePeerMessage(userId,message){
    console.log(`${userId} says: ${message}`);
}

function handlePeerDisconnect(userId){
    removeConnection(userId);
    console.log(`${userId} disconnected`);
}

function addConnection(ws,userId){
    if(!connections.has(userId)){
        connections.set(userId,ws);
    }
    activeUsers();
}

function removeConnection(ws,userId){
    if(connections.has(userId)){
        connections.delete(userId);
    }
    activeUsers();
}

function activeUsers(){
    const count = this.connections.size;
    console.log(`${count} active users.`);
}

function extractQueryParam(req, query) {
    const queryParams = new URLSearchParams(req.url.split("?")[1]);
    return queryParams.get(query);
}