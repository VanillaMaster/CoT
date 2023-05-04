import style from "./style.js";

export class SVGChart extends HTMLElement {
    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#shadow.append(SVGChart.template.cloneNode(true));

        this.#svg = /**@type { SVGSVGElement } */ (this.#shadow.querySelector("svg"));

        this.#segmentsContainer = this.#svg.getElementById("segments");
        this.#verticesContainer = this.#svg.getElementById("vertices");
        this.#labelsContainer = this.#svg.getElementById("labels");

        this.#shadow.adoptedStyleSheets = [SVGChart.style];
    }

    static template = document.createRange().createContextualFragment(
        `<svg transform="scale(-1, -1)" transform-origin="center" viewBox="0 0 1000 500">
            <g id="segments"></g>
            <g id="vertices"></g>
            <g id="labels"></g>
        </svg>`
    );

    static style = new CSSStyleSheet();
    static {
        this.style.replace(style)
    }

    connectedCallback(){
        SVGChart.observer.observe(this);
    }
    disconnectedCallback(){
        SVGChart.observer.unobserve(this);
    }
    
    remove(){
        this.stop();
        super.remove();
    }

    #shadow;

    #svg;

    #segmentsContainer;
    #verticesContainer;
    #labelsContainer;

    /**@type { SVGChartInnerType.Segment[] } */
    #segments = [];
    /**@type { SVGChartInnerType.Vertex[] } */
    #vertices = [];
    /**@type { SVGChartInnerType.Label[] } */
    #labels = [];
    /**@type {AsyncGenerator<number, void, void>} */
    #gen;

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

    /**
     * @param {AsyncGenerator<number, void, void>} generator 
     */
    setSource(generator){
        this.#gen = generator;
    }

    /**@private */
    async run(){
        while (this.#props.working) {
            const { value: next } = await this.#gen.next()
            this.push(next);
        }
        /*
        for await (const next of this.#gen) {
            if (this.#props.working == false) { break; }
        }
        */
    }

    start(){
        if (this.#props.working) return false;
        this.#props.working = true;
        this.run();
        return true;
    }
    stop(){
        this.#props.working = false;
    }

    /**@private */
    push(value) {
        this.#props.values.unshift(value);
        if (this.#props.values.length - this.#props.length > 2) {
            this.#props.values.pop();
        }
        if (this.#props.values.length > 1) {
            this.#draw.next();
        }
    }

    updateElements() {
        const predictedLength = (this.#props.length + 1);
        if (this.#props.values.length > predictedLength) {
            this.#props.values.length = predictedLength;
        }

        this.updateSegments();
        this.updateVertices();
        this.updateLabels();
    }

    /**@private */
    updateLabels() {
        //remove excess
        while (this.#labels.length - this.#props.length > 1) {
            const vertex = this.#labels.pop();
            vertex.self.remove();
        }
        //add new
        while (this.#labels.length - this.#props.length < 2) {
            const self = document.createElementNS("http://www.w3.org/2000/svg", "text");
            const text = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            /**@type { SVGChartInnerType.Label } */
            const vertex = {
                self,
                x: createAnimateElement("x", self),
                y: createAnimateElement("y", self),
                text,
                values: {
                    x: 0,
                    y: 0
                }
            }
            self.setAttribute("x", `${0}`)
            self.setAttribute("y", `${0}`)
            self.append(text);

            this.#labels.push(vertex)
            this.#labelsContainer.append(self);
        }
    }

    /**@private */
    updateVertices() {
        //remove excess
        while (this.#vertices.length - this.#props.length > 1) {
            const vertex = this.#vertices.pop();
            vertex.self.remove();
        }
        //add new
        while (this.#vertices.length - this.#props.length < 2) {
            const self = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            /**@type { SVGChartInnerType.Vertex } */
            const vertex = {
                self,
                cx: createAnimateElement("cx", self),
                cy: createAnimateElement("cy", self),
                values: {
                    cx: 0,
                    cy: 0
                }
            }
            self.setAttribute("cx", `${0}`)
            self.setAttribute("cy", `${0}`)

            this.#vertices.push(vertex)
            this.#verticesContainer.append(self);
        }
    }

    /**@private */
    updateSegments() {
        //remove excess
        while (this.#segments.length > this.#props.length) {
            const segment = this.#segments.pop();
            segment.self.remove();
        }
        //add new
        while (this.#segments.length <= this.#props.length) {
            const self = document.createElementNS("http://www.w3.org/2000/svg", "line");
            /**@type { SVGChartInnerType.Segment } */
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
                }
            };
            self.setAttribute("x1", `${0}`)
            self.setAttribute("x2", `${0}`)
            self.setAttribute("y1", `${0}`)
            self.setAttribute("y2", `${0}`)

            this.#segments.push(segment)
            this.#segmentsContainer.append(self);
        }
    }

    /**@type {Generator<void, void, void>} */
    #draw = SVGChart.drawer(this);

    static observer = new ResizeObserver((entries) => {
        for (const entry of /**@type { (ResizeObserverEntry & { target: SVGChart})[] } */ (entries)) {
            if (entry.contentRect.height === 0 && entry.contentRect.width === 0) continue;
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
            const labelIter = self.#labels[Symbol.iterator]();

            for (const value of self.#props.values) {
                x1 = x2;
                y1 = y2;
                x2 = (i++ * wu) + self.#props.padding.width;
                y2 = ((value - min) * hu) + self.#props.padding.height;

                /**@type { {value: SVGChartInnerType.Label} } */
                const { value: label } = labelIter.next();
                if (label != undefined) {
                    label.x.setAttribute("from", `${label.values.x}`);
                    label.x.setAttribute("to", `${x2}`);
                    label.self.setAttribute("x", `${x2}`);
                    label.values.x = x2;

                    label.y.setAttribute("from", `${label.values.y}`);
                    label.y.setAttribute("to", `${y2}`);
                    label.self.setAttribute("y", `${y2}`);
                    label.values.y = y2;

                    label.text.textContent = `${value}`;
                } else {
                    console.error("label not found");
                }

                /**@type { {value: SVGChartInnerType.Vertex} } */
                const { value: vertex } = vertexIter.next();
                if (vertex != undefined) {
                    vertex.cx.setAttribute("from", `${vertex.values.cx}`);
                    vertex.cx.setAttribute("to", `${x2}`);
                    vertex.self.setAttribute("cx", `${x2}`);
                    vertex.values.cx = x2;

                    vertex.cy.setAttribute("from", `${vertex.values.cy}`);
                    vertex.cy.setAttribute("to", `${y2}`);
                    vertex.self.setAttribute("cy", `${y2}`);
                    vertex.values.cy = y2;
                } else {
                    console.error("vertex not found");
                }

                if ((x1 != null && x2 != null) && (y1 != null && y2 != null)) {
                    /**@type { {value: SVGChartInnerType.Segment} } */
                    const { value: segment } = segmentIter.next();
                    if (segment != undefined) {
                        segment.x1.setAttribute("from", `${segment.values.x1}`);
                        segment.x1.setAttribute("to", `${x1}`);
                        segment.self.setAttribute("x1", `${x1}`);
                        segment.values.x1 = x1;

                        segment.x2.setAttribute("from", `${segment.values.x2}`);
                        segment.x2.setAttribute("to", `${x2}`);
                        segment.self.setAttribute("x2", `${x2}`);
                        segment.values.x2 = x2;

                        segment.y1.setAttribute("from", `${segment.values.y1}`);
                        segment.y1.setAttribute("to", `${y1}`);
                        segment.self.setAttribute("y1", `${y1}`);
                        segment.values.y1 = y1;

                        segment.y2.setAttribute("from", `${segment.values.y2}`);
                        segment.y2.setAttribute("to", `${y2}`);
                        segment.self.setAttribute("y2", `${y2}`);
                        segment.values.y2 = y2;

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
            for (const label of self.#labels) {
                label.x.beginElement()
                label.y.beginElement()
            }

            yield;

            const first = self.#segments[0];
            const last = self.#segments.at(-1);
            const lastVertex = self.#vertices.at(-1);
            const lastLabel = self.#labels.at(-1);

            last.values.x1 = -wu + self.#props.padding.width;
            last.self.setAttribute("x1", `${last.values.x1}`)
            last.values.x2 = self.#props.padding.width;
            last.self.setAttribute("x2", `${last.values.x2}`)

            lastVertex.values.cx = last.values.x1;
            lastVertex.self.setAttribute("cx", `${lastVertex.values.cx}`);
            
            lastLabel.values.x = last.values.x1;
            lastLabel.self.setAttribute("x", `${lastLabel.values.x}`);

            last.values.y1 = ((self.#props.values[0] - min) * hu) + self.#props.padding.height;
            last.self.setAttribute("y1", `${last.values.y1}`);
            last.values.y2 = first.values.y1;
            last.self.setAttribute("y2", `${last.values.y2}`);

            lastVertex.values.cy = last.values.y1
            lastVertex.self.setAttribute("cy", `${lastVertex.values.cy}`);

            lastLabel.values.y = last.values.y1;
            lastLabel.self.setAttribute("y", `${lastLabel.values.y}`);

            self.#segments.unshift(self.#segments.pop());
            self.#vertices.unshift(self.#vertices.pop());
            self.#labels.unshift(self.#labels.pop());
        }
    }
}

function createAnimateElement(attr, parent) {
    const elem = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    elem.setAttribute("attributeName", attr);
    elem.setAttribute("repeatCount", "1");
    elem.setAttribute("dur", "500ms");
    elem.setAttribute("from", `${0}`);
    elem.setAttribute("to", `${0}`);
    parent.append(elem);
    return elem;
}