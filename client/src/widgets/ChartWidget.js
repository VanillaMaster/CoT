import "../graph.js";
import { translation } from "../lang.js";

const chartWidgetContextMenu = document.createRange().createContextualFragment(`
    <ul class="context-menu-list">
        <li><button data-name="edit">${translation["widget.chart.contextmenu.edit"]}</button></li>
        <li><button data-name="delete">${translation["widget.chart.contextmenu.delete"]}</button></li>
        <hr noshade>
        <li data-name="hide"><button>${translation["widget.chart.contextmenu.hide"]}</button></li>
    </ul>
`);
const btn = /**@type { const } */ ({
    /**@type { HTMLButtonElement }*/
    delete: chartWidgetContextMenu.querySelector(`[data-name="delete"]`)
});


const chartWidgetTemplate = document.createRange().createContextualFragment(`
<div>
    <div class="grid-stack-item-content">
        <svg-chart style="position: absolute; inset: 4px; background-color: #333;"></svg-chart>
    </div>
</div>
`);

let target = null;

btn.delete.addEventListener("click", function(e) {
    target.remove();
    window.modules.contextMenuProvider.close();
})

/**
 * 
 * @param {GridStack} grid 
 * @param {*} source 
 * @param {*} opts 
 */
export function createChartWidget(grid, source, opts) {
    /**@type { DocumentFragment } */
    const widget = chartWidgetTemplate.cloneNode(true);
    /**@type { SVGChart } */
    const chart = widget.querySelector("svg-chart")
    chart.setSource(source);
    chart.start();

    const element = grid.addWidget(widget.children[0], opts);

    const content = element.querySelector(".grid-stack-item-content");

    content.addEventListener("contextmenu", function(e) {
        target = element;
        e.preventDefault();
        e.stopPropagation();
        const { clientX: x, clientY: y } = e;
        window.modules.contextMenuProvider.show(chartWidgetContextMenu, x, y)
    })

    return element;
}