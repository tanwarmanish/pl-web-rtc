import { $ } from './utils.js';
import { getState, updateValue, update } from './state.js';
import { createDataChannel, sendCandidates } from './rtc.js';
import { RTC_CONFIG  } from './const.js';

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
            break;
        }
        case 'offer':{
            handleOffer(data.data);
            break;
        }
        case 'answer':{
            handleAnswer(data.data);
            break;
        }
        case 'candidates':{
            handleCandidates(data.data);
            break;
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

async function handleOffer(data){
    const {userId,senderId,offer}= data;
    let pc = new RTCPeerConnection(RTC_CONFIG);
    updateValue('pc', pc);
    const ws = getState('socket');

    pc.ontrack = (e)=>{
        $('#other-user-video').srcObject = e.streams[0];
    }

    pc.addEventListener('connectionstatechange', (e) => {
        console.log("Connection State", e);
    });
    createDataChannel(false);

    pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    pc.setLocalDescription(answer);
    const message = {
        type: 'answer',
        data:{
            answer: answer,
            userId:senderId
        }
    };
    pc.onicecandidate = (e) => {
        if (e.candidate) {
            const candidates = getState('candidates');
            candidates.push(e.candidate);
            updateValue('candidates', candidates);
        }
        else {
            const pc = getState('pc');
            updateValue('ready', !!pc.remoteDescription);
            sendCandidates();
        }
    }
    ws.send(JSON.stringify(message));
}

function handleAnswer(data){
    console.log("ANSWER",data);
    const pc = getState('pc');
    pc.setRemoteDescription(data.answer);
    updateValue('ready',true);
    sendCandidates();
    if(!getState('remoteAdded')){
        let candidates = getState('remoteCandidates')||[];
        candidates.forEach(candidate=>pc.addIceCandidate(candidate));
    }
}

function handleCandidates(data){
    const pc = getState('pc');
    if(pc.remoteDescription){
        data.candidates.forEach(candidate=>pc.addIceCandidate(candidate));
        updateValue('remoteAdded',true);
    }
    else{
        let remoteCandidates = getState('remoteCandidates') || [];
        remoteCandidates = remoteCandidates.concat(remoteCandidates);
        updateValue('remoteCandidates',remoteCandidates);
    }
}