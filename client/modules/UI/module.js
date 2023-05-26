import { html } from "#utilities";

import * as contextMenuProvider from "#contextMenuProvider"
import * as modalProvider from "#modalProvider"
import * as translator from "#translator"
import * as LayoutManaget from "#LayoutManaget"
import * as appLayout from "#appLayout"


/**@type {CustomComponents.Layout} */
const viewport = document.querySelector(`[data-name="app-viewport"]`);

const sideBar = document.querySelector("aside.sidebar");
const sideBarTop = sideBar.querySelector(":scope>.top");
const sideBarBottom = sideBar.querySelector(":scope>.bottom");

const settingsBtn = /**@type {HTMLButtonElement} */(html`
<button id="btn-layout-settings" title="settings">
    <svg><use href="#icon-settings"></use></svg>
</button>`.children[0]);

const homeBtn = /**@type {HTMLButtonElement} */(html`
<button id="btn-layout-home" title="home">
    <svg><use href="#icon-home"></use></svg>
</button>`.children[0]);

const popupBtn = /**@type {HTMLButtonElement} */(html`
<button id="btn-layout-popup" title="popup">
    <svg><use href="#icon-popup"></use></svg>
</button>`.children[0]);

settingsBtn.addEventListener("click", (e)=>{
    viewport.show("settings");
})

homeBtn.addEventListener("click", (e)=>{
    viewport.show("widget-grid");
})

popupBtn.addEventListener("click", (e)=>{
    modalProvider.show("create-widget");
})

sideBarBottom.append(settingsBtn)
sideBarTop.append(homeBtn, popupBtn);
//a
const fragment = html`
    <section style="--padding: 0px" data-name="widget-grid">
        <widget-grid cell-size="100" class="grid" data-context-menu="main"></widget-grid>
    </section>
    <section data-name="settings">
        <div>
            <h3>${translator.translate("settings.language.lable")}:</h3>
            <lable>
                <select>
                    <option>${translator.translate("settings.language.option.en-US")}</option>
                </select>
            </lable>
            <section style="display:flex;flex-direction: column;align-items: flex-start;gap: .5em;">
                <h3>${translator.translate("settings.cache.lable")}:</h3>
                <lable>
                <span>strategy: <span>
                <select>
                <option>${translator.translate("settings.cache.strategy.cftr")}</option>
                <option>${translator.translate("settings.cache.strategy.cinc")}</option>
                <option>${translator.translate("settings.cache.strategy.nc")}</option>
                </select>
                </lable>
                <button>delete modules cache</button>
                <button>update modules cache</button>
            </section>
        </div>
    </section>
`;
/**@type { HTMLElement } */
const grid = fragment.querySelector(".grid");
grid.dataset.contextMenu = "main";

viewport.append(fragment);
viewport.dataset.active = "widget-grid"

const contextMenu = html`
    <ul class="context-menu-list">
        <li><button data-context-action="add">${translator.translate("grid.contextmenu.add")}</button></li>
    </ul>
`;

grid.addEventListener("context:add", function(e) {
    modalProvider.show("create-widget");
})

contextMenuProvider.define("main", contextMenu);


// define(
//     "UI",
//     [
//         "contextMenuProvider",
//         "modalProvider",
//         "translator",
//         "LayoutManaget",
//         "appLayout"
//     ],
//     function(contextMenuProvider, modalProvider, translator){
//         /**@type {CustomComponents.Layout} */
//         const viewport = document.querySelector(`[data-name="app-viewport"]`);

//         const sideBar = document.querySelector("aside.sidebar");
//         const sideBarTop = sideBar.querySelector(":scope>.top");
//         const sideBarBottom = sideBar.querySelector(":scope>.bottom");

//         const settingsBtn = /**@type {HTMLButtonElement} */(html`
//         <button id="btn-layout-settings" title="settings">
//             <svg><use href="#icon-settings"></use></svg>
//         </button>`.children[0]);

//         const homeBtn = /**@type {HTMLButtonElement} */(html`
//         <button id="btn-layout-home" title="home">
//             <svg><use href="#icon-home"></use></svg>
//         </button>`.children[0]);

//         const popupBtn = /**@type {HTMLButtonElement} */(html`
//         <button id="btn-layout-popup" title="popup">
//             <svg><use href="#icon-popup"></use></svg>
//         </button>`.children[0]);

//         settingsBtn.addEventListener("click", (e)=>{
//             viewport.show("settings");
//         })
        
//         homeBtn.addEventListener("click", (e)=>{
//             viewport.show("widget-grid");
//         })
        
//         popupBtn.addEventListener("click", (e)=>{
//             modalProvider.show("create-widget");
//         })

//         sideBarBottom.append(settingsBtn)
//         sideBarTop.append(homeBtn, popupBtn);

//         const fragment = html`
//             <section style="--padding: 0px" data-name="widget-grid">
//                 <widget-grid cell-size="100" class="grid" data-context-menu="main"></widget-grid>
//             </section>
//             <section data-name="settings">
//                 <div>
//                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae rerum atque accusantium tenetur magnam asperiores odio. Quam sint, rem, eaque suscipit perferendis, voluptatem ad eum vitae quisquam maiores provident magnam.
//                 </div>
//             </section>
//         `;
//         /**@type { HTMLElement } */
//         const grid = fragment.querySelector(".grid");
//         grid.dataset.contextMenu = "main";
        
//         viewport.append(fragment);
//         viewport.dataset.active = "widget-grid"

//         const contextMenu = html`
//             <ul class="context-menu-list">
//                 <li><button data-context-action="add">${translator.translate("grid.contextmenu.add")}</button></li>
//             </ul>
//         `;

//         grid.addEventListener("context:add", function(e) {
//             modalProvider.show("create-widget");
//         })
        
//         contextMenuProvider.define("main", contextMenu);
//     }
// );