import { html } from "#utilities";
import style from "./style.js";

const sheet = new CSSStyleSheet();
sheet.replace(style)
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]


const KEYS = /**@type {const} */({
    config: "loader:config",
    required: "loader:required"
})


/**@type {Map<(keyof ModuleContainer), string>} */
export const config = new Map(/**@type { [keyof ModuleContainer, string][] } */(
    JSON.parse(window.localStorage.getItem(KEYS.config))
));
/**@type { Set<(keyof ModuleContainer)> } */
export const required = new Set(JSON.parse(window.localStorage.getItem(KEYS.required)))

config.set = function(key, value) {
    const result = Map.prototype.set.call(this, key, value);
    updateConfig();
    return result;
}
config.delete = function(key) {
    const result = Map.prototype.delete.call(this, key);
    updateConfig();
    return result;
}
required.add = function(key) {
    const result = Set.prototype.add.call(this, key);
    updateRequired();
    return result;
}
required.delete = function(key) {
    const result = Set.prototype.delete.call(this, key);
    updateRequired();
    return result;
}

function updateConfig() {
    const data = JSON.stringify(Array.from(config.entries()));
    window.localStorage.setItem(KEYS.config, data);
}
function updateRequired(){
    const data = JSON.stringify(Array.from(required.keys()));
    window.localStorage.setItem(KEYS.required, data);
}

const template = html`
<dialog class="loader-config-modal">
    <h2>Loader config</h2>
    <div class="add-block">
        <span>URL:</span>
        <input class="add-url" type="text">
        <button class="add-btn">add</button>
    </div>
    <div class="content"></div>
    <div>
        <button class="close">close</button>
    </div>
</dialog>`;

const modal = /**@type { HTMLDialogElement } */ (template.querySelector("dialog"));
const container = /**@type { HTMLDivElement } */(modal.querySelector(".content"))

window.addEventListener("beforeunload", (event) => {
    console.log(event);
});

/**
 * @param { keyof ModuleContainer } name 
 * @param { string } path 
 * @param { boolean } [checked] 
 */
function createLoaderListElement(name, path, checked = false){
    const fragment = html`
    <fieldset data-module="${name}">
        <legend>${name}</legend>
        <div class="url"><span>URL:</span><input type="text" value="${path}"></div>
        <div class="extra">
            <span>required:</span>
            <input data-module="${name}" type="checkbox" ${checked ? "checked" : ""}>
            <button data-module="${name}" class="delete">delete</button>
        </div>
    </fieldset>`

    const delBtn = /**@type { HTMLButtonElement } */ (fragment.querySelector("button.delete"));
    delBtn.addEventListener("click", function(e){
        const module = /**@type { keyof ModuleContainer } */ (this.dataset.module);
        container.querySelector(`:scope>fieldset[data-module=${module}]`).remove();
        config.delete(module);
        required.delete(module);
    })
    const requiredCheckbox = /**@type { HTMLInputElement } */ (fragment.querySelector('input[type="checkbox"]'));
    requiredCheckbox.addEventListener("change", function(e) {
        const module = /**@type { keyof ModuleContainer } */ (this.dataset.module);
        if (this.checked) { required.add(module) } else { required.delete(module); }
    });
    return fragment;
}


const buffer = new DocumentFragment();
for (const [key, value] of config) {
    buffer.append(createLoaderListElement(key, value, required.has(key)));
}
container.replaceChildren(buffer);


const closeBtn = /**@type { HTMLButtonElement } */ (modal.querySelector("button.close"));
closeBtn.addEventListener("click", function(e) {
    modal.close();
});
const addBtn = /**@type { HTMLButtonElement } */ (modal.querySelector("button.add-btn"));
const addUrlInput = /**@type { HTMLButtonElement } */ (modal.querySelector("input.add-url"));
addBtn.addEventListener("click", function(e) {
    const url = addUrlInput.value;
    addUrlInput.value = "";
    /**@type {(ev: loader.events.definestart) => any} */
    const definestart = (e) => {
        if (e.detail.url == url) {
            const module = /**@type { keyof ModuleContainer } */ (e.detail.name);
            config.set(module, e.detail.url)
            container.prepend(createLoaderListElement(module, e.detail.url, false))
        }
    }
    window.app.loader.addEventListener("definestart", definestart)
    window.app.loader.load(url).then(([success])=>{
        window.app.loader.removeEventListener("definestart", definestart)
        if (!success) { alert("error"); }
    })
});


window.addEventListener("keydown", function(e){
    if (e.code == "KeyL" && e.ctrlKey) {
        e.preventDefault();
        if (!modal.open) modal.showModal();
    }
});

document.body.append(template);