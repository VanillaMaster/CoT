import { RequestBalancer } from "../src/RequestBalancer.js";
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
        "Content-Type": "application/json",
        "x-host": "www.pathofexile.com"
    }
}

const R = new RequestBalancer();

(async function(){
    while (true) {
        const resp = await R.fetch(url, props);
        const data = await resp.json();
        console.log(data);
        /*
        const [resp1, resp2] = await Promise.all([R.fetch(url, props), R.fetch(url, props)])
        const data1 = await resp1.json()
        const data2 = await resp2.json()
        console.log(data1);
        console.log(data2);
        */
    
    }
})();
