/**
@module moduleLoaderGui
@description Lorem ipsum dolor sit amet consectetur adipisicing elit.
Architecto quos voluptates accusantium mollitia odit est ullam cumque dignissimos amet.
Quo dolor labore autem quia porro, illum odit necessitatibus provident nulla. 
*/


define("moduleLoaderGui", ["modalProvider"], function(modalProvider) {
    const modal = document.createRange().createContextualFragment(`
    <ul>
        <li draggable="true" ondragstart="drag(event)">1</li>
        <li draggable="true">2</li>
        <li draggable="true">3</li>
        <li draggable="true" ondragover="allowDrop(event)">4</li>
    </ul>
    `)
    modalProvider.define("moduleLoader", modal)
    return {
        show() {
            /**@type { CustomComponents.Frame} */
            modalProvider.show("moduleLoader");
        },
        close() {}
    }
})

