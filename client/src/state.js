import { generateId, toQueryParams, toObj, toStr, $, loadTemplate } from './utils.js';
import { Socket } from './socket.js';
import { TYPE } from './const.js';


export class State {
    ID = generateId(6);
    KEY;
    sender = false;
    socket;

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

    handleWS(data){
        console.log("CONNECTED...",data);
    }
    
    handleRTC(data){
        console.log("RTC ",data);
    }

    handleSocketClose() {

    }

    send(message) {
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