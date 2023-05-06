interface ModuleContainer {
    modalProvider: {
        define: (name: string, template: DocumentFragment) => HTMLElement;
        show: (name: string) => void;
        close: () => void;
    }
}

namespace CustomComponents {
    type Frame = import("./Frame.js").Frame;
    type Modal = import("./component.js").Modal;
}