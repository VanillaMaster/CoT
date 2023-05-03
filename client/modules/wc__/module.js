/**
@module moduleLoaderGui
@description Lorem ipsum dolor sit amet consectetur adipisicing elit.
Architecto quos voluptates accusantium mollitia odit est ullam cumque dignissimos amet.
Quo dolor labore autem quia porro, illum odit necessitatibus provident nulla. 
*/
import { html } from "#utilities";
import style from "./style.js";

define("wc", ["modalProvider"], function(modalProvider){


    const template = html`
    <div class="create-widget" style="display: flex;flex-direction: column;height: 100%;gap: 1em">
        <h1>Add new widget</h1>
        <select></select>
        <layout-viewport data-settings></layout-viewport>
        <div style="display: flex;flex-direction: row-reverse;">
            <button>create</button>
        </div>
    </div>
    `;

    const settingsView = /**@type { CustomComponents.Layout }*/(template.querySelector("[data-settings]"));
    const select = /**@type { HTMLSelectElement }*/(template.querySelector("select"));
    
    select.addEventListener("change", function(event) {
        settingsView.show(this.value)
    });
    
    modalProvider.define("create-widget", template);
    
    return {
        define(name, html, callback) {
            const section = document.createElement("section");
            section.dataset.name = name;
            section.append(html);
            
            const option = document.createElement("option");
            option.value = name;
            option.innerText = name;

            select.append(option);

            settingsView.append(section);
        },   
    }

});