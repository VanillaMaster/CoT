import { html } from "#utilities";

import { RequestBalancer } from "./RequestBalancer.js";

define("PoEWidget", ["contextMenuProvider", "widgetProvider", "translator", "SVGChartProvider", "fetchProxyPatch"], function(contextMenuProvider, widgetProvider, translator){

    const chartWidgetContextMenu = document.createRange().createContextualFragment(`
        <ul class="context-menu-list">
            <li><button data-context-action="edit">${translator.translate("widget.chart.contextmenu.edit")}</button></li>
            <li><button data-context-action="delete">${translator.translate("widget.chart.contextmenu.delete")}</button></li>
            <hr noshade>
            <li><button data-context-action="hide">${translator.translate("widget.chart.contextmenu.hide")}</button></li>
        </ul>
    `);

    const chartWidgetTemplate = document.createRange().createContextualFragment(`
        <widget-container data-context-menu="widget">
            <svg-chart style="position: absolute; inset: 4px; background-color: #333;"></svg-chart>
        </widget-container>
    `);

    function ondelete(e) {
        this.remove();
    }

    contextMenuProvider.define("widget", chartWidgetContextMenu);

    const R = new RequestBalancer();
    const url = new URL("https://www.pathofexile.com/api/trade/exchange/Crucible");

    async function* gen(props){
        while (true) {
            const resp = await R.fetch(url, props);
            const data = await resp.json();
            const keys = Object.keys(data.result).slice(0, 3);
            //const [offer1, offfer2, offer3] = data.result;
            const offers = keys.map(k => data.result[k]);
            const first = offers[0];
    
            const offer = first.listing.offers[0];
            //console.log(offer);
            const price = offer.item.amount / offer.exchange.amount;
            //console.log(data, price);
            yield price;
        }
    }

    widgetProvider.define("PoE currency", html`
    <textarea data-name="config" style="
    --padding: .5em;
    height: calc(100% - (var(--padding) * 2));
    width: calc(100% - (var(--padding) * 2));
    resize: none;
    margin: 0px;
    border: none;
    padding: var(--padding);
    border-radius: 0.25em;">${
        JSON.stringify({
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
        }, undefined, 2)
    }</textarea>
    `,
    (data) => {
        const props = {
            method: "POST",
            body: data.config,
            headers: {
                "Content-Type": "application/json",
                "x-host": "www.pathofexile.com"
            }
        }

        const widget = chartWidgetTemplate.cloneNode(true);
        /**@type { CustomComponents.SVGChart } */
        const chart = widget.querySelector("svg-chart")
        chart.setSource(gen(props));
        chart.start();
    
        const widgetContainer = /**@type { CustomComponents.Widget } */ (widget.querySelector("widget-container"));
    
        widgetContainer.addEventListener("context:delete", ondelete);
        return widgetContainer;
    });
});