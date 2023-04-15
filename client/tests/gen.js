function timeout(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    })
}

export async function* gen() {
    const values = [10, 0, 15, 100, 7, 40, 3, 11, 12, 12, 20, 8, 4, 3];
    while (true) {
        for (const value of values) {
            const T = timeout(750);
            yield value
            await T;
        };
    }
}