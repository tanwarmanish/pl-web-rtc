import { $ } from './utils.js';
import { getState, updateValue, update } from './state.js';

export function initSocket(){
    const ws = new WebSocket(`/?${toQueryParams(getState('user'))}`);
    updateValue('socket',ws);
    registerSocketEvents();
}

export function registerSocketEvents(){
    const ws = getState('socket');
    ws.onopen = ()=>{
        updateSocketState('open');
        ws.onmessage = handleMessage;
        ws.onclose = handleClose;
    };
}

function handleMessage(message) {
    const data = JSON.parse(message.data);
    switch (data.type) {
        case 'joined': {
            updateValue('remoteUser', data);
            $('#other-user-name').innerText = data.name;
        }
    }
}

function handleClose(){
    updateSocketState('closed');
}

function updateSocketState(state='new'){
    const e = $('#socket-state');
    e.classList = '';
    e.classList.add(state);
}

function toQueryParams(data){
    let endPoint='';
    Object.keys(data).forEach(key=>{
        endPoint +=`${key}=${data[key]}&`;
    });
    return endPoint;
}