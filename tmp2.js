function sleep(time) {
    return new Promise((resolve, reject)=>{
        setTimeout(resolve, time);
    })
}


async function* gen(){
    for (let i = 0; true; i++) {
        yield i;
        await sleep(1000);
    }
}

const iter = gen();

async function caller(name) {
    for await (const i of iter) {
        console.log(name, i);
    }
}

caller("a");
caller("b");
caller("c");