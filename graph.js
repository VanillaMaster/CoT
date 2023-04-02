
class SVGChart extends HTMLElement {

    static template = document.createRange().createContextualFragment(`
        <style>
            svg line {
                transform-origin: center bottom;
                stroke: #0074d9;
                stroke-width: 2;
                stroke-linecap: round;
                transition: all 150ms steps(4);
            }
            svg line {
                translate: var(--delta-x, 0) var(--delta-y, 0);
                scale: 1 var(--length-scale, 1);
                rotate: var(--rotate, 0);
            }
        </style>

        <svg transform-origin="center" viewBox="0 0 1000 500" style="position: absolute;bottom: 0;right: 0;height: 100%;"></svg>
    `);

    constructor(){
        super();
        this.#shadow = this.attachShadow({mode: "closed"});
        this.#shadow.append(SVGChart.template.cloneNode(true));
        this.#svg = this.#shadow.querySelector("svg");

        const g = drow(this.#svg);
        g.next();

        (async ()=>{
            while (true) {
                g.next();
                await timeout(1010);
            }
        })()
    }
    #shadow;
    #svg;

    #gen = gen();

    async start(){
        for await (const val of this.#gen) {
            this.push(val)
        }
    }

    #values = [];
    #maxLength = 10;

    #padding = 0.1;

    push(value) {
        this.#values.unshift(value);
        if (this.#values.length > this.#maxLength) {
            this.#values.pop();
        }
        if (this.#values.length > 1) {
            this.redraw();
        }
    }
}

function createAnimateElement(attr, parent){
    const elem = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    elem.setAttribute("attributeName", attr);
    elem.setAttribute("repeatCount", "1");
    elem.setAttribute("dur", "1s");
    elem.setAttribute("from", 0);
    elem.setAttribute("to", 0);
    parent.append(elem);
    return elem;
}

/**
 * @param { SVGElement } svg 
 */
function* drow(svg){

    const height = 500;
    const width = 1000;
    const values = [0, 10, 1, 15, 7, 40, 3, 11, 12, 12, 20, 8];

    const g = gen2();

    const length = 10;

    /**@type {  {self: SVGLineElement, x1: SVGAnimateElement, x2: SVGAnimateElement, y1: SVGAnimateElement, y2: SVGAnimateElement, values: {x1: number, x2: number, y1: number, y2: number}}[]} */
    const segments = [];

    for (let i = 0; i <= length; i++) {
        const self = document.createElementNS("http://www.w3.org/2000/svg", "line");
        /**@type { (typeof segments)[number] } */
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
        self.setAttribute( "x1", width / 2)
        self.setAttribute( "x2", width / 2)
        self.setAttribute( "y1", 0)
        self.setAttribute( "y2", height)
        
        segments.push(segment);
        svg.append(self);
    }

    while (true) {
        const min = Math.min.apply(undefined, values.slice(1))
        const max = Math.max.apply(undefined, values.slice(1))
        const range = max - min;

        const hu = height / range;
        const wu = width / length;

        let x1 = null, x2 = null, y1 = null, y2 = null;
        let i = -1;
        for (const value of values) {
            x1 = x2;
            y1 = y2;
            x2 = (i) * wu;
            y2 = height - ((value - min) * hu);
            if ( (x1 != null && x2 != null) && (y1 != null && y2 != null) ) {
                const segment = segments[i];

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
            }

            i++;
        }

        for (const segment of segments) {
            segment.x1.beginElement()
            segment.x2.beginElement()
            segment.y1.beginElement()
            segment.y2.beginElement()
        }

        
        
        yield true;

        const { value } = g.next();
        values.push(value);
        values.shift();

        const first = segments.shift();
        const last = segments.at(-1);

        first.self.setAttribute("x1", width)
        first.values.x1 = width;
        first.self.setAttribute("x2", width + wu)
        first.values.x2 = width + wu;
        
        first.values.y1 = last.values.y2;
        first.self.setAttribute("y1", first.values.y1);

        first.values.y2 = height - ((values.at(-1) - min) * hu);
        first.self.setAttribute("y2", first.values.y2);

        segments.push(first);
    }
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
            const T = timeout(1000);
            yield value
            await T;
        };
    }
}

function* gen2(){
    const values = [10, 0, 15, 100, 7, 40, 3, 11, 12, 12, 20, 8, 4, 3];
    while (true) {
        for (const value of values) {
            yield value
        };
    }
}