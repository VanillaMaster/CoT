interface ModuleContainer {
    contextMenuProvider: {
        define: (name: string, template: DocumentFragment) => void;
        registry: Map<string, HTMLElement>;
    }
}

namespace CustomComponents {
    type ContextMenu = import("./component.js").ContextMenu;
}