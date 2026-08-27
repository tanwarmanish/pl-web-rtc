const STUN_SERVER_LIST = [
    'stun2.l.google.com:19302',
    'stun3.l.google.com:19302',
    'stun4.l.google.com:19302'
];

export const RTC_CONFIG = {
    iceServers: [
        {
            urls: STUN_SERVER_LIST.map(url => `stun:${url}`)
        }
    ]
};