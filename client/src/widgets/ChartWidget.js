import "../graph.js";
import { translation } from "../lang.js";

const chartWidgetContextMenu = document.createRange().createContextualFragment(`
    <ul class="context-menu-list">
        <li><button data-context-action="edit">${translation["widget.chart.contextmenu.edit"]}</button></li>
        <li><button data-context-action="delete">${translation["widget.chart.contextmenu.delete"]}</button></li>
        <hr noshade>
        <li><button data-context-action="hide">${translation["widget.chart.contextmenu.hide"]}</button></li>
    </ul>
`);

window.addEventListener("module:afterLoad", ()=>{
    window.modules.contextMenuProvider.define("widget", chartWidgetContextMenu);
}, {once: true});


const chartWidgetTemplate = document.createRange().createContextualFragment(`
<widget-container data-context-menu="widget">
    <svg-chart style="position: absolute; inset: 4px; background-color: #333;"></svg-chart>
</widget-container>
`);


/**
 * @param {*} source 
 */
export function createChartWidget(source) {
    /**@type { DocumentFragment } */
    const widget = /**@type {any} */(chartWidgetTemplate.cloneNode(true));
    /**@type { import("../graph.js").SVGChart } */
    const chart = widget.querySelector("svg-chart")
    chart.setSource(source);
    chart.start();

    const widgetContainer = widget.querySelector("widget-container");

    widgetContainer.addEventListener("context:delete", function(e) {
        this.remove();
    });
    return widget;
}