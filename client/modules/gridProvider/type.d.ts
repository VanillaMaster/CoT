
interface ModuleContainer {
    WidgetGridProvider: {
        Grid: typeof import("./src/grid/component.js").Grid;
        Widget: typeof import("./src/widget/component.js").Widget;
    }
}