import { get, set } from "./storage.js";
import { Loader } from "./loader.js";

const loader = new Loader();

/**@type {Window["app"]} */
const app = { loader: loader };

Object.defineProperties(window, {
    "define": {
        value: loader.define.bind(loader),
        configurable: false,
        enumerable: false,
        writable: false,
    },
    "require": {
        value: loader.require.bind(loader),
        configurable: false,
        enumerable: false,
        writable: false,
    }
});

const modulesPaths = Object.entries(await get()).filter(([key, value]) => !value.disabled).map(([key]) => key);

loader.load(modulesPaths);