import { Frame } from "./Frame.js";

export const style = new CSSStyleSheet();
await style.replace(
    `dialog {
        /*margin-left: 10%;*/
        /*margin-right: 10%;*/
        margin-top: 5%;
        margin-bottom: 5%;
        height: auto;
        width: 35em;
        padding: 0;

        position: relative;
        isolation: isolate;

        border-color: #1c1c1c;
        color: #d8d9d9;

        overflow: hidden;
    }
    dialog>modal-frame {
        background-color: #282828;

        position: absolute;
        padding: 1em;
        inset: 0;
        animation-duration: 250ms;
    }
    dialog>modal-frame[data-type="active"] {
        z-index: 1;
    }
    dialog>modal-frame[data-type="showing"] {
        z-index: 2;
        animation-name: modal-slide-in;
    }
    dialog>modal-frame[data-type="closing"] {
        z-index: 2;
        animation-name: modal-slide-out;
    }
    dialog>modal-frame[data-type="inactive"] {
        display: none;
    }

    @keyframes modal-slide-in {
        from { translate: 100%; }
        to { }
    }
    @keyframes modal-slide-out {
        from { }
        to { translate: 100%; }
    }
    `
);

export class Modal extends HTMLDialogElement {
    //static #template = document.createRange().createContextualFragment(``);
    constructor(){
        super();
        this.dataset.class="modal";
        //const content = Modal.#template.cloneNode(true);
        //this.append(content);
    }
    /**@type {Frame | null} */
    #frame = null

    #stack = new DocumentFragment();

    /**
     * @param { Frame } frame 
     */
    show(frame){
        if (this.#frame == null) {
            frame.dataset.type = "active";
            this.#frame = frame;
            this.append(frame);
            this.showModal();
        } else {
            const currentFrame = this.#frame;
            frame.addEventListener("animationend", ()=>{
                frame.dataset.type = "active";
                this.#frame = frame;
                this.#stack.append(currentFrame);
            }, {once: true});

            frame.dataset.type = "showing";            
            this.append(frame);
        }
    }
    close(){
        if (this.#frame == null) return;
        if (this.#stack.children.length == 0) {
            this.removeChild(this.#frame);
            this.#frame = null;
            super.close();
        } else {
            const prevFrame = this.#stack.lastChild;

            prevFrame.addEventListener("animationend", ()=>{
                this.removeChild(this.#frame);
                this.#frame = prevFrame;
            });

            prevFrame.dataset.type = "active";
            this.#frame.dataset.type = "closing";
            this.append(prevFrame);
        }
    }
}
customElements.define("modal-container", Modal, {extends: "dialog"});

/**@typedef {typeof Modal} __modal__ */