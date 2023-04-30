import "./moduleLoader/loader.js"

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

{
    /**@type {CustomComponents.Layout} */
    const viewport = document.querySelector(`[data-name="app-viewport"]`);

    /**@type {HTMLButtonElement} */
    const settingsBtn = /**@type { any }*/(document.getElementById("btn-layout-settings"));
    /**@type {HTMLButtonElement} */
    const homeBtn = /**@type { any }*/(document.getElementById("btn-layout-home"));

    settingsBtn.addEventListener("click", (e)=>{
        viewport.show("settings");
    })
    
    homeBtn.addEventListener("click", (e)=>{
        viewport.show("widget-grid");
    })
}


const grid = document.querySelector(".grid");

const length = 3;
const widgets = new Array(length);
for (let i = 0; i < length; i++) {
    widgets[i] = createChartWidget(gen());
}

grid.append(...widgets);
