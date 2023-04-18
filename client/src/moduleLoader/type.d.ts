type Optional<T> = {
    [K in keyof T]: T[K]
}

type Module = {
    name: string;
    description: string;

    load: () => Promise<void>;
    afterLoad?: () => Promise<void>;
}

interface ModuleContainer {};

type moduleLoader = {
    scheduleAsyncTask: () => { resolve: () => void; reject: (reason: Error) => void }
    modulesData: string[];
}

type moduleData = {
    name: string;
    description: string;
    path: string;
    tags: string[];
}

interface Window {
    modules: ModuleContainer;
    moduleLoader: moduleLoader;
}