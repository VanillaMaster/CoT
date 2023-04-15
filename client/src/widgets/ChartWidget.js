import "../graph.js";
const grid = document.querySelector(".grid");

const chartWidgetContextMenu = document.createRange().createContextualFragment(`
<div class="menu">
    <ul>
        <li><button data-name="edit">Edit</button></li>
        <li><button data-name="delete">Delete</button></li>
        <hr noshade>
        <li data-name="hide"><button>hide</button></li>
    </ul>
</div>
`);

const menu = chartWidgetContextMenu.querySelector(".menu");
const btn = /**@type { const } */ ({
    /**@type { HTMLButtonElement }*/
    delete: menu.querySelector(`[data-name="delete"]`)
});
document.body.append(chartWidgetContextMenu);


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
    menu.removeAttribute("visible");
})
menu.addEventListener("pointerdown", function(e) {
    e.stopPropagation();
});
document.addEventListener("pointerdown", function(e) {
    menu.removeAttribute("visible");
});

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
        menu.style.setProperty("--x", `${x}px`);
        menu.style.setProperty("--y", `${y}px`);

        menu.removeAttribute("visible");
        requestAnimationFrame(()=>{
            menu.setAttribute("visible","")
        })
    })

    return element;
}