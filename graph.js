/**
 * @typedef { {self: SVGLineElement, x1: SVGAnimateElement, x2: SVGAnimateElement, y1: SVGAnimateElement, y2: SVGAnimateElement, values: {x1: number, x2: number, y1: number, y2: number}, represents: number} } Segment
 * @typedef { {self: SVGCircleElement, cx: SVGAnimateElement, cy: SVGAnimateElement, values: { cx: number, cy: number }, represents: number} } Vertex
*/

const style = new CSSStyleSheet();
style.replaceSync(
    `svg {
        bottom: 0;
        right: 0;
        height: 100%;
        position: absolute;
    }
    svg line {
        stroke: var(--stroke, #0074d9);
        stroke-width: var(--stroke-width ,2);
        stroke-linecap: round;
    }
    svg circle {
        r: var(--r, 4);
        fill: var(--vertex-color, #0074d9);
    }
    :host(*) {
        height: 100px;
        width: 100px;
        position: relative;
        overflow: hidden;
        display: block;
    }`
);

const template = document.createRange().createContextualFragment(
    `<svg transform="scale(-1, -1)" transform-origin="center" viewBox="0 0 1000 500" style="position: absolute;bottom: 0;right: 0;height: 100%;">
        <g id="segments"></g>
        <g id="vertices">
            <!--<circle cx="60" cy="60" r="50"/-->
        </g>
    </svg>`
);


class SVGChart extends HTMLElement {
    constructor(){
        super();
        this.#shadow = this.attachShadow({mode: "closed"});
        this.#shadow.append(template.cloneNode(true));
        this.#svg = this.#shadow.querySelector("svg");
        this.#segmentsContainer = this.#svg.getElementById("segments");
        this.#verticesContainer = this.#svg.getElementById("vertices");

        this.#shadow.adoptedStyleSheets = [style];
        SVGChart.observer.observe(this);

        const g = gen();
        (async () => {
            for await (const v of g) {
                if (window.dbg === true) {
                    this.#draw.next();
                } else {
                    this.push(v);
                };
            }
        })();
    }
    #shadow;
    #svg;
    #segmentsContainer;
    #verticesContainer;

    /**@type { Segment[] } */
    #segments = [];
    /**@type { Vertex[] } */
    #vertices = [];

    #props = {
        length: 10,
        working: false,
        /**@type {number[]} */
        values: [],
        height: 500,
        width: 0,

        stepSize: 100,

