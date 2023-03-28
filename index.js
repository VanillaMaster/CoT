import './node_modules/gridstack/dist/gridstack-all.js';
import "./node_modules/fluent-reveal-effect/dist/main.js"
/**@type { import("gridstack")["GridStack"] } */
const GridStack = window["GridStack"];
/**@type { import("fluent-reveal-effect") } */
const { applyEffect } = window["fluent-reveal-effect"];


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
    grid.addWidget({ w:2, h: 2, content: `<div class="item-border"><div class="item-container">Button 1</div></div>`}),
    grid.addWidget({ w:2, h: 2, content: `<div class="item-border"><div class="item-container">Button 2</div></div>`}),
    grid.addWidget({ w:2, h: 2, content: `<div class="item-border"><div class="item-container">Button 3</div></div>`})
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
