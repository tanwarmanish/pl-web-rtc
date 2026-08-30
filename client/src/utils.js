export const $ = (selector)=>document.querySelector(selector);

export const on = (element, event, callback) => {
    element.addEventListener(event, callback);
}