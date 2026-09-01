import { $ } from './utils.js';

export class RTC {
    pc;
    state;
    channel;
    candidates = [];
    pendingCandidates = [];

    constructor(state) {
        this.state = state;
        this.pc = new RTCPeerConnection();
        this.gatherCandidates();
        this.initializeChannel();
        this.generateOffer();
    }

    generateOffer() {
        if (!this.state.send) return;
        this.pc.addEventListener('negotiationneeded', async () => {
            const offer = await this.pc.createOffer();
            this.pc.setLocalDescription(offer);
            const message = {
                type: 'RTC:AcceptOffer',
                data: {
                    id: this.state.ID,
                    roomId: this.state.ROOM_ID,
                    offer
                }
            };
            this.state.send(message);
        });
    }

    async generateAnswer() {
        if (this.state.sender) return;
        const answer = await this.pc.createAnswer();
        this.pc.setLocalDescription(answer);

        const message = {
            type: 'RTC:AcceptAnswer',
            data: {
                id: this.state.ID,
                roomId: this.state.ROOM_ID,
                answer
            }
        };
        this.state.send(message);
    }

    async AcceptOffer(data) {
        this.pc.setRemoteDescription(data.offer);
        this.generateAnswer();
        this.sendCandidates();
        this.AcceptCandidates();
    }

    AcceptAnswer(data) {
        this.pc.setRemoteDescription(data.answer);
        this.sendCandidates();
        this.AcceptCandidates();
    }

    gatherCandidates() {
        this.pc.addIceCandidate();
        this.pc.onicecandidate = (data) => {
            if (data.candidate) this.candidates.push(data.candidate);
            else this.sendCandidates();
        }
    }

    sendCandidates() {
        if (!this.pc.remoteDescription) return;
        if (this.pc.iceGatheringState != 'complete') return;
        const message = {
            type: 'RTC:AcceptCandidates',
            data: {
                id: this.state.ID,
                roomId: this.state.ROOM_ID,
                candidates: this.candidates,
            }
        }
        this.state.send(message);
    }

    AcceptCandidates(data) {
        if (data && data.candidates) {
            this.pendingCandidates = data.candidates;
        }
        if (this.pc.remoteDescription) {
            this.pendingCandidates.forEach(candidate => {
                this.pc.addIceCandidate(candidate);
            });
        }
    }

    initializeChannel() {
        if (this.state.sender) {
            const options = {};
            this.channel = this.pc.createDataChannel('data-channel', options);
            this.registerChannelListeners();
        }
        else {
            this.pc.ondatachannel = ($event) => {
                this.channel = $event.channel;
                this.registerChannelListeners();
            }
        }
    }

    registerChannelListeners() {
        this.channel.addEventListener('open', (e) => {
            this.state.closeSocket();
            console.log("Connected...");
        });
        this.channel.addEventListener('close', (e) => {
            console.log("CHANNEL Closed");
        });
        this.channel.addEventListener('message', (e) => {
            const message = e.data;
            const template = `<div class="card">
                        <div class="card-subtitle sender-name">Received :</div>
                        <div class="title message-text">${message}</div>
                    </div>`;
            const messageNode = document.createElement('div');
            messageNode.innerHTML = template;
            $('.message-container').appendChild(messageNode);
        })
    }
}
