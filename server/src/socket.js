import { Connections, updateConnection, joinRoom, generateRoomId, isRoomValid, send, forward,broadcast } from './state.js';
import { WebSocketServer } from 'ws';
import { extractQueryParam, toObj, toStr } from './utils.js';

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

    ws.on('close',()=>closeConnection(ws,roomId))
}

function closeConnection(ws,roomId) {
    ws.close();
    Connections.delete(roomId);
}