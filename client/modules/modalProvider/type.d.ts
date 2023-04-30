interface ModuleContainer {
    modalProvider: {
        modal: InstanceType<import("./Modal.js").__modal__>;
    }
}

namespace CustomComponents {
    type Frame = import("./Frame.js").Frame;
    type Modal = import("./Modal.js").Modal;
}