import { $, on, loadTemplate } from './src/utils.js';
import { State } from './src/state.js';
// import { DOM } from './src/state.js';

on($('#sender'),'click',sendReceiveClick);
on($('#receive'),'click',sendReceiveClick);


let state;

function sendReceiveClick($event) {
    const isSender = $event.target.id == 'sender';
    let key = isSender ? null : +($('#receive-key').value.trim() || '');
    state = new State(isSender, key);
    state.initConnection();
    console.log("EVENt", $event.target.id);
    // state.send({id:124});
}

on($('#send-message'),'click',()=>{
    const message = $('#message-input').value.trim();
    if(!message) return;
    state.sendViaChannel(message);
    $('#message-input').value = '';
});


// main();

// function main(){
//     loadTemplate(DOM.SenderPortal,DOM.SenderTemplate0);
//     loadTemplate(DOM.ReceivePortal,DOM.RecieveTemplate0);

//     on($('#sender-portal .card-plus-button'), 'click', () => {
//         state.initialize();
//     });

//     on($('#receive-portal .download-btn'), 'click', () => {
//         let key = $('#receive-portal input').value.trim();
//         if(key.length!=7) return;
//         state.initialize(key);
//     });
// }

// state.initializeSocket(true);


// let ref = $('#inital');
// let t = $('#initial-target');
// console.log(ref,t);
// t.appendChild(ref.content.cloneNode(true))
