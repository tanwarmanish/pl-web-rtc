import { Connections, updateConnection, joinRoom, generateRoomId, isRoomValid, send, forward,broadcast } from './state.js';
import { WebSocketServer } from 'ws';
import { extractQueryParam, toObj, toStr } from './utils.js';
import { SENDER_SOCKET, RECEIVER_SOCKET, TYPE, SENDER, RECEIVER } from './const.js';

let WSS = null;

export function initializeSocketServer(server) {
    WSS = new WebSocketServer({ server });
    WSS.on('connection', handleConnection);
    return WSS;
}

function handleConnection(ws, req) {
    const { id, key } = extractQueryParam(req);
    let roomId = key;
    if (id && key) {
        const isValid = isRoomValid(roomId);
        if (!isValid) return closeConnection(ws);
        send(ws, 'WS:CONNECTED', { roomId });
        joinRoom(roomId,id,ws);
        broadcast(roomId,'RTC:PeerJoined',null);
    }
    else if (id) {
        roomId = generateRoomId(id, ws);
        if (!roomId) return closeConnection(ws);
        send(ws, 'WS:CONNECTED', { roomId });
    }
    else {
        closeConnection(ws);
    }

    ws.on('message', (message) => {
        const {type,data} = toObj(message);
        forward(data.roomId,data.id,type,data);
    });
    
    ws.on('close', () => {
        console.log("Connection closed");
    })
}

function closeConnection(ws) {
    console.log("CLOSED CONNECTION");
}

// function handlePeerMessage({id},message){
//     message = JSON.parse(message);
//     switch(message.type){
//         case 'offer':{
//             const payload = {
//                 type:'offer',
//                 data:{
//                     ...message.data,
//                     senderId:id
//                 }
//             };
//             sendToUser(message.data.userId,payload);
//             console.log("Offer communicated");
//             break;
//         }
//         case 'answer':{
//             sendToUser(message.data.userId,message);
//             console.log("Answer communicated");
//             break;
//         }
//         case 'candidates':{
//             sendToUser(message.data.userId,message);
//             console.log("HERE");
//             break;
//         }
//     }
// }

// function handlePeerDisconnect(params){
//     removeConnection(params.id);
//     removeFromRoom(params);
//     console.log(`${params.name} disconnected`);
// }

// function addConnection(params,ws) {
//     if (!connections.has(params.id)) {
//         connections.set(params.id, { ...params,ws });
//         console.log(`${params.name} connected`);
//         addToRoom(params);
//     }
//     activeUsers();
// }

// function removeConnection(id){
//     if(connections.has(id)){
//         connections.delete(id);
//     }
//     activeUsers();
// }

// function addToRoom(params){
//     if (rooms.has(params.roomId)) {
//         let users = rooms.get(params.roomId) || [];
//         users.push(params.id);
//         rooms.set(params.id,users);
//         sendToUser(params.id,{...connections.get(users[0]),type:'joined'});
//         sendToUser(users[0],{...params,type:'joined'});
//     }
//     else {
//         rooms.set(params.roomId, [params.id]);
//     }
//     console.log(`Room:${params.roomId}, Users: ${rooms.get(params.roomId)}`);
// }

// function removeFromRoom(params) {
//     if (rooms.has(params.roomId)) {
//         let users = rooms.get(params.roomId);
//         users = users.filter(userId => userId != params.id);
//         if (users.length == 0) {
//             rooms.delete(params.roomId);
//         }
//         else{
//             rooms.set(params.roomId,users);
//         }
//     }
//     console.log(`Room:${params.roomId}, Users: ${rooms.get(params.roomId) || 'removed'}`);
// }

// function activeUsers(){
//     const count = connections.size;
//     console.log(`${count} active users.`);
// }

// function sendToUser(userId,message){
//     if(!connections.has(userId)) return;
//     const {ws} = connections.get(userId);
//     ws.send(JSON.stringify(message));
// }