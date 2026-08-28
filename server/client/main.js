import { $ } from './src/utils.js';
import { initConnection } from './src/rtc.js';
import { update, updateValue, getState } from './src/state.js'
import { attachStream, loadCameraStream } from './src/load-camera.js';
import { initSocket } from './src/ws.js';

$('.connect-section button#create-room').addEventListener('click', () => CreateOrJoinRoom(true));
$('.connect-section button#join-room').addEventListener('click', () => CreateOrJoinRoom(false));

function CreateOrJoinRoom(create = false) {
    const name$ = $('.connect-section input#name');
    const roomId$ = $('.connect-section input#roomId');
    if (!name$ || !roomId$) return;

    const name = name$.value.trim();
    const roomId = roomId$.value.trim();
    if (!name || !roomId) return;

    const id = Math.floor(Math.random() * 10e8)
    const payload = {
        id,
        user: {
            id,
            name,
            roomId,
            newRoom: create ? 1 : 0
        }
    };
    update(payload);
    $('#current-user-name').innerText = name;
    loadVideoContainer();
}



function loadVideoContainer() {
    $('.connect-section').classList.add('hide');
    $('.container').classList.remove('hide');

    initSocket();

    // init video container
    const currentUserVideoContainer = $('.user.current-user');
    currentUserVideoContainer.addEventListener('click', loadVideoStream);

}

async function loadVideoStream() {
    const stream = await loadCameraStream();
    attachStream(stream, true);
    initConnection(stream);
}



