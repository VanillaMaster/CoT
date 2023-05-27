//import "./moduleLoader/index.js"

import { Loader } from "./ESML/index.js";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./worker.js")
}


const loader = await Loader.new();
//**@type {typeof window["app"]} */
const app = {
    loader: loader,
}

Object.defineProperty(window, "app", {
    value: app,
    configurable: false,
    enumerable: false,
    writable: false
})

const importmap = {
    imports: [
        {
            name: "#utilities",
            path: "http://localhost:8000/client/src/utilities.js",
            scopes: []
        }
    ]
}
for (const [key, value] of /**@type {[string, string][]} */ (JSON.parse(window.localStorage.getItem("loader:config")))) {
    importmap.imports.push({
        name: `#${key}`,
        path: value,
        scopes: []
    });
}

loader.importmap = importmap;
console.log(loader);
/**@type { string []} */
const dependencies = JSON.parse(window.localStorage.getItem("loader:required"))


let done = false, fetch = 0, updated = 0, updating = 0, id = -1;
loader.addEventListener("updatestart", function(e){
    updating++;
    if (id != -1 ) {
        clearTimeout(id)
        id = -1;
    }
});
loader.addEventListener("updateend", function(e){
    updated++;
    updating--;
    checkForUpdate();
});
loader.addEventListener("fetch", function(e){
    fetch++;
    if (id != -1 ) {
        clearTimeout(id)
        id = -1;
    }
});
loader.addEventListener("fetchend", function(e){
    fetch--;
    checkForUpdate();
});

Promise.all(dependencies.map( dependency => loader.import(`#${dependency}`))).then(()=>{
    done = true;
    checkForUpdate();
})


function checkForUpdate() {
    if (fetch == 0 && updating == 0 && done && updated > 0) {
        id = setTimeout(() => {
            const ok = confirm(`${updated} modules ready to updated, changes will be applied automaticly on next reload.\nreload now?`)
            if (ok) {
                window.location.reload();
            }
        }, 1000);
    }
}