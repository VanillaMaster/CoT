const KEY = "loader:config";

async function getDefault(){
    const data = (await import("./default.js")).default;
    set(data);
    return data
}

export async function get(){
    const raw = window.localStorage.getItem(KEY);
    /**@type { import("./default.js")["default"] } */
    const data = (raw != null && false)? JSON.parse(raw) : getDefault();
    return data;
}
/**
 * @param {import("./default.js")["default"]} data 
 */
export function set(data){
    window.localStorage.setItem(KEY, JSON.stringify(data));
}