export const toStr = (obj) => JSON.stringify(obj);
export const toObj = (str) => JSON.parse(str);
export const copy = (arg) => toObj(toStr(arg));

export const $ = (selector)=>document.querySelector(selector);

export const on = (element, event, callback) => {
    element.addEventListener(event, callback);
}

export function generateId(length = 4) {
    let multiplier = Math.pow(10, length - 1);
    let id = Math.floor(multiplier + Math.random() * 9 * multiplier);
    return id;
}

export function toQueryParams(data){
    let endPoint='';
    Object.keys(data).forEach(key=>{
        endPoint +=`${key}=${toStr(data[key])}&`;
    });
    return endPoint;
}

export function loadTemplate(portal, template=null) {
    portal.innerHTML = '';
    if(!template) return;
    const node = template.content.cloneNode(true);
    portal.appendChild(node);
    return portal;
}