export function init() {
    const menu = document.getElementById("menu");
    
    const targets = document.querySelectorAll(".grid-stack-item-content")
    
    for (const target of targets) {
        target.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            const { clientX: x, clientY: y } = e;
            requestAnimationFrame(()=>{
                menu.style.setProperty("--x", `${x + 1}px`);
                menu.style.setProperty("--y", `${y + 1}px`);
        
                menu.removeAttribute("visible");
                requestAnimationFrame(()=>{
                    menu.setAttribute("visible","")
                })
            })
        })
    }
    
    document.addEventListener("pointerdown", function(e) {
        menu.removeAttribute("visible");
    });
    menu.addEventListener("pointerdown", function(e) {
        e.stopPropagation();
    });
}
