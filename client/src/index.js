import "./moduleLoader/index.js"

import { translation } from "#lang";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./worker.js")
}


require(["contextMenuProvider", "modalProvider", "LayoutManaget"], function(contextMenuProvider, modalProvider){
    /**@type { HTMLElement } */
    const grid = document.querySelector(".grid");
    grid.dataset.contextMenu = "main";
    
    const contextMenu = document.createRange().createContextualFragment(`
        <ul class="context-menu-list">
            <li><button data-context-action="add">${translation["grid.contextmenu.add"]}</button></li>
        </ul>
    `);

    grid.addEventListener("context:add", function(e) {
        modalProvider.show("create-widget");
    })
    
    contextMenuProvider.define("main", contextMenu);

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
        modalProvider.show("create-widget");
    })

    
});

// require(["SVGChartProvider"], function(){
//     const grid = document.querySelector(".grid");
//     const length = 3;
//     const widgets = new Array(length);
//     for (let i = 0; i < length; i++) {
//         widgets[i] = createChartWidget(gen());
//     }
//     grid.append(...widgets);
// })

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

