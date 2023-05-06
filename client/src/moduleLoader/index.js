import { Loader } from "./loader.js";
import { config, required } from "./persistentStorage.js";
import "./gui/index.js"


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


window.app.loader.config.import({
    paths: Object.fromEntries(config.entries())
})

require([...required]);