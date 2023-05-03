type Optional<T> = {
    [K in keyof T]?: T[K]
}

interface ModuleContainer {};

interface Window {
    app: {
        loader: import("./loader.js").Loader;
    }
}




namespace loader {
    type modulesByKeys<const T extends ReadonlyArray<keyof ModuleContainer>> =
        T extends readonly[infer K] ?
        [ModuleContainer[K]] :
        T extends readonly [infer H, ...infer T] ?
        [ModuleContainer[H], ...modulesByKeys<T>] :
        never;

    type resolve = <
        const K extends keyof ModuleContainer,
        const D extends ReadonlyArray<Exclude<keyof ModuleContainer, K>>
    >(
        name: K,
        dependencies: D,
        callback: (...arg: modulesByKeys<D>) => ModuleContainer[K] | Promise<ModuleContainer[K]>
    ) => boolean;
    
    type define = <
        const K extends keyof ModuleContainer,
        const D extends ReadonlyArray<Exclude<keyof ModuleContainer, K>>
    >(
        name: K,
        dependencies: D,
        callback: (...arg: modulesByKeys<D>) => ModuleContainer[K] | Promise<ModuleContainer[K]>
    ) => void;
    
    type require = <
        const D extends ReadonlyArray<keyof ModuleContainer>
    >(
        dependencies: D,
        callback: (...arg: modulesByKeys<D>) => void
    ) => void
}


declare const define: loader.define;
declare const require: loader.require;