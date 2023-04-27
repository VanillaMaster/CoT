import "./moduleLoader/loader.js"

import { applyEffect } from "./FluentRevealEffect.js"

import { translation } from "./lang.js";

import "../../proxy/src/patch.js";

import { createChartWidget } from "./widgets/ChartWidget.js";
import { gen } from "../tests/gen.js";


const grid = document.querySelector(".grid");

const length = 3;
const widgets = new Array(length);
for (let i = 0; i < length; i++) {
    widgets[i] = createChartWidget(gen());
}

grid.append(...widgets);


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
