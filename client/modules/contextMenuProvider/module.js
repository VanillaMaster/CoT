/**
@module ContextMenuProvider
@description Lorem ipsum dolor sit amet consectetur adipisicing elit.
Architecto quos voluptates accusantium mollitia odit est ullam cumque dignissimos amet.
Quo dolor labore autem quia porro, illum odit necessitatibus provident nulla. 
*/

import style from "./style.js";

/**@type { Map<string, ContextMenu> } */
const registry = new Map();

/**@type { Set<ContextMenu> } */
const active = new Set();


export class ContextMenu extends HTMLElement {
    constructor() {
        super();
        
        this.#shadow = this.attachShadow({mode: "closed"});
        this.#shadow.append(ContextMenu.template.cloneNode(true));
        
        this.#shadow.adoptedStyleSheets = [ContextMenu.style];

        this.addEventListener("pointerdown", function(e) {
            e.stopPropagation();
        });
    }

    static template = document.createRange().createContextualFragment(
        `<div data-class="content"><slot></slot></div>`
    );

    static style = new CSSStyleSheet();
    static {
        this.style.replace(style)
    }

    /**
     * @this { ContextMenu }
     */
    static #onclick(action) {
        this.#target.dispatchEvent(new Event(action));
        this.close();
    }

    #shadow;
    /**@type { HTMLElement } */
    #target;

    /**
     * 
     * @param { HTMLElement } target 
     * @param { number } x 
     * @param { number } y 
     */
    show(target, x, y) {
        this.#target = target;
        this.setAttribute("visible", "");
        this.style.setProperty("--x", `${x}px`);
        this.style.setProperty("--y", `${y}px`);
        active.add(this);
    }

    close() {
        this.removeAttribute("visible");
        active.delete(this);
    }

    /**
     * @param { DocumentFragment } template 
     */
    init(template){
        for (const element of template.querySelectorAll("button")) {
            element.addEventListener("click", ContextMenu.#onclick.bind(this, `context:${element.dataset.contextAction}`))
        }
        this.append(template)
    }
}

customElements.define("context-menu", ContextMenu);

document.addEventListener("pointerdown", function(e) {
    e.stopPropagation();
});

document.addEventListener("pointerdown", function(e) {
    for (const element of active) {
        element.close();
    }
});

window.addEventListener("module:load", ()=>{

    window.modules.contextMenuProvider = {
        define(name, html) {
            /**@type { ContextMenu } */
            const menu = /**@type { any }*/(document.createElement("context-menu"));
            menu.init(html);
            registry.set(name, menu);
            document.body.append(menu);
        },
        registry
    }

})


document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    const { clientX: x, clientY: y } = e;
    for (const element of e.composedPath()) if (element instanceof HTMLElement && "contextMenu" in element.dataset) {
        const name = element.dataset.contextMenu;
        const menu = registry.get(name);
        if (menu == undefined) break;

        menu.show(element, x, y);
        
        break;
    }
});