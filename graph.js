/**
 * @typedef { {self: SVGLineElement, x1: SVGAnimateElement, x2: SVGAnimateElement, y1: SVGAnimateElement, y2: SVGAnimateElement, values: {x1: number, x2: number, y1: number, y2: number}, represents: number} } Segment
*/

const RO = new ResizeObserver((entries)=>{
    for (const entry of entries) {
        const relativeStep = entry.contentRect.height / entry.target.height;
        const relativeWidth = entry.contentRect.width / relativeStep;
        const stepsWidth = Math.ceil(relativeWidth / entry.target.stepSize);
        const width = stepsWidth * entry.target.stepSize;
        entry.target.width = width;
    }
});


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
    :host(*) {
        height: 100px;
        width: 100px;
        position: relative;
        overflow: hidden;
        display: block;
    }`
);
console.log(style);

const template = document.createRange().createContextualFragment(
    '<svg transform="scale(-1, -1)" transform-origin="center" viewBox="0 0 1000 500" style="position: absolute;bottom: 0;right: 0;height: 100%;"></svg>'
);


class SVGChart extends HTMLElement {
    constructor(){
        super();
        this.#shadow = this.attachShadow({mode: "closed"});
        this.#shadow.append(template.cloneNode(true));
        this.#svg = this.#shadow.querySelector("svg");

        this.#shadow.adoptedStyleSheets = [style];

        RO.observe(this);

        const g = gen();
        (async () => {
            for await (const v of g) {
                this.push(v);
            }
        })();
    }
    #shadow;
    #svg;

    #props = {
        length: 10,
        working: false
    }

    /**@type {number[]} */
    #values = [];

    /**@type { Segment[] } */
    #segments = [];

    get #length(){
        return this.#props.length;
    }
    set #length(value){
        this.#props.length = value;
        this.updateSegments();
    }

    #width = "asd";
    get width(){
        return this.#width;
    }
    set width(value) {
        if (this.#width == value) return;
        this.#width = value;
        this.#length = value / this.stepSize;
        this.#svg.setAttribute("viewBox", `0 0 ${this.#width} ${this.#height}`);
    }

    #height = 500;
    get height(){
        return this.#height;
    }

    #stepSize = 100;
    get stepSize(){
        return this.#stepSize;
    }

    push(value) {
        this.#values.unshift(value);
        if (this.#values.length > 1) {
            this.#draw.next();
        }
        if (this.#values.length - this.#length > 1) {
            this.#values.pop();
        }
    }

    updateSegments(){
        const predictedLength = (this.#length + 1);
        if (this.#values.length > predictedLength) {
            this.#values.length = predictedLength;
        }

        //remove excess
        while (this.#segments.length > this.#length) {
            const segment = this.#segments.pop();
            segment.self.remove();
        }
        //add new
        while (this.#segments.length <= this.#length) {
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
            this.#svg.append(self);
        }
    }

    /**@type {Generator<void, void, void>} */
    #draw = SVGChart.drawer(this);

    /**
     * @param { SVGChart } self 
     */
    static *drawer(self) {
        while (true) {
            //debugger
            const targetValues = self.#values.slice(0, self.#length + 1);
            const min = Math.min.apply(undefined, targetValues)
            const max = Math.max.apply(undefined, targetValues)
            const range = Math.max(max - min, 1);
    
            const hu = self.#height / range;
            const wu = self.#width / self.#props.length;

            let x1 = null, x2 = null, y1 = null, y2 = null;
            let i = 0;

            const segmentIter = self.#segments[Symbol.iterator]();
            for (const value of self.#values) {
                x1 = x2;
                y1 = y2;
                x2 = (i) * wu;
                y2 = ((value - min) * hu);

                if ( (x1 != null && x2 != null) && (y1 != null && y2 != null) ) {
                    /**@type { {value: Segment} } */
                    const { value: segment } = segmentIter.next();
                    if (window.dbg === true) {
                        debugger;
                    }
                    if (segment == undefined) {
                        console.log("err");
                        debugger;
                        continue;
                    }
                    //debugger;
    
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
                }
    
                i++;
            }
            for (const segment of self.#segments) {
                segment.x1.beginElement()
                segment.x2.beginElement()
                segment.y1.beginElement()
                segment.y2.beginElement()
            }

            yield 0;

            const first = self.#segments[0];
            const last = self.#segments.at(-1);

            last.values.x1 = -wu;
            last.self.setAttribute("x1", last.values.x1)
            last.values.x2 = 0;
            last.self.setAttribute("x2", last.values.x2)
            
            last.values.y1 = ((self.#values[0] - min) * hu);
            last.self.setAttribute("y1", last.values.y1);
    
            last.values.y2 = first.values.y1;
            last.self.setAttribute("y2", last.values.y2);

            self.#segments.unshift(self.#segments.pop());
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