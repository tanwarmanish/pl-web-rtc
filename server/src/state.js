import { SENDER, RECEIVER, SENDER_SOCKET, RECEIVER_SOCKET } from './const.js';
import { toStr, toObj, copy } from './utils.js';

export const Connections = new Map();

export function generateRoomId(uid, ws, length = 6, level = 10) {
    if (level <= 0) return null;
    let multiplier = Math.pow(10, length - 1);
    let id = Math.floor(multiplier + Math.random() * 9 * multiplier);
    if (Connections.has(id))
        return generateRoomId(uid, ws, length, level - 1);
    let connection = nullConnection();
    updateConnection(id, { ...connection, [SENDER]: uid, [SENDER_SOCKET]: ws });
    return id;
}

export function nullConnection(config = {}) {
    return {
        [SENDER]: null,
        [RECEIVER]: null,
        [SENDER_SOCKET]: null,
        [RECEIVER_SOCKET]: null,
        ...config
    }
}

export function isRoomValid(roomId, key = null, value = null) {
    if (!Connections.has(roomId)) return false;
    if (key) {
        const connection = Connections.get(roomId);
        return connection[key] == value;
    }
    return true;
}

export function updateConnection(roomId, connection) {
    if (Connections.has(roomId)) {
        const existingConnection = Connections.get(roomId);
        connection = { ...existingConnection, ...connection };
        Connections.set(roomId, connection);
    }
    else {
        Connections.set(roomId, connection);
    }
}

export function joinRoom(roomId,userId,ws){
    console.log()
    updateConnection(roomId, { [RECEIVER]: userId, [RECEIVER_SOCKET]: ws });
    const connection = Connections.get(roomId);
    return connection;
}

export function send(ws,type,data){
    const payload = {
        type,
        data
    };
    console.log(!!ws,toStr(payload));
    ws.send(toStr(payload));
}