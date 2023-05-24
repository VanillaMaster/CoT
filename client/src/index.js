//import "./moduleLoader/index.js"

import { Loader } from "./ESML/index.js";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./worker.js")
}

const loader = await Loader.new();


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


let done = false;
let fetch = 0;
let updated = 0;
loader.addEventListener("update", function(e){
    updated++;
    if (fetch == 0 && done && updated > 0) {
        const ok = confirm(`${updated} modules ready to updated, changes will be applied automaticly on next reload.\nreload now?`)
        if (ok) {
            window.location.reload();
        }
    }
});
loader.addEventListener("fetch", function(e){
    fetch++;
});
loader.addEventListener("fetchend", function(e){
    fetch--;
});

const modules = await Promise.all(dependencies.map( dependency => loader.import(`#${dependency}`)));
done = true;