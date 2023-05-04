export class Loader {
    constructor(){}
    static #exp = new RegExp(/https?.*?\.js/g);
    static config = class {
        /**@param { Loader } self */
        constructor(self) { this.#self = self }
        #self;
        export() {
            return { ...this.#self.#meta.paths }
        }
        /**
         * @param { loader.config } config 
         */
        import(config) {
            /**@type { { [path: string]: {modules: string[]; imported: boolean} } } */
            const modules = {};
            for (const [key, value] of Object.entries(config.paths)) {
                (modules[value] ?? (modules[value] = {imported: false, modules: []})).modules.push(key);
            }
            Object.assign(this.#self.#meta.paths, config.paths);
            Object.assign(this.#self.#meta.modules, modules);
        }
    }
    
    /**@type { loader.queue } */
    #queue = new Map();
    /**@type { Map<string, any>} */
    moduleRegistry = new Map();

    #meta = {
        /**@type { { [moduleName: string]: string } } */
        paths: {},
        /**@type { { [path: string]: {modules: string[]; imported: boolean} } } */
        modules: {}
    }

    /**
     * @param { string[] } dependencies 
     * @param { (...args: any) => void } [callback] 
     */
    require(dependencies, callback) {
        this.enqueue({
            type: "require",
            callback,
            dependencies,
            left: dependencies.length
        })
    }
    /**
     * @param { string } name 
     * @param { string[] } dependencies 
     * @param { (...args: any) => any } callback 
     */
    define(name, dependencies, callback){
        const url = (new Error()).stack?.match(Loader.#exp).at(-1);
        
        (this.#meta.modules[url] ?? (this.#meta.modules[url] = {modules: [], imported: true})).modules.push(name);
        this.#meta.paths[name] = url;

        console.time(name);
        this.enqueue({
            type: "define",
            name,
            callback,
            dependencies,
            left: dependencies.length,
        });
    }

    /**
     * @private
     * @param { loader.queueElement } element 
     */
    enqueue(element) {
        const urls = [];
        for (const dependency of element.dependencies) {
            if (this.moduleRegistry.has(dependency)) {
                element.left--;
            } else {
                let container = this.#queue.get(dependency);
                if (container == undefined) {
                    container = [];
                    this.#queue.set(dependency, container);
                }
                container.push(element);
                if (dependency in this.#meta.paths) {
                    const url = this.#meta.paths[dependency];
                    if (!(this.#meta.modules[url].imported)) {
                        this.#meta.modules[url].imported = true;
                        urls.push(url)
                    }
                }
            }
        }
        this.load(...urls);
        if (element.left == 0) {
            this.resolve(element);
        }
    }

    /**
     * @private
     * @param { loader.queueElement } element 
     */
    async resolve(element){
        const args = element.dependencies.map(name => this.moduleRegistry.get(name));
        if (element.type == "require") {
            element.callback?.apply(window, args);
        }
        if (element.type == "define") {
            const module = await Promise.resolve(element.callback.apply(window, args));
            this.moduleRegistry.set(element.name, module);
            this.processQueue(element.name);
        }
    }

    /**
     * @private
     * @param { string } name 
     */
    processQueue(name) {
        const container = this.#queue.get(name);
        if (container == undefined) return;
        this.#queue.delete(name);
        for (const element of container) {
            if (--element.left == 0) {
                this.resolve(element);
            }
        }
    }

    config = new Loader.config(this);

    /**
     * @param { string[] } paths 
     */
    load(...paths) {
        if (paths.length <= 0) return;
        const key = `load: [\n${paths.map(path => `   ${path}`).join(",\n")}\n]`
        console.log(key);
        //console.time(key);
        Promise.all(paths.map(location => import(location))).then(()=> {
            //console.timeEnd(key);
        });
    }

}