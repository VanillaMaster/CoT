export class Loader {
    constructor(){}

    #doneFetch = false;

    /**@type { Optional<ModuleContainer> } */
    modules = {};

    /**@type { { [key in keyof ModuleContainer]?: {deps: (keyof ModuleContainer)[], required: number, callback: (...any) => void}[]} } */
    #requireCallBacksMap = {}

    /**@type {[any, any, any][]} */
    #unresolved = [];

    /**@type { loader.resolve } */
    #resolve(name, dependencies, callback){
        const ok = dependencies.reduce((ok, key) => key in this.modules && ok, true);
        if (ok) {
            console.time(name);
            //@ts-ignore
            const e = callback( ...dependencies.map(key => this.modules[key]) );
            Promise.resolve(e).then(module => {
                //debugger;
                this.modules[name] = module;
                if (this.#unresolved.length > 0) this.#tryResolve();
                const container = this.#requireCallBacksMap[name] ?? /**@type { {deps: (keyof ModuleContainer)[], required: number, callback: (...any) => void}[] }*/([]);
                for (let i = 0; i < container.length; i++) {
                    const element = container[i];
                    container.splice(i, 1);
                    element.required--
                    if (element.required == 0) {
                        //@ts-ignore
                        element.callback(...(element.deps.map(key => this.modules[key])));
                        i--;
                    }
                }

                console.timeEnd(name);
            })
        }
        return ok;
    }
    
    #tryResolve(){
        let ok = false;
        for (let i = 0; i < this.#unresolved.length; i++) {
            const [name, dependencies, callback] = this.#unresolved[i];
            if (this.#resolve(name, dependencies, callback)) {
                ok = true;
                this.#unresolved.splice(i, 1);
                i--;
            }
            
        }
    
        if ((!ok) && this.#doneFetch ) {
            throw new Error("dependencies can not be resolved")
        };
    }

    /**@type { loader.define } */
    define(name, dependencies, callback){
        if ( !(this.#resolve(name, dependencies, callback)) ) {
            this.#unresolved.push([name, dependencies, callback]);
        }
    }

    /**@type { loader.require } */
    require(dependencies, callback){
        const ok = dependencies.reduce((ok, key) => key in this.modules && ok, true);
        if (ok) {
            //@ts-ignore
            callback( ...dependencies.map(key => this.modules[key]) )
        } else {
            /**@type { {deps: (keyof ModuleContainer)[], required: number, callback: (...any) => void} } */
            const element = {
                callback,
                required: dependencies.length,
                deps: /**@type {*}*/(dependencies)
            }
            for (const dependency of dependencies) {
                const container = this.#requireCallBacksMap[dependency] ?? (this.#requireCallBacksMap[dependency] = []);
                container.push(element)
            }
        }
    }

    /**
     * @param { string[] } paths 
     */
    load(paths) {
        console.time("module loaded in");
        Promise.all(paths.map(location => import(location))).then(()=> {
            this.#doneFetch = true;
            console.timeEnd("module loaded in");
        });
    }

}