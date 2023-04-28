import style from "./style.js";

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

    /**@type { Map<string, ContextMenu> } */
    static registry = new Map();
    /**@type { Set<ContextMenu> } */
    static active = new Set();

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
        ContextMenu.active.add(this);
    }

    close() {
        this.removeAttribute("visible");
        ContextMenu.active.delete(this);
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