/**
@module moduleLoaderGui
@description Lorem ipsum dolor sit amet consectetur adipisicing elit.
Architecto quos voluptates accusantium mollitia odit est ullam cumque dignissimos amet.
Quo dolor labore autem quia porro, illum odit necessitatibus provident nulla. 
*/
import { html } from "#utilities";
import style from "./style.js";

import * as modalProvider from "#modalProvider"
import * as WidgetGridProvider from "#WidgetGridProvider"
import * as UI from "#UI"


const template = html`
<div class="create-widget" style="display: flex;flex-direction: column;height: 100%;gap: 1em">
    <h1>Add new widget</h1>
    <select>
        <option value="none" selected hidden>choose an option</option>
    </select>
    <layout-viewport data-settings style="--padding: 0px;"></layout-viewport>
    <div style="display: flex;flex-direction: row-reverse;">
        <button>create</button>
    </div>
</div>
`;

/**@type { Map<string, { callback: (data: {[name: string]: string;}) => CustomComponents.Widget; root: HTMLElement}> } */
export const registry = new Map();

const settingsView = /**@type { CustomComponents.Layout }*/(template.querySelector("[data-settings]"));
const select = /**@type { HTMLSelectElement }*/(template.querySelector("select"));

const grid = document.querySelector(".grid");

let active = "none";
const createBtn = /**@type { HTMLButtonElement }*/(template.querySelector("button"));
createBtn.addEventListener("click", function(e) {
    if (active == "none") return;
    const { callback, root } = registry.get(active);
    /**@type { { [name: string]: string; } } */
    const data = {};
    for (const element of /**@type { NodeListOf<HTMLInputElement> }*/(root.querySelectorAll("[data-name]"))) {
        data[element.dataset.name] = element.value ?? element.innerText;
    }
    const widget = callback(data);
    grid.append(widget);
    modalProvider.close();

    select.value = "none";
    select.dispatchEvent(new Event("change"));
});

select.addEventListener("change", function(event) {
    active = this.value;
    settingsView.show(this.value);
});

modalProvider.define("create-widget", template);


export function define(name, html, callback) {
    const section = document.createElement("section");
    section.dataset.name = name;
    section.append(html);
    
    const option = document.createElement("option");
    option.value = name;
    option.innerText = name;
    
    registry.set(name, {
        root: section,
        callback
    });

    select.append(option);

    settingsView.append(section);
}

{

    const chartWidgetTemplate = document.createRange().createContextualFragment(`
        <widget-container data-context-menu="widget">
            <svg-chart style="position: absolute; inset: 4px; background-color: #333;"></svg-chart>
        </widget-container>
    `);

    function ondelete(e) {
        this.remove();
    }

    function timeout(timeout) {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        })
    }
    async function* gen__() {
        const values = [10, 0, 15, 100, 7, 40, 3, 11, 12, 12, 20, 8, 4, 3];
        while (true) {
            for (const value of values) {
                const T = timeout(750);
                yield value
                await T;
            };
        }
    }
    
    define("test", html``,
    (data) => {
    
        const widget = chartWidgetTemplate.cloneNode(true);
        /**@type { CustomComponents.SVGChart } */
        const chart = widget.querySelector("svg-chart")
        chart.setSource(gen__());
        chart.start();
    
        const widgetContainer = /**@type { CustomComponents.Widget } */ (widget.querySelector("widget-container"));
    
        widgetContainer.addEventListener("context:delete", ondelete);
        return widgetContainer;
    });
    
}

// define("widgetProvider", ["modalProvider", "WidgetGridProvider"], function(modalProvider){

//     const template = html`
//     <div class="create-widget" style="display: flex;flex-direction: column;height: 100%;gap: 1em">
//         <h1>Add new widget</h1>
//         <select>
//             <option value="none" selected hidden>choose an option</option>
//         </select>
//         <layout-viewport data-settings style="--padding: 0px;"></layout-viewport>
//         <div style="display: flex;flex-direction: row-reverse;">
//             <button>create</button>
//         </div>
//     </div>
//     `;

//     /**@type { Map<string, { callback: (data: {[name: string]: string;}) => CustomComponents.Widget; root: HTMLElement}> } */
//     const registry = new Map();

//     const settingsView = /**@type { CustomComponents.Layout }*/(template.querySelector("[data-settings]"));
//     const select = /**@type { HTMLSelectElement }*/(template.querySelector("select"));
    
//     const grid = document.querySelector(".grid");

//     let active = "none";
//     const createBtn = /**@type { HTMLButtonElement }*/(template.querySelector("button"));
//     createBtn.addEventListener("click", function(e) {
//         if (active == "none") return;
//         const { callback, root } = registry.get(active);
//         /**@type { { [name: string]: string; } } */
//         const data = {};
//         for (const element of /**@type { NodeListOf<HTMLInputElement> }*/(root.querySelectorAll("[data-name]"))) {
//             data[element.dataset.name] = element.value ?? element.innerText;
//         }
//         const widget = callback(data);
//         grid.append(widget);
//         modalProvider.close();

//         select.value = "none";
//         select.dispatchEvent(new Event("change"));
//     });

//     select.addEventListener("change", function(event) {
//         active = this.value;
//         settingsView.show(this.value);
//     });
    
//     modalProvider.define("create-widget", template);
    
//     return {
//         define(name, html, callback) {
//             const section = document.createElement("section");
//             section.dataset.name = name;
//             section.append(html);
            
//             const option = document.createElement("option");
//             option.value = name;
//             option.innerText = name;
            
//             registry.set(name, {
//                 root: section,
//                 callback
//             });

//             select.append(option);

//             settingsView.append(section);
//         },
//         registry
//     }

// });