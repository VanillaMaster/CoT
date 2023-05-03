namespace CustomComponents {
    type Layout = import("./component.js").Layout;
}

interface ModuleContainer {
    LayoutManaget: {
        Layout: typeof import("./component.js").Layout;
    }
}