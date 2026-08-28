let state = {
    id: null,
    socket: null,
    candidates:[],
    ready:false,
    sent:false,
    remoteAdded:false
};

export function updateValue(key,value){
    state[key] = value;
}

export function update(newState) {
    state = Object.assign(state, newState);
}

export function getState(key = null) {
    if (!key) return state;
    return state[key] || null;
}