        padding: {
            height: 10,
            width: 0
        },
    }

    push(value) {
        this.#props.values.unshift(value);
        if (this.#props.values.length - this.#props.length > 2) {
            this.#props.values.pop();
        }
        if (this.#props.values.length > 1) {
            this.#draw.next();
        }
    }

    updateElements(){
        const predictedLength = (this.#props.length + 1);
        if (this.#props.values.length > predictedLength) {
            this.#props.values.length = predictedLength;
        }

        this.updateSegments();
        this.updateVertices();
    }

    updateVertices(){
        //remove excess
        while (this.#vertices.length - this.#props.length > 1) {
            const vertex = this.#vertices.pop();
            vertex.self.remove();
        }
        //add new
        while (this.#vertices.length - this.#props.length < 2) {
            const self = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            /**@type { Vertex } */
            const vertex = {
                self,
                cx: createAnimateElement("cx", self),
                cy: createAnimateElement("cy", self),
                values: {
                    cx: 0,
                    cy: 0
                }
            }

            this.#vertices.push(vertex)
            this.#verticesContainer.append(self);
        }
    }

    updateSegments(){
        //remove excess
        while (this.#segments.length > this.#props.length) {
            const segment = this.#segments.pop();
            segment.self.remove();
        }
        //add new
        while (this.#segments.length <= this.#props.length) {
            const self = document.createElementNS("http://www.w3.org/2000/svg", "line");
            /**@type { Segment } */
            const segment = {
                self,
                x1: createAnimateElement("x1", self),
                x2: createAnimateElement("x2", self),
                y1: createAnimateElement("y1", self),
                y2: createAnimateElement("y2", self),
                values: {
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 0
                },
                represents: 0
            };
            self.setAttribute( "x1", 0)
            self.setAttribute( "x2", 0)
            self.setAttribute( "y1", 0)
            self.setAttribute( "y2", 0)

            this.#segments.push(segment)
            this.#segmentsContainer.append(self);
        }
    }

    /**@type {Generator<void, void, void>} */
    #draw = SVGChart.drawer(this);

    static observer = new ResizeObserver((entries)=>{
        for (const entry of entries) {
            /**@type { { target: SVGChart} } */
            const { target } = entry;
            const relativeStep = entry.contentRect.height / target.#props.height;
            const relativeWidth = entry.contentRect.width / relativeStep;
            const stepsWidth = Math.ceil(relativeWidth / target.#props.stepSize);
            const width = stepsWidth * target.#props.stepSize;

            if (target.#props.width == width) continue;
            target.#props.width = width;

            target.#props.length = width / target.#props.stepSize;
            target.updateElements();
            
            target.#svg.setAttribute("viewBox", `0 0 ${target.#props.width} ${target.#props.height}`);
        }
    });

    /**
     * @param { SVGChart } self 
     */
    static *drawer(self) {
        while (true) {
            const targetValues = self.#props.values.slice(0, self.#props.length + 1);
            const min = Math.min.apply(undefined, targetValues)
            const max = Math.max.apply(undefined, targetValues)
            const range = Math.max(max - min, 1);

            const availableHeight = self.#props.height - (self.#props.padding.height * 2);
            const availableWidth = self.#props.width - (self.#props.padding.width * 2);

            const hu = availableHeight / range;
            const wu = availableWidth / self.#props.length;

            let x1 = null, x2 = null, y1 = null, y2 = null;
            let i = 0;

            const segmentIter = self.#segments[Symbol.iterator]();
            const vertexIter = self.#vertices[Symbol.iterator]();
            for (const value of self.#props.values) {
                x1 = x2;
                y1 = y2;
                x2 = (i++ * wu) + self.#props.padding.width;
                y2 = ((value - min) * hu) + self.#props.padding.height;

                /**@type { {value: Vertex} } */
                const { value: vertex } = vertexIter.next();
                if (vertex != undefined) {
                    vertex.cx.setAttribute("from", vertex.values.cx);
                    vertex.cx.setAttribute("to", x2);
                    vertex.self.setAttribute("cx", x2);
                    vertex.values.cx = x2;

                    vertex.cy.setAttribute("from", vertex.values.cy);
                    vertex.cy.setAttribute("to", y2);
                    vertex.self.setAttribute("cy", y2);
                    vertex.values.cy = y2;
                } else {
                    console.error("vertex not found");
                }

                if ( (x1 != null && x2 != null) && (y1 != null && y2 != null) ) {
                    /**@type { {value: Segment} } */
                    const { value: segment } = segmentIter.next();
                    if (segment != undefined) {
                        segment.x1.setAttribute("from", segment.values.x1);
                        segment.x1.setAttribute("to", x1);
                        segment.self.setAttribute("x1", x1);
                        segment.values.x1 = x1;
            
                        segment.x2.setAttribute("from", segment.values.x2);
                        segment.x2.setAttribute("to", x2);
                        segment.self.setAttribute("x2", x2);
                        segment.values.x2 = x2;
            
                        segment.y1.setAttribute("from", segment.values.y1);
                        segment.y1.setAttribute("to", y1);
                        segment.self.setAttribute("y1", y1);
                        segment.values.y1 = y1;
            
                        segment.y2.setAttribute("from", segment.values.y2);
                        segment.y2.setAttribute("to", y2);
                        segment.self.setAttribute("y2", y2);
                        segment.values.y2 = y2;
    
                        segment.represents = value;
                    } else {
                        console.error("segment not found");
                    }

                }
            }
            for (const segment of self.#segments) {
                segment.x1.beginElement()
                segment.x2.beginElement()
                segment.y1.beginElement()
                segment.y2.beginElement()
            }
            for (const vertex of self.#vertices) {
                vertex.cx.beginElement()
                vertex.cy.beginElement()
            }

            yield 0;

            const first = self.#segments[0];
            const last = self.#segments.at(-1);
            const lastVertex = self.#vertices.at(-1);

            last.values.x1 = -wu + self.#props.padding.width;
            last.self.setAttribute("x1", last.values.x1)
            last.values.x2 = self.#props.padding.width;
            last.self.setAttribute("x2", last.values.x2)
            
            lastVertex.values.cx = last.values.x1;
            lastVertex.self.setAttribute("cx", lastVertex.values.cx);
            
            last.values.y1 = ((self.#props.values[0] - min) * hu) + self.#props.padding.height;
            last.self.setAttribute("y1", last.values.y1);
            last.values.y2 = first.values.y1;
            last.self.setAttribute("y2", last.values.y2);
            
            lastVertex.values.cy = last.values.y1
            lastVertex.self.setAttribute("cy", lastVertex.values.cy);

            self.#segments.unshift(self.#segments.pop());
            self.#vertices.unshift(self.#vertices.pop());
        }
    }
}

function createAnimateElement(attr, parent){
    const elem = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    elem.setAttribute("attributeName", attr);
    elem.setAttribute("repeatCount", "1");
    elem.setAttribute("dur", "500ms");
    elem.setAttribute("from", 0);
    elem.setAttribute("to", 0);
    parent.append(elem);
    return elem;
}

customElements.define("svg-chart", SVGChart);


function timeout(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    })
}

async function* gen(){
    const values = [10, 0, 15, 100, 7, 40, 3, 11, 12, 12, 20, 8, 4, 3];
    while (true) {
        for (const value of values) {
            const T = timeout(750);
            yield value
            await T;
        };
    }
}