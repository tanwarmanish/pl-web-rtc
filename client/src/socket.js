

import { toObj, toQueryParams } from './utils.js';

export class Socket {
    socket = null;

    constructor(queryParams = {}) {
        URL = 'http://localhost:8000';
        this.socket = new WebSocket(`${URL}?${toQueryParams(queryParams)}`);
    }

    register(messageCallback, closeCallback) {
        this.socket.onopen = () => {
            this.socket.onmessage = (message) => this.parseMessage(message, messageCallback);
            this.socket.onclose = closeCallback;
        }
    }

    send(message) {
        this.socket.send(message);
    }

    parseMessage(message, messageCallback) {
        const data = toObj(message.data);
        const [type, subtype] = data.type.split(':');
        const method = 'handle' + type;
        messageCallback({ ...data, type, subtype, method })
    }

    close(){
        this.socket.close();
    }

}

