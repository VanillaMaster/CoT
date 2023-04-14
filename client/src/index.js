import { GridStack } from "./GridStack.js";
import { applyEffect } from "./FluentRevealEffect.js"

import "../../proxy/src/patch.js";
//import "../tests/tmp.js"

import "./graph.js";
import { init } from "./context.js";

function timeout(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    })
}

async function* gen() {
    const values = [10, 0, 15, 100, 7, 40, 3, 11, 12, 12, 20, 8, 4, 3];
    while (true) {
        for (const value of values) {
            const T = timeout(750);
            yield value
            await T;
        };
    }
}


const grid = GridStack.init({
    column: 12,
    minRow: 1,
    maxRow: 12,
    cellHeight: "auto",
    disableOneColumnMode: true,
    float: true
});


grid.float(true);

const container = document.createElement("div");
const wrapper = document.createElement("div");
wrapper.classList.add("grid-stack-item-content");
/**@type { SVGChart } */
const chart = document.createElement("svg-chart");

chart.style.position = "absolute";
chart.style.inset = "4px";
chart.style.backgroundColor = "#333";

wrapper.append(chart);
container.append(wrapper);

chart.setSource(gen());

const widgets = [
    grid.addWidget({ w:2, h: 2, content: `<svg-chart style="position: absolute;inset: 4px;background-color: #333;"></svg-chart>`}),
    grid.addWidget({ w:2, h: 2, content: `<svg-chart style="position: absolute;inset: 4px;background-color: #333;"></svg-chart>`}),
    grid.addWidget(container, { w:2, h: 2})
];

chart.start();

init(widgets);

/*
applyEffect('.grid', {
    clickEffect: false,
    lightColor: 'rgba(255,255,255,0.4)',
    gradientSize: 80,
    isContainer: true,
    children: {
        borderSelector: '.grid-stack-item-content',
        elementSelector: '.item-container',
        lightColor: 'rgba(255,255,255,0.1)',
        gradientSize: 80
    }
})
*/
