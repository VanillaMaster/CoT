/// <reference lib="WebWorker"/>
/**@type { ServiceWorkerGlobalScope } */
const self = /**@type {*}*/ (globalThis.self);

self.addEventListener('install', (event) => {
    console.log('Установлен');
    self.skipWaiting()
});



self.addEventListener('activate', (event) => {
    console.log('Активирован');
});

self.addEventListener('fetch', (event) => {
    console.log('Происходит запрос на сервер');
});