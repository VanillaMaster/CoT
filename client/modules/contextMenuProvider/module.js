/**
@module ContextMenuProvider
@description Lorem ipsum dolor sit amet consectetur adipisicing elit.
Architecto quos voluptates accusantium mollitia odit est ullam cumque dignissimos amet.
Quo dolor labore autem quia porro, illum odit necessitatibus provident nulla. 
*/
const style = new CSSStyleSheet();
await style.replace(
    `*[data-class="menu"] {
        font-size: 14px;
        z-index: 101;
        
        overflow: hidden;
        position: absolute;
        
        top: var(--y, 0);
        left: var(--x, 0);
    
        isolation: isolate;
    
        border-width: 1px 0 0 0;
        border-color: #1c1c1c;
        border-style: solid;

        color: #d8d9d9;
    }
    
    *[data-class="menu"]:not([visible]){
        display: none;
    }
    *[data-class="menu"][visible] {
        display: block;
    }
    *[data-class="menu"]>*[data-class="content"]{
        border-width: 0 1px 1px 1px;
        border-color: #1c1c1c;
        border-style: solid;

        animation: context-menu-slide 250ms;
    }
    *[data-class="menu"]>*[data-class="content"]::before {
        content: "";
        position: absolute;
        inset: 0;
    
        background-color: #282828;
        filter: url(#noise);
        z-index: -1;
    }

    @keyframes context-menu-slide {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        25% { opacity: 1; } 
        to {}
    }`
);

const template = document.createRange().createContextualFragment(
    `<div data-class="menu">
        <div data-class="content"></div>
    </div>`
);

const menu = template.querySelector(`[data-class="menu"]`);
const contentContainer = template.querySelector(`[data-class="content"]`);
/**@type {DocumentFragment | undefined} */
let fragment;

menu.addEventListener("pointerdown", function(e) {
    e.stopPropagation();
});

function close(){
    menu.removeAttribute("visible");
    if (fragment) fragment.append(...contentContainer.children);  
}
document.addEventListener("pointerdown", close);

document.body.append(template);

window.addEventListener("module:load", ()=>{
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, style];
    window.modules.contextMenuProvider = {
        show(content, x, y) {
            menu.style.setProperty("--x", `${x}px`);
            menu.style.setProperty("--y", `${y}px`);

            contentContainer.append(content);
            fragment = content;

            menu.removeAttribute("visible");
            requestAnimationFrame(()=>{
                menu.setAttribute("visible","")
            })
        },
        close
    }

})