
interface ModuleContainer {
    WidgetGridProvider: {
        Grid: typeof import("./src/grid/component.js").Grid;
        Widget: typeof import("./src/widget/component.js").Widget;
    }
}

namespace CustomComponents {
    type Grid = import("./src/grid/component.js").Grid;
    type Widget = import("./src/widget/component.js").Widget;
}