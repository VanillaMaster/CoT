import { translation } from "#lang";
import { html } from "#utilities";

import { gen } from "../../tests/gen.js";

define("PoEWidget", ["contextMenuProvider", "widgetProvider"], function(contextMenuProvider, widgetProvider){

    const chartWidgetContextMenu = document.createRange().createContextualFragment(`
        <ul class="context-menu-list">
            <li><button data-context-action="edit">${translation["widget.chart.contextmenu.edit"]}</button></li>
            <li><button data-context-action="delete">${translation["widget.chart.contextmenu.delete"]}</button></li>
            <hr noshade>
            <li><button data-context-action="hide">${translation["widget.chart.contextmenu.hide"]}</button></li>
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
        const widget = chartWidgetTemplate.cloneNode(true);
        /**@type { CustomComponents.SVGChart } */
        const chart = widget.querySelector("svg-chart")
        chart.setSource(gen());
        chart.start();
    
        const widgetContainer = /**@type { CustomComponents.Widget } */ (widget.querySelector("widget-container"));
    
        widgetContainer.addEventListener("context:delete", ondelete);
        return widgetContainer;
    });
});