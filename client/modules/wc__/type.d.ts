interface ModuleContainer {
    wc: {
        define: (
            name: string,
            elements: DocumentFragment,
            callBack: (data: {[name: string]: string}) => CustomComponents.Widget
        ) => void;
    }
}