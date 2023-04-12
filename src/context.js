/**
 * @param { HTMLElement[] } targets 
 */
export function init(elements) {
    const menu = document.getElementById("menu");
    const btn = /**@type { const } */ ({
        /**@type { HTMLButtonElement }*/
        delete: menu.querySelector(`[data-name="delete"]`)
    });

    let target = null;
    
    for (const element of elements) {
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
    }

    btn.delete.addEventListener("click", function(e) {
        target.remove();
        menu.removeAttribute("visible");
    })
    
    document.addEventListener("pointerdown", function(e) {
        menu.removeAttribute("visible");
    });
    document.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });
    menu.addEventListener("pointerdown", function(e) {
        e.stopPropagation();
    });
}
