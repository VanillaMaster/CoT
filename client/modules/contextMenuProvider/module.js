/**
@module ContextMenuProvider
@description Lorem ipsum dolor sit amet consectetur adipisicing elit.
Architecto quos voluptates accusantium mollitia odit est ullam cumque dignissimos amet.
Quo dolor labore autem quia porro, illum odit necessitatibus provident nulla. 
*/

import { ContextMenu } from "./component.js";

customElements.define("context-menu", ContextMenu);

document.addEventListener("pointerdown", function(e) {
    e.stopPropagation();
    for (const element of ContextMenu.active) {
        element.close();
    }
});

document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    const { clientX: x, clientY: y } = e;
    for (const element of e.composedPath()) if (element instanceof HTMLElement && "contextMenu" in element.dataset) {
        const name = element.dataset.contextMenu;
        const menu = ContextMenu.registry.get(name);
        if (menu == undefined) break;

        menu.show(element, x, y);
        
        break;
    }
});

window.addEventListener("module:load", ()=>{

    console.log(1);

    window.modules.contextMenuProvider = {
        define(name, html) {
            /**@type { ContextMenu } */
            const menu = /**@type { any }*/(document.createElement("context-menu"));
            menu.dataset.name = name;
            menu.init(html);
            ContextMenu.registry.set(name, menu);
            document.body.append(menu);
        },
        registry: ContextMenu.registry   
    }

}, {once: true});

