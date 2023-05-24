/**
@module ModalProvider
@description Lorem ipsum dolor sit amet consectetur adipisicing elit.
Architecto quos voluptates accusantium mollitia odit est ullam cumque dignissimos amet.
Quo dolor labore autem quia porro, illum odit necessitatibus provident nulla. 
*/
import { Modal, style } from "./component.js"

/**@type {Modal} */
const modal = /**@type {*}*/ (document.createElement("dialog", {is: "modal-container"}));
document.body.append(modal);
document.adoptedStyleSheets = [...document.adoptedStyleSheets, style];


export function define(name, fragment) {
    const section = document.createElement("section");
    section.dataset.name = name;
    section.append(fragment);
    modal.view.append(section);
    return section;
}
export function show(name) {
    modal.view.show(name);
    modal.showModal();
}
export function close() {
    modal.close();
}


// define("modalProvider", [], function(){
//     /**@type {Modal} */
//     const modal = /**@type {*}*/ (document.createElement("dialog", {is: "modal-container"}));
//     document.body.append(modal);
//     document.adoptedStyleSheets = [...document.adoptedStyleSheets, style];

//     return {
//         define(name, fragment) {
//             const section = document.createElement("section");
//             section.dataset.name = name;
//             section.append(fragment);
//             modal.view.append(section);
//             return section;
//         },
//         show(name) {
//             modal.view.show(name);
//             modal.showModal();
//         },
//         close() {
//             modal.close();
//         }
//     }
// });

