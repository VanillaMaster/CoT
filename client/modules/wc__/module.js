/**
@module moduleLoaderGui
@description Lorem ipsum dolor sit amet consectetur adipisicing elit.
Architecto quos voluptates accusantium mollitia odit est ullam cumque dignissimos amet.
Quo dolor labore autem quia porro, illum odit necessitatibus provident nulla. 
*/
import { html } from "#utilities";

const template = html`
<div class="create-widget" style="display: flex;flex-direction: column;height: 100%;gap: 1em">
    <h1>Add new widget</h1>
    <select>
        <option value="">widget 1</option>
        <option value="">widget 2</option>
        <option value="">widget 3</option>
    </select>
    <section style="flex-grow: 1;overflow-x:hidden; overflow-y: auto"></section>
    <div style="display: flex;flex-direction: row-reverse;">
        <button>create</button>
    </div>
</div>
`;

//console.log(template);

window.addEventListener("module:load", ()=>{
    window.app.modules.wc = {
        define(name, html, callback) {
            
        },   
    }
}, {once: true});

window.addEventListener("module:load", ()=>{
    window.app.modules.wc = {
        define(name, html, callback) {
            
        },   
    }
}, {once: true});

window.addEventListener("module:afterLoad", ()=>{
    window.app.modules.modalProvider.define("create-widget", template);
}, {once: true});
