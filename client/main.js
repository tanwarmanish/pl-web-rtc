import { $ } from './src/utils.js';


let ref = $('#inital');
let t = $('#initial-target');
console.log(ref,t);
t.appendChild(ref.content.cloneNode(true))
