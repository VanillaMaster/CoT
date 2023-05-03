namespace CustomComponents {
    type SVGChart = import("./component.js").SVGChart;
}

interface ModuleContainer {
    SVGChartProvider: {
        SVGChart: typeof import("./component.js").SVGChart;
    }
}

namespace SVGChartInnerType {
    type Segment = {
        self: SVGLineElement,
        x1: SVGAnimateElement,
        x2: SVGAnimateElement,
        y1: SVGAnimateElement,
        y2: SVGAnimateElement,
        values: {
            x1: number,
            x2: number,
            y1: number,
            y2: number
        },
        represents?: number
    };
    
    type Vertex = {
        self: SVGCircleElement,
        cx: SVGAnimateElement,
        cy: SVGAnimateElement,
        values:{
            cx: number,
            cy: number
        },
        represents?: number
    };

    type Label = {
        self: SVGTextElement,
        x: SVGAnimateElement,
        y: SVGAnimateElement,
        text: SVGTSpanElement,
        values: {
            x: number,
            y: number
        },
        represents?: number
    };
}