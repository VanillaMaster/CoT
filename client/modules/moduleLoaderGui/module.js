/**
@module moduleLoaderGui
@description Lorem ipsum dolor sit amet consectetur adipisicing elit.
Architecto quos voluptates accusantium mollitia odit est ullam cumque dignissimos amet.
Quo dolor labore autem quia porro, illum odit necessitatibus provident nulla. 
*/
window.drag = function(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    console.log(ev);
}
window.allowDrop = function(ev) {
    ev.preventDefault();
}


window.addEventListener("module:load", ()=>{
    window.modules.moduleLoaderGui = {
        show() {
            const modal = document.createElement("modal-frame");
            modal.append(document.createRange().createContextualFragment(`
                <ul>
                    <li draggable="true" ondragstart="drag(event)">1</li>
                    <li draggable="true">2</li>
                    <li draggable="true">3</li>
                    <li draggable="true" ondragover="allowDrop(event)">4</li>
                </ul>
            `));
            window.modules.modalProvider.modal.show(modal);
        },
        close() {}
    }

}, {once: true})

window.addEventListener("module:afterLoad", ()=>{

}, {once: true});