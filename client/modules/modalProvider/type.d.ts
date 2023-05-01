interface ModuleContainer {
    modalProvider: {
        define: (name: string, template: DocumentFragment) => void;
        show: (name: string) => void;
    }
}

namespace CustomComponents {
    type Frame = import("./Frame.js").Frame;
    type Modal = import("./component.js").Modal;
}