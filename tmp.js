/** @typedef { { [rule: string]: { maxHits: number, currentHits: number, maxRestrict: number, currentRestrict: number period: number }[] } } Rulse */


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

const props = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
        "Content-Type": "application/json"
    }
}

const R = {
    /**
     * @private
     * @type { [URL, RequestInit, (reason?: any) => void, (reason?: any) => void][] }
     */
    queue: [],
    /**@private */
    running: false,
    /**
     * @private
     * @type { ReturnType<requestGen> }
     */
    queueProcessor: undefined,
    /**
     * @param { URL } url 
     * @param { RequestInit } props 
     * @returns 
     */
    call(url, props) {
        const resp = new Promise((resolve, reject)=>{
            this.queue.push([url, props, resolve, reject]);
        });
        if (!this.running) {
            this.running = true;
            this.run();
        }
        return resp;
    },
    /**
     * @private
     */
    async run(){
        for await (const done of this.queueProcessor) {
            if (done) {
                this.running = false;
                return;
            }
        }
    }
}
R.queueProcessor = requestGen(R);

/**
 * @param { { queue: [URL, RequestInit, (reason?: any) => void, (reason?: any) => void][] } } self 
 */
async function* requestGen(self){
    while (true) {

        if (self.queue.length <= 0) {
            yield true;
            continue;
        }

        const [url, props, resolve, reject] = self.queue.shift();
        let /**@type { Response } */ resp, /**@type { any } */ data;

        try {
            resp = await fetch(url, props);
            data = await resp.json();
        } catch (error) {
            reject(error);
            yield false;
            continue;
        }
    
        const rules = parseRules(resp);
        const delay = Math.ceil(computeDelay(rules) * 1000 * 1.05);
        //console.log(rules);
        //console.log(delay);
        const T = timeout(delay);

        resolve(data);

        yield false;
        await T;
    }
}

function timeout(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    })
}

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







while (true) {
    const resp = await R.call(url, props);
    console.log(resp);
}