import style from "./style.js";

export class Layout extends HTMLElement {
    static template = document.createRange().createContextualFragment(
        `<slot></slot>`
    );
    static style = new CSSStyleSheet();
    static {
        this.style.replace(style);
    }
    constructor() {
        super();
        this.#shadow = this.attachShadow({mode: "closed", slotAssignment: "manual"});
        this.#shadow.adoptedStyleSheets = [Layout.style];
        
        const template = Layout.template.cloneNode(true);
        this.#slot = template.querySelector("slot");

        this.#shadow.append(template);
    }
    #shadow;

    #slot;

    show(name){
        this.setAttribute("active", name);
    }

    /**
     * @param { (typeof Layout)["observedAttributes"][number] } attrName 
     * @param { string } oldVal 
     * @param { string } newVal 
     */
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (newVal == oldVal) return;
        Layout.#handlers[attrName].call(this, oldVal, newVal);
    }

    /**@satisfies { {[key in (typeof Layout)["observedAttributes"][number]]: (this: Layout, oldVal: string, newVal: string) => any} } */
    static #handlers = {
        "active"(oldVal, newVal) {
            const element = this.querySelector(`:scope>[data-name="${newVal}"]`);
            this.#slot.assign(element);
        },
    }

    static get observedAttributes() {
        return /**@type { const } */ (["active"]);
    }
}