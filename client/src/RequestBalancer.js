/** @typedef { { [rule: string]: { maxHits: number, currentHits: number, maxRestrict: number, currentRestrict: number period: number }[] } } Rules */


export class RequestBalancer {
    constructor(){}

    /**@type { [URL, RequestInit, (reason: Response | PromiseLike<Response>) => void, (reason?: any) => void][] } */
    #queue = [];
    #running = false;
    #queueProcessor = RequestBalancer.queueProcessor(this);

    /**
     * @param { URL | RequestInfo } input 
     * @param { RequestInit } init 
     * @returns { Promise<Response> }
     */
    fetch(input, init = {}){
        /**@type {Promise<Response>} */
        const resp = new Promise((resolve, reject)=>{
            this.#queue.push([input, {...init, proxy: true}, resolve, reject]);
        });
        if (!this.#running) {
            this.#running = true;
            this.run();
        }
        return resp; 
    }

    /**
     * @private
     */
    async run(){
        for await (const done of this.#queueProcessor) {
            if (done) {
                this.#running = false;
                return;
            }
        }
    }

    /**
     * @param { RequestBalancer } self 
     */
    static async *queueProcessor(self){
        while (true) {

            if (self.#queue.length <= 0) {
                yield true;
                continue;
            }
    
            const [input, init, resolve, reject] = self.#queue.shift();
            /**@type { Response } */
            let resp;
    
            try {
                resp = await fetch(input, init);
            } catch (error) {
                reject(error);
                yield false;
                continue;
            }
        
            const rules = RequestBalancer.parseRules(resp);
            const delay = Math.ceil(RequestBalancer.computeDelay(rules) * 1000 * 1.05);
            
            //console.log(rules);
            //console.log(delay);
            
            const T = RequestBalancer.timeout(delay);
    
            resolve(resp);
    
            yield false;
            await T;
        }
    }

    /**
     * @param { number } timeout
     * @returns { Promise<void> }
     */
    static timeout(timeout) {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        })
    }

    /**
     * @param { Response } resp
     * @returns { Rules }
     */
    static parseRules(resp){
        /**@type { Rules } */
        const result = {}
        const rules = resp.headers.get("X-Rate-Limit-Rules").split(",");

        for (const rule of rules) {
            const states = result[rule] = /**@type { Rules[String] }*/([]);
            /**@type { {[period: number]: Rules[String][number]} } */
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
     * @param { Rules } rules 
     */
    static computeDelay(rules){
        let result = -Infinity;
        for (const rule in rules) {
            for (const limit of rules[rule]) {
                const predictedDelay = limit.period / (limit.maxHits - limit.currentHits);
                const delay = Math.min(predictedDelay, limit.period);
                result = Math.max(result, delay, limit.currentRestrict);
            }
        }
        return result;
    }
}