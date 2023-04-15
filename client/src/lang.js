import config from "../translation.json" assert {type: "json"};

const lang = config.list.includes(navigator.language)? navigator.language : "en-US";
/**@type { {default: import("../translation/en-US.json")} } */
export const {default: translation} = await import(`../translation/${lang}.json`, {assert: {type: "json"}});