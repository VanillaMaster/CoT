/**
@module ModalProvider
@description Lorem ipsum dolor sit amet consectetur adipisicing elit.
Architecto quos voluptates accusantium mollitia odit est ullam cumque dignissimos amet.
Quo dolor labore autem quia porro, illum odit necessitatibus provident nulla. 
*/
import { Modal, style } from "./component.js"


document.adoptedStyleSheets = [...document.adoptedStyleSheets, style];

/**@type {Modal} */
const modal = /**@type {*}*/ (document.createElement("dialog", {is: "modal-container"}));
document.body.append(modal);

window.addEventListener("module:load", ()=>{
    window.app.modules.modalProvider = {
        define(name, fragment) {
            const section = document.createElement("section");
            section.dataset.name = name;
            section.append(fragment);
            modal.view.append(section);
        },
        show(name) {
            modal.view.show(name);
            modal.showModal();
        }
    }
}, {once: true});

window.addEventListener("module:afterLoad", ()=>{

}, {once: true});
