type Optional<T> = {
    [K in keyof T]: T[K]
}

interface ModuleContainer {};

type moduleLoader = {
    scheduleAsyncTask: () => { resolve: () => void; reject: (reason: Error) => void }
    modulesData: moduleData[];
}

type moduleData = {
    name: string;
    description: string;
    path: string;
    tags: string[];
}

interface Window {
    app: {
        modules: ModuleContainer;
        moduleLoader: moduleLoader;
    }
}