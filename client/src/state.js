import { generateId, toStr, $ } from './utils.js';
import { Socket } from './socket.js';
import { RTC } from './rtc.js';


export class State {
    ID = generateId(6);
    KEY;
    ROOM_ID;
    sender = false;
    socket;
    pc;

    constructor(isSender, KEY) {
        this.sender = isSender;
        this.KEY = KEY;
    }

    initConnection() {
        const payload = { id: this.ID, key: this.sender ? null : this.KEY };
        this.socket = new Socket(payload);
        this.socket.register(this.handleSocketMessage.bind(this),this.handleSocketClose);
    }

    handleSocketMessage(data) {
        this[data.method](data);
    }

    handleWS(message) {
        if (message.subtype == 'CONNECTED') {
            this.ROOM_ID = message.data.roomId;
            this.KEY = null;
            console.log("ROOM ID",this.ROOM_ID);
        }
    }
    
    handleRTC(message){
        console.log("RTC ",message);
        if(message.subtype=='PeerJoined'){
            this.pc = new RTC(this);
        }
        else{
            this.pc[message.subtype](message.data);
        }
    }

    handleSocketClose() {

    }

    send(message) {
        console.log("MESSAGE",message);
        this.socket.send(toStr(message));
    }

    sendViaChannel(message){
        const template = `<div class="card">
            <div class="card-subtitle sender-name">Sent :</div>
            <div class="title message-text">${message}</div>
        </div>`;
        const messageNode = document.createElement('div');
        messageNode.innerHTML = template;
        $('.message-container').appendChild(messageNode);
        this.pc.channel.send(message);
    }

    closeSocket() {
        setTimeout(() => {
            this.socket.close();
        });
    }
}
