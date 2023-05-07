import style from "./style.js";
import { html } from "#utilities"

define("appLayout", ["LayoutManaget"], function(LayoutManaget){
    const sheet = new CSSStyleSheet();
    sheet.replace(style).then(style => {
        document.adoptedStyleSheets = [style, ...document.adoptedStyleSheets]
    });
    const appLayout = html`
    <aside class="sidebar">
        <div class="top"></div>
        <div class="middle"></div>
        <div class="bottom"></div>
    </aside>
    <layout-viewport data-active="" data-name="app-viewport">
    </layout-viewport>
    `;

    document.body.append(appLayout);
})