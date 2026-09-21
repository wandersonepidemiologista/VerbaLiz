/* Service worker: cache versionado.
   Ao publicar uma versao nova, troque VERSAO. */
const VERSAO = "verbaliz-v15";
const ARQUIVOS = [
  "./",
  "./manifest.webmanifest",
  "./icone-192.png",
  "./icone-512.png",
  "./icone-maskable-512.png",
  "./logo-verbaliz.png",
  "./avatar-liz.jpg",
  "./conteudo/arasaac/2367.png",
  "./conteudo/arasaac/2458.png",
  "./conteudo/arasaac/2494.png",
  "./conteudo/arasaac/2497.png",
  "./conteudo/arasaac/2541.png",
  "./conteudo/arasaac/2806.png",
  "./conteudo/arasaac/3220.png",
  "./conteudo/arasaac/3247.png",
  "./conteudo/arasaac/4577.png",
  "./conteudo/arasaac/4608.png",
  "./conteudo/arasaac/4610.png",
  "./conteudo/arasaac/4611.png",
  "./conteudo/arasaac/4768.png",
  "./conteudo/arasaac/5441.png",
  "./conteudo/arasaac/5526.png",
  "./conteudo/arasaac/5584.png",
  "./conteudo/arasaac/5998.png",
  "./conteudo/arasaac/6058.png",
  "./conteudo/arasaac/6156.png",
  "./conteudo/arasaac/6479.png",
  "./conteudo/arasaac/6568.png",
  "./conteudo/arasaac/6627.png",
  "./conteudo/arasaac/6935.png",
  "./conteudo/arasaac/6964.png",
  "./conteudo/arasaac/7196.png",
  "./conteudo/arasaac/8089.png",
  "./conteudo/arasaac/8163.png",
  "./conteudo/arasaac/8989.png",
  "./conteudo/arasaac/9813.png",
  "./conteudo/arasaac/9907.png",
  "./conteudo/arasaac/10261.png",
  "./conteudo/arasaac/11461.png",
  "./conteudo/arasaac/11476.png",
  "./conteudo/arasaac/24479.png",
  "./conteudo/arasaac/24563.png",
  "./conteudo/arasaac/24791.png",
  "./conteudo/arasaac/26075.png",
  "./conteudo/arasaac/26730.png",
  "./conteudo/arasaac/28651.png",
  "./conteudo/arasaac/28766.png",
  "./conteudo/arasaac/29123.png",
  "./conteudo/arasaac/29824.png",
  "./conteudo/arasaac/29951.png",
  "./conteudo/arasaac/32446.png",
  "./conteudo/arasaac/32464.png",
  "./conteudo/arasaac/32669.png",
  "./conteudo/arasaac/32751.png",
  "./conteudo/arasaac/35537.png",
  "./conteudo/arasaac/35539.png",
  "./conteudo/arasaac/39052.png"
];

self.addEventListener("install", function(ev){
  ev.waitUntil(
    caches.open(VERSAO).then(function(c){ return c.addAll(ARQUIVOS); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(ev){
  ev.waitUntil(
    caches.keys().then(function(chaves){
      return Promise.all(chaves.map(function(k){
        return k === VERSAO ? null : caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(ev){
  if(ev.request.method !== "GET") return;

  /* abrir o app: sempre a página raiz guardada no cache.
     Nunca guardar nem servir resposta redirecionada, que o Chrome recusa. */
  if(ev.request.mode === "navigate"){
    ev.respondWith(
      caches.match("./").then(function(cacheado){
        return cacheado || fetch(ev.request);
      }).catch(function(){ return caches.match("./"); })
    );
    return;
  }

  ev.respondWith(
    caches.match(ev.request).then(function(cacheado){
      if(cacheado) return cacheado;
      return fetch(ev.request).then(function(resp){
        if(resp && resp.status === 200 && resp.type === "basic" && !resp.redirected){
          const copia = resp.clone();
          caches.open(VERSAO).then(function(c){ c.put(ev.request, copia); });
        }
        return resp;
      });
    })
  );
});
