import "./moduleLoader/loader.js"


import { applyEffect } from "./FluentRevealEffect.js"

import { translation } from "./lang.js";

import "../../proxy/src/patch.js";
//import "../tests/tmp.js"

import { createChartWidget } from "./widgets/ChartWidget.js";
import { gen } from "../tests/gen.js";

document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
});

{
    const grid = document.querySelector(".grid");

    const contextMenu = document.createRange().createContextualFragment(`
        <ul class="context-menu-list">
            <li><button data-name="edit">${translation["grid.contextmenu.edit"]}</button></li>
        </ul>
    `);
    
    const btn = /**@type { const } */ ({
        /**@type { HTMLButtonElement }*/
        edit: contextMenu.querySelector(`[data-name="edit"]`)
    });

    grid.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        e.stopPropagation();
        const { clientX: x, clientY: y } = e;
        window.modules.contextMenuProvider.show(contextMenu, x, y);
    })

}

/*
const grid = GridStack.init({
    column: 12,
    minRow: 1,
    maxRow: 12,
    cellHeight: "auto",
    disableOneColumnMode: true,
    float: true
});
*/

const grid = document.querySelector(".grid");

const length = 3;
const widgets = new Array(length);
for (let i = 0; i < length; i++) {
    widgets[i] = createChartWidget(grid, gen(), { w:2, h: 2});
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
