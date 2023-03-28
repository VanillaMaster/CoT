const url = new URL("https://www.pathofexile.com/api/trade/exchange/Standard");

const body = {
    "query": {
        "status": {
            "option": "online"
        },
        "have": [
            "divine"
        ],
        "want": [
            "chaos"
        ]
    },
    "sort": {
        "have": "asc"
    },
    "engine": "new"
}


class TradeQuery {
    constructor(){
        return null;
    }

    /**@param { TradeQuery } self */
    static setReady(self) { self.#ready = true; }

    /**@type { [URL, RequestInit, (value: any) => void, (value: any) => void][] } */
    static #queue = [];

    static async *#iter(){
        while (true) {
            
        }
    }

    static #ready = true;

    /**
     * @param { URL } url 
     * @param { RequestInit } props 
     */
    static call(url, props){
        const result = new Promise((reject, resolve) => {
            this.#queue.push([url, props, resolve, reject]);
        });
        //if (this.#ready) this.next();
        return result;
    }

    static async next() {
        if (this.#queue.length <= 0) return;
        if (!this.#ready) return;
        this.#ready = false;

        const [url, props, resolve, reject] = this.#queue.shift();
        let /**@type { any } */ data, /**@type { Response } */ resp;
        try {
            resp = await fetch(url, props);
            data = await resp.json();
        } catch (error) {
            reject(error);
            return;
        }

        const rules = parseRules(resp);
        const delay = Math.ceil(computeDelay(rules) * 1000 * 1.05);
        setTimeout(TradeQuery.setReady, delay, this);
        
        resolve(data);
    }
}


const iter = makeRequest();
for await (const data of iter) {
    console.log(data);
}

async function* makeRequest(){
    let /**@type { URL } */ url, /**@type { RequestInit } */ props;
    while (true) {
        const resp = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await resp.json();
    
        const rules = parseRules(resp);
        const delay = Math.ceil(computeDelay(rules) * 1000 * 1.05);
        console.log(rules);
        console.log(delay);
        yield data;
        await timeout(delay);
    }
}

function timeout(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    })
}



/** @typedef { { [rule: string]: { maxHits: number, currentHits: number, maxRestrict: number, currentRestrict: number period: number }[] } } Rulse */



/**
 * @param { Response } resp
 * @returns { Rulse }
 */
function parseRules(resp) {
    /**@type { Rulse } */
    const result = {}
    const rules = resp.headers.get("X-Rate-Limit-Rules").split(",");

    for (const rule of rules) {
        const states = result[rule] = /**@type { Rulse[String] }*/([]);
        /**@type { {[period: number]: Rulse[String][number]} } */
        const rulseByPeriod = {};
        for (const limit of resp.headers.get(`X-Rate-Limit-${rule}`).split(",")) {
            const [hits, period, restrict] = limit.split(":").map((s)=>parseInt(s));
            const element = rulseByPeriod[period] = {
                maxHits: hits,
                maxRestrict: restrict,
                period: period,
                currentHits: 0,
                currentRestrict: 0
            }
            states.push(element);
        }
        for (const state of resp.headers.get(`X-Rate-Limit-${rule}-State`).split(",")) {
            const [hits, period, restrict] = state.split(":").map((s)=>parseInt(s));
            const element = rulseByPeriod[period];
            element.currentHits = hits;
            element.currentRestrict = restrict;
        }
    }
    return result;
}


/**
 * @param { Rulse } data 
 */
function computeDelay(data) {
    let result = -Infinity;
    for (const rule in data) {
        for (const limit of data[rule]) {
            const predictedDelay = limit.period / (limit.maxHits - limit.currentHits);
            const delay = Math.min(predictedDelay, limit.period);
            result = Math.max(result, delay, limit.currentRestrict);
        }
    }
    return result;
}
