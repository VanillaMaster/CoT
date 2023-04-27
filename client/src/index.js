import "./moduleLoader/loader.js"

import { applyEffect } from "./FluentRevealEffect.js"

import { translation } from "./lang.js";

import "../../proxy/src/patch.js";

import { createChartWidget } from "./widgets/ChartWidget.js";
import { gen } from "../tests/gen.js";


{
    /**@type { HTMLElement } */
    const grid = document.querySelector(".grid");
    grid.dataset.contextMenu = "main";

    const contextMenu = document.createRange().createContextualFragment(`
        <ul class="context-menu-list">
            <li><button data-context-action="edit">${translation["grid.contextmenu.edit"]}</button></li>
        </ul>
    `);

    window.modules.contextMenuProvider.define("main", contextMenu);
}


const grid = document.querySelector(".grid");

const length = 3;
const widgets = new Array(length);
for (let i = 0; i < length; i++) {
    widgets[i] = createChartWidget(gen());
}

grid.append(...widgets);
