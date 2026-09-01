import { $, on, loadTemplate } from './src/utils.js';
import { State } from './src/state.js';
// import { DOM } from './src/state.js';

on($('#sender'),'click',sendReceiveClick);
on($('#receive'),'click',sendReceiveClick);


let state;

function sendReceiveClick($event){
    const isSender = $event.target.id == 'sender';
    state = new State(isSender);
    state.initConnection();
    console.log("EVENt", $event.target.id);
    // state.send({id:124});
}


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
