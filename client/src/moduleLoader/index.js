import { Loader } from "./loader.js";

const config = {
    "moduleLoaderGui": "http://localhost:8000/client/modules/moduleLoaderGui/module.js",
    "wc": "http://localhost:8000/client/modules/wc__/module.js",
    "modalProvider": "http://localhost:8000/client/modules/modalProvider/module.js",
    "contextMenuProvider": "http://localhost:8000/client/modules/contextMenuProvider/module.js",
    "WidgetGridProvider": "http://localhost:8000/client/modules/gridProvider/module.js",
    "LayoutManaget": "http://localhost:8000/client/modules/layoutManager/module.js",
    "SVGChartProvider": "http://localhost:8000/client/modules/chartProvider/module.js"
}
const required = /**@satisfies {(keyof ModuleContainer)[]} */ ([
    "moduleLoaderGui",
    "wc",
    "contextMenuProvider",
    "WidgetGridProvider",
    "LayoutManaget",
    "SVGChartProvider",
    "modalProvider"
])


Object.defineProperty(window, "app", {
    configurable: false,
    enumerable: false,
    writable: false,
    /**@type {Window["app"]} */
    value: {
        loader: new Loader()
    }
})

Object.defineProperties(window, {
    "define": {
        value: window.app.loader.define.bind(window.app.loader),
        configurable: false,
        enumerable: false,
        writable: false,
    },
    "require": {
        value: window.app.loader.require.bind(window.app.loader),
        configurable: false,
        enumerable: false,
        writable: false,
    }
});

//const modulesPaths = Object.entries(await get()).filter(([key, value]) => !value.disabled).map(([key]) => key);

window.app.loader.config.import({
    paths: config
})

require(required);

//window.app.loader.load(...modulesPaths);