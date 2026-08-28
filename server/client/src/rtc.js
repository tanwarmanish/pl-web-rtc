import { RTC_CONFIG } from './const.js';
import { updateValue, getState } from './state.js';

let pc = null;

export async function initConnection(localStream) {
    // 1. RTC peer object
    pc = new RTCPeerConnection(RTC_CONFIG);
    updateValue('pc',pc);

    pc.addEventListener('connectionstatechange',(e)=>{
        console.log("Connection State", e);
    });

    // pc.addEventListener('signalingstatechange',(e)=>{
    //     console.log('Signaling state', pc.signalingState);
    // })

    pc.addEventListener('icegatheringstatechange', (e) => {
        console.group("ICE Gathering EVENT", e);
    })

    pc.onicecandidate = (e) => {
        if(e.candidate){
            const candidates = getState('candidates');
            candidates.push(e.candidate);
            updateValue('candidates',candidates);
        }
        else{
            const pc = getState('pc');
            updateValue('ready', !!pc.remoteDescription);
            sendCandidates();
        }
    }

    //2. Add Track
    const tracks = localStream.getTracks();
    tracks.forEach(track => pc.addTrack(track,localStream));

    //2.2 Data Channel
    createDataChannel(true);

    //3. RTC Offer
    pc.addEventListener('negotiationneeded', handleNegotiation);
    console.log(pc);
}

async function handleNegotiation() {
    const pc = getState('pc');
    const offer = await pc.createOffer();
    pc.setLocalDescription(offer);
    sendOffer(offer);
}

export function createDataChannel(isSender) {
    const pc = getState('pc');
    console.log(pc,"RECEIVE");
    if (isSender) {
        const options = {
            ordered: false,
            maxRetransmits: 0
        }
        let dataChannel = pc.createDataChannel('chat-channel', options);
        updateValue('dataChannel', dataChannel);
        registerDataChannelListeners();
    }
    else {
        pc.ondatachannel = (e)=>{
            updateValue('dataChannel',e.channel);
            registerDataChannelListeners();
        }
    }
}

function registerDataChannelListeners(){
    const dataChannel = getState('dataChannel');
    dataChannel.addEventListener('open',(e)=>{
        console.log("CHANNEL opened",e);
    });
    dataChannel.addEventListener('close',(e)=>{
        console.log("CHANNEL closed", e);
    });
    dataChannel.addEventListener('message',(e)=>{
        console.log("CHANNEL", e);
    });

}

function sendOffer(offer){
    const ws = getState('socket');
    const remoteUser = getState('remoteUser'); 
    const message = {
        type: 'offer',
        data:{
            offer: offer,
            userId:remoteUser.id
        }
    };
    ws.send(JSON.stringify(message));
}

export function sendCandidates(){
    const ready = getState('ready');
    const sent = getState('sent');
    if(!ready) return;
    if(sent) return;
    updateValue('sent',true);
    const ws = getState('socket');
    const candidates = getState('candidates');
    const remoteUser = getState('remoteUser');
    const payload = {
        type:'candidates',
        data:{
            candidates:candidates,
            userId:remoteUser.id,
        }
    }
    console.log("Candidate count", candidates.length);
    ws.send(JSON.stringify(payload));
}