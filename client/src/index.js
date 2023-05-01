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

    window.app.modules.contextMenuProvider.define("main", contextMenu);
}

{
    /**@type {CustomComponents.Layout} */
    const viewport = document.querySelector(`[data-name="app-viewport"]`);

    /**@type {HTMLButtonElement} */
    const settingsBtn = /**@type { any }*/(document.getElementById("btn-layout-settings"));
    /**@type {HTMLButtonElement} */
    const homeBtn = /**@type { any }*/(document.getElementById("btn-layout-home"));
    /**@type {HTMLButtonElement} */
    const popupBtn = /**@type { any }*/(document.getElementById("btn-layout-popup"));



    settingsBtn.addEventListener("click", (e)=>{
        viewport.show("settings");
    })
    
    homeBtn.addEventListener("click", (e)=>{
        viewport.show("widget-grid");
    })

    popupBtn.addEventListener("click", (e)=>{
        window.app.modules.modalProvider.show("");
    })
}


const grid = document.querySelector(".grid");

const length = 3;
const widgets = new Array(length);
for (let i = 0; i < length; i++) {
    widgets[i] = createChartWidget(gen());
}

/*

import { RequestBalancer } from "./RequestBalancer.js";
const url = new URL("https://www.pathofexile.com/api/trade/exchange/Standard");

const body = {
    "query": {
        "status": {
            "option": "online"
        },
        "have": [
            "divine"
        ],
        "want": [
            "chaos"
        ]
    },
    "sort": {
        "have": "asc"
    },
    "engine": "new"
}

const props = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
        "Content-Type": "application/json",
        "x-host": "www.pathofexile.com"
    }
}

const R = new RequestBalancer();


widgets[0] = createChartWidget((async function*(){
    while (true) {
        const resp = await R.fetch(url, props);
        const data = await resp.json();
        const keys = Object.keys(data.result).slice(0, 3);
        //const [offer1, offfer2, offer3] = data.result;
        const offers = keys.map(k => data.result[k]);
        const first = offers[0];

        const offer = first.listing.offers[0];
        console.log(offer);
        const price = offer.item.amount / offer.exchange.amount;
        console.log(data, price);
        yield price;
    }
})())

*/

grid.append(...widgets);
