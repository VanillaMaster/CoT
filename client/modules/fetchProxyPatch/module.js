export const props = {
    host: "127.0.0.1:6969",
    header:  "x-host"
}

const fetchOrigin = window.fetch;

/**
 * @param { RequestInfo | URL } input 
 * @param { RequestInit & { proxy?: boolean }} [init] 
 */
function fetchProxy(input, init){
    if (typeof init == "object" && init.proxy === true) {
        const url = new URL(input.toString());
        url.protocol = "http://";
        const host = url.host;
        url.host = props.host
        if ("headers" in init) {
            switch (Object.getPrototypeOf(init.headers)) {
                case Object.prototype:
                    (/**@type { Object }*/(init.headers))[props.header] = host;
                    break;
                case Headers.prototype:
                    (/**@type { Headers }*/(init.headers)).set(props.header, host);
                    break;
                default:
                    throw new Error("unexpected headers type");
            }
        } else {
            init.headers = /**@type {HeadersInit} */ ({
                [props.header]: host
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


// define("fetchProxyPatch", [], function(){
//     const fetchOrigin = window.fetch;
//     /**@type {ModuleContainer["fetchProxyPatch"]} */
//     const module = {
//         host: "127.0.0.1:6969",
//         header:  "x-host"
//     }
    
//     /**
//      * @param { RequestInfo | URL } input 
//      * @param { RequestInit & { proxy?: boolean }} [init] 
//      */
//     function fetchProxy(input, init){
//         if (typeof init == "object" && init.proxy === true) {
//             const url = new URL(input.toString());
//             url.protocol = "http://";
//             const host = url.host;
//             url.host = module.host
//             if ("headers" in init) {
//                 switch (Object.getPrototypeOf(init.headers)) {
//                     case Object.prototype:
//                         (/**@type { Object }*/(init.headers))[module.header] = host;
//                         break;
//                     case Headers.prototype:
//                         (/**@type { Headers }*/(init.headers)).set(module.header, host);
//                         break;
//                     default:
//                         throw new Error("unexpected headers type");
//                 }
//             } else {
//                 init.headers = /**@type {HeadersInit} */ ({
//                     [module.header]: host
//                 })
//             }
//             return fetchOrigin(url, init);
//         } else {
//             return fetchOrigin(input, init)
//         }
//     }
    
//     Object.defineProperty(window, "fetch", {
//         value: fetchProxy
//     });

//     return module;
// })

