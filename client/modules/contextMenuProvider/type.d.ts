interface ModuleContainer {
    contextMenuProvider: {
        define: (name: string, template: DocumentFragment) => void;
        registry: Map<string, HTMLElement>;
    }
}