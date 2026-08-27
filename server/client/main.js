import { $ } from './src/utils.js';
import { attachStream, loadCameraStream } from './src/load-camera.js';
import { initConnection } from './src/rtc.js';

const user = {
    id: Math.floor(Math.random() * 10e8),
    name: ''
}

$('.connect-section button').addEventListener('click',()=>{
    const input = $('.connect-section input');
    if(!input) return;
    const name = input.value.trim();
    if(!name) return;

    user.name = name;
    $('.connect-section').classList.add('hide');
    $('.container').classList.remove('hide');
});


const currentUserVideoContainer = $('.user.current-user');
currentUserVideoContainer.addEventListener('click',async ()=>{
    const stream = await loadCameraStream();
    attachStream(stream,true);
    initConnection(stream);
});

