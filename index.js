import './node_modules/gridstack/dist/gridstack-all.js';
import "./node_modules/fluent-reveal-effect/dist/main.js"
/**@type { import("gridstack")["GridStack"] } */
const GridStack = window["GridStack"];
/**@type { import("fluent-reveal-effect") } */
const { applyEffect } = window["fluent-reveal-effect"];

import "./graph.js";


const grid = GridStack.init({
    column: 12,
    minRow: 1,
    maxRow: 12,
    cellHeight: "auto",
    disableOneColumnMode: true,
    float: true
});


grid.float(true);

const widgets = [
    grid.addWidget({ w:2, h: 2, content: `<svg-chart style="position: absolute;inset: 4px;background-color: #333;"></svg-chart>`}),
    grid.addWidget({ w:2, h: 2, content: `<svg-chart style="position: absolute;inset: 4px;background-color: #333;"></svg-chart>`}),
    grid.addWidget({ w:2, h: 2, content: `<svg-chart style="position: absolute;inset: 4px;background-color: #333;"></svg-chart>`})
];

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
console.log(widgets);
