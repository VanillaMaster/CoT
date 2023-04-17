/**
@module ModalProvider
@description Lorem ipsum dolor sit amet consectetur adipisicing elit.
Architecto quos voluptates accusantium mollitia odit est ullam cumque dignissimos amet.
Quo dolor labore autem quia porro, illum odit necessitatibus provident nulla. 
*/

import { Modal, style } from "./Modal.js"

document.adoptedStyleSheets = [...document.adoptedStyleSheets, style];

window.addEventListener("module:load", ()=>{
    window.modules.modalProvider = {
        modal: document.createElement("dialog", {is: "modal-container"})
    }
    document.body.append(window.modules.modalProvider.modal);
}, {once: true});

window.addEventListener("module:afterLoad", ()=>{

}, {once: true});
