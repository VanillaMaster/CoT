import langs from "./langs.js";

define("translator", [], async function() {
    const lang = (/**@type { ReadonlyArray<String> } */(langs.list)).includes(navigator.language)? navigator.language : langs.list[0];
    /**@type {Record<string, string>} */
    const { default: translation } = await import(`./translations/${lang}.js`);
    return {
        translate(key) {
            return translation[key] ?? "";
        }
    }
});