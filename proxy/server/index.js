import { createServer, ClientRequest, ServerResponse} from "node:http";
import { request } from "node:https"

const server = createServer();
server.on('request', async (serverReq, serverRes) => {
    const { method, url, headers } = serverReq;
    const {"x-host": host = null} = headers;

    serverRes.setHeader("Access-Control-Allow-Origin", "*");
    serverRes.setHeader("Access-Control-Allow-Methods", "*");
    serverRes.setHeader("Access-Control-Allow-Headers", "*");
    console.log(1);

    if (host == null) {
        serverRes.end();
        return;
    }
    headers.host = host;

    const innerReq = request({
        method,
        host,
        path: url,
        headers,
    }, (innerRes)=>{
        for (const [key, value] of Object.entries(innerRes.headers)) {
            serverRes.setHeader(key, value);
        }
        innerRes.on("data", ServerResponse.prototype.write.bind(serverRes));
        innerRes.on("end", ServerResponse.prototype.end.bind(serverRes))
    });

    serverReq.on("data", ClientRequest.prototype.write.bind(innerReq));
    serverReq.on("end", ClientRequest.prototype.end.bind(innerReq));
});

server.listen(6969);