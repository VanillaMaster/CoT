import { get, set } from "./storage.js";

const exps = /**@type {const} */ ({
    info: new RegExp(/(?<=\/\*\*)(.*?)(?=\*\/)/s),
    module: new RegExp(/(?<=@module ).*?(?=\n)/s),
    description: new RegExp(/(?<=@description ).*/s)
});

const app = {};
Object.defineProperty(window, "app", {
    value: app,
    writable: false,
    configurable: false,
});

/**
 * @param { string } url
 * @returns { Promise<[string, string, string]> }
 */
async function getModuleInfo(url) {
    const moduleText = await (await fetch(url, {cache: "force-cache"})).text();
    const info = moduleText.match(exps.info)?.[0] ?? `@module unknown\n@description unknown`;
    const name = (info.match(exps.module)?.[0] ?? "unknown").trim();
    const description = (info.match(exps.description)?.[0] ?? "unknown").trim();
    return [name, description, url];
}

console.time("modules loaded in")
const modulesPaths = Object.entries(await get()).filter(([key, value]) => !value.disabled).map(([key]) => key);

/**@type { Promise<any> } */
const modulesPromise = Promise.all(modulesPaths.map(location => import(location)));
const moduleDataPromise = Promise.all(modulesPaths.map(location => getModuleInfo(location)));



/**@type { Promise<void>[] } */
const asyncTasks = [];


const modules = await modulesPromise;

//collect data
/**@type { moduleData[] } */
let moduleData = (await moduleDataPromise).map( ([name, description, path]) => ({ name, description, path, tags: [] }));

{

    /**@type { moduleLoader } */
    const moduleLoader = {
        get modulesData(){
            return moduleData
        },
        set modulesData(value){
            //saveModulesLoactions(value);
            moduleData = value
        },
        scheduleAsyncTask() {
            /**@type { ReturnType<window["app"]["moduleLoader"]["scheduleAsyncTask"]> } */
            let res;
            asyncTasks.push(new Promise((resolve, reject) => {
                res = {resolve, reject};
            }));
            return res;
        }
    }
    
    Object.defineProperty(app, "moduleLoader", {
        value: moduleLoader,
        writable: false,
        configurable: false,
    });
    
    /**@type {ModuleContainer} */
    const modulesContainer = /**@type {*}*/({});
    Object.defineProperty(app, "modules", {
        value: modulesContainer,
        writable: false,
        configurable: false,
    });

}


window.dispatchEvent(new CustomEvent("module:load"));

await Promise.all(asyncTasks);
asyncTasks.length = 0;

window.dispatchEvent(new CustomEvent("module:afterLoad"));

console.timeEnd("modules loaded in");
console.log("modules info:", moduleData);
