import { $ } from './utils.js';

export async function loadCameraStream() {
    // let media$ = navigator.mediaDevices.getUserMedia({ video: true });
    const deviceConfig = {
        video: true
    };
    let media$ = navigator.mediaDevices.getUserMedia(deviceConfig);
    const stream = await media$;
    return stream;
}

export function attachStream(stream,isCurrent=true){
    const selector = isCurrent?'#current-user-video':'#other-user-video';
    $(selector).srcObject = stream;
}

// function getVideoIDs(){
//     navigator.mediaDevices.enumerateDevices()
//     .then((devices)=>{
//         devices.forEach(device=>{
//             console.log(device);
//         })
//     })
// }