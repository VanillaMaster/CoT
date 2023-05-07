import "./moduleLoader/index.js"

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./worker.js")
}