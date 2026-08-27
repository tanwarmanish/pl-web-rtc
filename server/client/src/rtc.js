import { RTC_CONFIG } from './const.js';

let pc = null;

export async function initConnection(localStream) {
    // 1. RTC peer object
    pc = new RTCPeerConnection(RTC_CONFIG);
    console.log("PC", pc);

    pc.addEventListener('icegatheringstatechange', (e) => {
        console.log("ICE Gathering EVENT", e);
    })

    pc.onicecandidate = (e) => {
        console.log("ICE CANDIDATE", e);
    }

    //2. Add Track
    const tracks = localStream.getTracks();
    tracks.forEach(track => pc.addTrack(track));

    //3. RTC Offer
    pc.addEventListener('negotiationneeded', handleNegotiation);
    console.log(pc);
}

async function handleNegotiation() {
    const offer = pc.createOffer();
    pc.setLocalDescription(offer);
    console.log("Offer set", offer);
}