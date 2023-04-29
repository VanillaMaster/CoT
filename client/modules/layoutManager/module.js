class Layout extends HTMLElement {
    constructor() {
        super();
    }

    
}

class LayoutContainer extends HTMLDivElement {
    constructor() {
        super();
    }

    #parent;
    set parent(value) {
        this.#parent = value;
    }
    
    connectedCallback() {

    }
    disconnectedCallback() {

    }

    adoptedCallback() {

    }

    remove() {
        super.remove();
    }

    show(){

    }

    hide(){

    }
}