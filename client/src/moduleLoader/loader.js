//TODO: implement it
function loadModulesLoactions(){
    return [
        "/client/modules/moduleLoaderGui/module.js",
        "/client/modules/modalProvider/module.js",
        "/client/modules/contextMenuProvider/module.js",
        "/client/modules/gridProvider/module.js"
    ]
}

/**
 * @param { moduleData[] } list
 */
function saveModulesLoactions(list){

}

const exps = /**@type {const} */ ({
    info: new RegExp(/(?<=\/\*\*)(.*?)(?=\*\/)/s),
    module: new RegExp(/(?<=@module ).*?(?=\n)/s),
    description: new RegExp(/(?<=@description ).*/s)
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

const modulesPaths = loadModulesLoactions();

/**@type { Promise<Module[]> } */
const modulesPromise = Promise.all(
    modulesPaths.map(location => import(location))
);

console.time("modules loaded in")

const moduleDataPromise = Promise.all(
    modulesPaths.map(location => getModuleInfo(location))
);

/**@type { Promise<void>[] } */
const asyncTasks = [];

{

    /**@type {ModuleContainer} */
    const modulesContainer = {};
    
    /**@type { moduleLoader } */
    const moduleLoader = {
        get modulesData(){
            return moduleData
        },
        set modulesData(value){
            saveModulesLoactions(value);
            moduleData = value
        },
        scheduleAsyncTask() {
            /**@type { ReturnType<window["moduleLoader"]["scheduleAsyncTask"]> } */
            let res;
            asyncTasks.push(new Promise((resolve, reject) => {
                res = {resolve, reject};
            }));
            return res;
        }
    }
    
    Object.defineProperty(window, "modules", {
        value: modulesContainer,
        writable: false,
        configurable: false,
    });
    
    Object.defineProperty(window, "moduleLoader", {
        value: moduleLoader,
        writable: false,
        configurable: false,
    });

}


const modules = await modulesPromise;

//collect data
/**@type { moduleData[] } */
const moduleData = (await moduleDataPromise).map( ([name, description, path]) => ({ name, description, path, tags: ["core"] }));

window.dispatchEvent(new CustomEvent("module:load"));

await Promise.all(asyncTasks);
asyncTasks.length = 0;

window.dispatchEvent(new CustomEvent("module:afterLoad"));

console.timeEnd("modules loaded in");
console.log("modules info:", moduleData);
