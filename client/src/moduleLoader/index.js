import { Loader } from "./loader.js";


import { html } from "#utilities";

const config = {
    "moduleLoaderGui": "http://localhost:8000/client/modules/moduleLoaderGui/module.js",
    "wc": "http://localhost:8000/client/modules/wc__/module.js",
    "modalProvider": "http://localhost:8000/client/modules/modalProvider/module.js",
    "contextMenuProvider": "http://localhost:8000/client/modules/contextMenuProvider/module.js",
    "WidgetGridProvider": "http://localhost:8000/client/modules/gridProvider/module.js",
    "LayoutManaget": "http://localhost:8000/client/modules/layoutManager/module.js",
    "SVGChartProvider": "http://localhost:8000/client/modules/chartProvider/module.js"
}
/**
 * @type {(keyof ModuleContainer)[]}
 */
const required = ([
    "moduleLoaderGui",
    "wc",
    "contextMenuProvider",
    "WidgetGridProvider",
    "LayoutManaget",
    "SVGChartProvider",
    //"modalProvider"
])

const manual = ([

]);

const modal = /**@type { HTMLDialogElement } */ (document.getElementById("loader-config-modal"));
const container = /**@type { HTMLDivElement } */(modal.querySelector(".content"))
function render() {
    const buffer = new DocumentFragment();
    for (const [key, value] of /**@type { [(keyof ModuleContainer), string][]}*/(Object.entries(config))) {
        const fragment = html`
        <fieldset data-module="${key}">
            <legend>${key}</legend>
            <div class="url"><span>URL:</span><input type="text" value="${value}"></div>
            <div class="extra">
                <span>required: </span>
                <input type="checkbox" ${required.includes(key) ? "checked" : ""}>
                <button class="delete">delete</button>
            </div>
        </fieldset>`
        const element = /**@type { HTMLFieldSetElement } */ (fragment.querySelector("fieldset"));
        const delBtn = /**@type { HTMLButtonElement } */ (fragment.querySelector("button.delete"));
        delBtn.addEventListener("click", function(e){
            element.remove();
        })
        buffer.append(fragment)
    }
    container.replaceChildren(buffer);
}
{
    const closeBtn = /**@type { HTMLButtonElement } */ (modal.querySelector("button.close"));
    closeBtn.addEventListener("click", function(e) {
        modal.close();
    });
    const addBtn = /**@type { HTMLButtonElement } */ (modal.querySelector("button.add"));
    addBtn.addEventListener("click", function(e) {
        const fragment = html`
        <fieldset data-manual>
            <legend>module</legend>
            <div class="url"><span>URL:</span><input type="text"></div>
            <div class="extra">
                <span>required: </span>
                <input type="checkbox" checked disabled>
                <button class="delete">delete</button>
            </div>
        </fieldset>`
        const element = /**@type { HTMLFieldSetElement } */ (fragment.querySelector("fieldset"));
        const delBtn = /**@type { HTMLButtonElement } */ (fragment.querySelector("button.delete"));
        delBtn.addEventListener("click", function(e){
            element.remove();
        })
        container.append(fragment);
    });
    const saveBtn = /**@type { HTMLButtonElement } */ (modal.querySelector("button.save"));
    saveBtn.addEventListener("click", function(e) {
        const config = {};
        const required = [];
        const manual = [];
        for (const element of /**@type { NodeListOf<HTMLFieldSetElement> } */(container.querySelectorAll("fieldset[data-module]"))) {
            const urlInput = /**@type { HTMLInputElement } */(element.querySelector(`input[type="text"]`))
            const requiredInput = /**@type { HTMLInputElement } */(element.querySelector(`input[type="checkbox"]`))

            const moduleName = element.dataset.module;
            const url = urlInput.value;
            const req = requiredInput.checked;
            config[moduleName] = url;
            if (requiredInput.checked) required.push(moduleName);
        }
        for (const element of /**@type { NodeListOf<HTMLFieldSetElement> } */(container.querySelectorAll("fieldset[data-manual]"))) {
            const urlInput = /**@type { HTMLInputElement } */(element.querySelector(`input[type="text"]`))
            const url = urlInput.value;
            manual.push(url)
        }

        console.log(config, required, manual);
    });
}

window.addEventListener("keydown", function(e){
    if (e.code == "KeyL" && e.ctrlKey) {
        e.preventDefault();
        render();
        if (!modal.open) modal.showModal();
    }
});


Object.defineProperty(window, "app", {
    configurable: false,
    enumerable: false,
    writable: false,
    /**@type {Window["app"]} */
    value: {
        loader: new Loader()
    }
})

window.app.loader.addEventListener("requirestart", (e) => {
    console.log(e.detail);
})

Object.defineProperties(window, {
    "define": {
        value: window.app.loader.define.bind(window.app.loader),
        configurable: false,
        enumerable: false,
        writable: false,
    },
    "require": {
        value: window.app.loader.require.bind(window.app.loader),
        configurable: false,
        enumerable: false,
        writable: false,
    }
});

//const modulesPaths = Object.entries(await get()).filter(([key, value]) => !value.disabled).map(([key]) => key);

window.app.loader.config.import({
    paths: config
})

require(required);

//window.app.loader.load(...modulesPaths);
