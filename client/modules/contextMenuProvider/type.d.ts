interface ModuleContainer {
    contextMenuProvider: {
        show: (content: DocumentFragment, x: number, y: number) => void;
        close: () => void;
    }
}