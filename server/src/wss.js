import { WebSocketServer } from 'ws';
export let wss = null;
const connections = new Map();
const rooms = new Map();

export function initWSS(server){
    wss = new WebSocketServer({server});
    wss.on('connection',handleConnection);
    return wss;
}


function handleConnection(ws,req){
    const params = extractQueryParam(req,['id','name']);
    addConnection(params,ws);
    ws.on('message',(message)=>handlePeerMessage(params,message));
    ws.on('close',()=>handlePeerDisconnect(params));
    ws.on('error',()=>console.log("Something went wrong..."));
}

function handlePeerMessage({id},message){
    message = JSON.parse(message);
    switch(message.type){
        case 'offer':{
            const payload = {
                type:'offer',
                data:{
                    ...message.data,
                    senderId:id
                }
            };
            sendToUser(message.data.userId,payload);
            console.log("Offer communicated");
            break;
        }
        case 'answer':{
            sendToUser(message.data.userId,message);
            console.log("Answer communicated");
            break;
        }
        case 'candidates':{
            sendToUser(message.data.userId,message);
            console.log("HERE");
            break;
        }
    }
}

function handlePeerDisconnect(params){
    removeConnection(params.id);
    removeFromRoom(params);
    console.log(`${params.name} disconnected`);
}

function addConnection(params,ws) {
    if (!connections.has(params.id)) {
        connections.set(params.id, { ...params,ws });
        console.log(`${params.name} connected`);
        addToRoom(params);
    }
    activeUsers();
}

function removeConnection(id){
    if(connections.has(id)){
        connections.delete(id);
    }
    activeUsers();
}

function addToRoom(params){
    if (rooms.has(params.roomId)) {
        let users = rooms.get(params.roomId) || [];
        users.push(params.id);
        rooms.set(params.id,users);
        sendToUser(params.id,{...connections.get(users[0]),type:'joined'});
        sendToUser(users[0],{...params,type:'joined'});
    }
    else {
        rooms.set(params.roomId, [params.id]);
    }
    console.log(`Room:${params.roomId}, Users: ${rooms.get(params.roomId)}`);
}

function removeFromRoom(params) {
    if (rooms.has(params.roomId)) {
        let users = rooms.get(params.roomId);
        users = users.filter(userId => userId != params.id);
        if (users.length == 0) {
            rooms.delete(params.roomId);
        }
        else{
            rooms.set(params.roomId,users);
        }
    }
    console.log(`Room:${params.roomId}, Users: ${rooms.get(params.roomId) || 'removed'}`);
}

function activeUsers(){
    const count = connections.size;
    console.log(`${count} active users.`);
}

function extractQueryParam(req, query) {
    const queryParams = new URLSearchParams(req.url.split("?")[1]);
    return queryParams.entries().reduce((agg,kv)=>({...agg,[kv[0]]:kv[1]}),{});
}

function sendToUser(userId,message){
    if(!connections.has(userId)) return;
    const {ws} = connections.get(userId);
    ws.send(JSON.stringify(message));
}