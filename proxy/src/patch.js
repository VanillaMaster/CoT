const fetchOrigin = window.fetch;
const proxyHost = "127.0.0.1:8080";

const obj = Object.prototype;
const headers = Headers.prototype;
const key = "x-host"

/**
 * @param { RequestInfo | URL } input 
 * @param { RequestInit=} init 
 */
function fetchProxy(input, init){
    if (typeof init == "object" && init.proxy === true) {
        const url = new URL(input);
        url.protocol = "http://";
        const host = url.host;
        url.host = proxyHost
        if ("headers" in init) {
            const type = Object.getPrototypeOf(init.headers);
            switch (type) {
                case obj:
                    init.headers[key] = host;
                    break;
                case headers:
                    init.headers.set(key, host);
                    break;
                default:
                    throw new Error("unexpected headers type");
            }
        } else {
            init.headers = {
                [key]: host
            }
        }
        return fetchOrigin(url, init);
    } else {
        return fetchOrigin(input, init)
    }
}

Object.defineProperty(window, "fetch", {
    value: fetchProxy
});
