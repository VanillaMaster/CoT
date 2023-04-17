export class Frame extends HTMLElement {
    static #style = new CSSStyleSheet()
    static {
        this.#style.replace(`
            :host(*) {
                display: flex;
                flex-direction: column;
            }
            slot[name="controlls"] {
                display: flex;
                flex-direction: row-reverse;
            }
            slot[name="head"] {

            }
            .body {
                flex-grow: 1;
                overflow-y: auto;
                overflow-x: hidden;
            }
            slot.content {

            }
        `);
    }
    static #template = document.createRange().createContextualFragment(`
    <slot name="head"><h1>undefined</h1></slot>
    <div class="body">
        <slot class="content">undefined</slot>
    </div>
    <div>
        <hr/>
        <slot name="controlls">undefined</slot>
    </div>
    `);
    constructor(){
        super();
        this.#shadow = this.attachShadow({mode: "closed"});
        const content = Frame.#template.cloneNode(true);
        /*
        this.#head = content.querySelector(".head");
        this.#body = content.querySelector(".content");
        this.#footer = content.querySelector(".controlls");
        */
        this.#shadow.adoptedStyleSheets = [Frame.#style];

        this.#shadow.append(content);
    }
    #shadow;
    /*
    #head;
    #body;
    #footer;
    */
}

customElements.define("modal-frame", Frame);