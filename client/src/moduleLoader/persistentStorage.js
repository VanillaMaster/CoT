const KEYS = /**@type {const} */({
    config: "loader:config",
    required: "loader:required"
})

/**@type {Map<(keyof ModuleContainer), string>} */
export const config = new Map(/**@type { [keyof ModuleContainer, string][] } */(
    JSON.parse(window.localStorage.getItem(KEYS.config))
));
/**@type { Set<(keyof ModuleContainer)> } */
export const required = new Set(JSON.parse(window.localStorage.getItem(KEYS.required)))

config.set = function(key, value) {
    const result = Map.prototype.set.call(this, key, value);
    updateConfig();
    return result;
}
config.delete = function(key) {
    const result = Map.prototype.delete.call(this, key);
    updateConfig();
    return result;
}
required.add = function(key) {
    const result = Set.prototype.add.call(this, key);
    updateRequired();
    return result;
}
required.delete = function(key) {
    const result = Set.prototype.delete.call(this, key);
    updateRequired();
    return result;
}

function updateConfig() {
    const data = JSON.stringify(Array.from(config.entries()));
    window.localStorage.setItem(KEYS.config, data);
}
function updateRequired(){
    const data = JSON.stringify(Array.from(required.keys()));
    window.localStorage.setItem(KEYS.required, data);
}