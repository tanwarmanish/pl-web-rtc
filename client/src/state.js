import { generateId, toQueryParams, toObj, toStr, $, loadTemplate } from './utils.js';
import { Socket } from './socket.js';
import { RTC } from './rtc.js';
import { TYPE } from './const.js';


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
}



// updateRoomSecret(key){
//     this.roomId = +key.slice(0,4);
//     this.secret = +key.slice(4,);
// }

// roomCreated({ roomId }) {
//     this.roomId = roomId;
//     const key = this.connectionKey();
//     loadTemplate(DOM.SenderPortal,DOM.SenderTemplate1);
//     document.querySelectorAll('.key-value').forEach((item,index) => (item.innerText = key[index]));
//     loadTemplate(DOM.ReceivePortal);
// }

// connectionKey() {
//     return `${this.roomId}${this.secret}`;
// }

// roomJoined(data){
//     console.log("Room Joined");
// }

// validateKey({key}) {
//     if(this.secret!=key)
//         return this.socket.keyIsInvalid();
//     console.log("KEY VALId, GEnerate OFFER", key);
// }

// acceptOffer(){
//     console.log("ACCEPT OFFER");
// }

// acceptAnswer(){
//     console.log("ACCEPT ANSWER");
// }