import styleText from "./style.js";

export const style = new CSSStyleSheet();
style.replace(styleText);

export class Modal extends HTMLDialogElement {
    //static #template = document.createRange().createContextualFragment(``);
    constructor(){
        super();
        const template = Modal.template.cloneNode(true);
        this.dataset.is = "modal";
        
        this.#view = template.querySelector("layout-viewport");
        this.#view.addEventListener("pointerdown", function(e) {
            e.stopPropagation();
        })
        this.addEventListener("pointerdown", function(e) {
            e.stopPropagation();
            this.close();
        })

        this.append(template)
    }
    /**@type {CustomComponents.Layout} */
    #view;
    get view() {
        return this.#view;
    }

    static template = document.createRange().createContextualFragment(
        `<layout-viewport></layout-viewport>`
    );

    //static style = new CSSStyleSheet();
    static {
        //this.style.replace(style)
    }
}
customElements.define("modal-container", Modal, {extends: "dialog"});