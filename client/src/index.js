import "./moduleLoader/loader.js"



import { GridStack } from "./GridStack.js";
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
    <div class="menu">
        <ul>
            <li><button data-name="edit">${translation["grid.contextmenu.edit"]}</button></li>
        </ul>
    </div>
    `);
    const menu = contextMenu.querySelector(".menu");
    const btn = /**@type { const } */ ({
        /**@type { HTMLButtonElement }*/
        edit: contextMenu.querySelector(`[data-name="edit"]`)
    });
    document.body.append(contextMenu);

    menu.addEventListener("pointerdown", function(e) {
        e.stopPropagation();
    });
    document.addEventListener("pointerdown", function(e) {
        menu.removeAttribute("visible");
    });

    grid.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        e.stopPropagation();

        const { clientX: x, clientY: y } = e;
        menu.style.setProperty("--x", `${x}px`);
        menu.style.setProperty("--y", `${y}px`);

        menu.removeAttribute("visible");
        requestAnimationFrame(()=>{
            menu.setAttribute("visible","")
        })
    })

}

const grid = GridStack.init({
    column: 12,
    minRow: 1,
    maxRow: 12,
    cellHeight: "auto",
    disableOneColumnMode: true,
    float: true
});

const length = 3;
const widgets = new Array(length);
for (let i = 0; i < length; i++) {
    widgets[i] = createChartWidget(grid, gen(), { w:2, h: 2});
}

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
