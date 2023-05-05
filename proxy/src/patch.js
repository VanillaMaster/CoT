const fetchOrigin = window.fetch;
const proxyHost = "127.0.0.1:8080";

const name = "x-host"

/**
 * @param { RequestInfo | URL } input 
 * @param { RequestInit & { proxy?: boolean }} [init] 
 */
function fetchProxy(input, init){
    if (typeof init == "object" && init.proxy === true) {
        const url = new URL(input.toString());
        url.protocol = "http://";
        const host = url.host;
        url.host = proxyHost
        if ("headers" in init) {
            switch (Object.getPrototypeOf(init.headers)) {
                case Object.prototype:
                    (/**@type { Object }*/(init.headers))[name] = host;
                    break;
                case Headers.prototype:
                    (/**@type { Headers }*/(init.headers)).set(name, host);
                    break;
                default:
                    throw new Error("unexpected headers type");
            }
        } else {
            init.headers = /**@type {HeadersInit} */ ({
                [name]: host
            })
        }
        return fetchOrigin(url, init);
    } else {
        return fetchOrigin(input, init)
    }
}

Object.defineProperty(window, "fetch", {
    value: fetchProxy
});
