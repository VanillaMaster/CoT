/**
@module moduleLoaderGui
@description Lorem ipsum dolor sit amet consectetur adipisicing elit.
Architecto quos voluptates accusantium mollitia odit est ullam cumque dignissimos amet.
Quo dolor labore autem quia porro, illum odit necessitatibus provident nulla. 
*/

const modal = document.createRange().createContextualFragment(`
<ul>
    <li draggable="true" ondragstart="drag(event)">1</li>
    <li draggable="true">2</li>
    <li draggable="true">3</li>
    <li draggable="true" ondragover="allowDrop(event)">4</li>
</ul>
`)


window.addEventListener("module:load", ()=>{
    window.app.modules.moduleLoaderGui = {
        show() {
            /**@type { CustomComponents.Frame} */
            window.app.modules.modalProvider.show("moduleLoader");
        },
        close() {}
    }
    
}, {once: true})

window.addEventListener("module:afterLoad", ()=>{
    window.app.modules.modalProvider.define("moduleLoader", modal)
}, {once: true});