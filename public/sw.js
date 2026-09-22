/* Service worker: cache versionado.
   Ao publicar uma versao nova, troque VERSAO. */
const VERSAO = "verbaliz-v22";
const ARQUIVOS = [
  "./",
  "./manifest.webmanifest",
  "./icone-192.png",
  "./icone-512.png",
  "./icone-maskable-512.png",
  "./logo-verbaliz.png",
  "./avatar-liz.jpg",
  "./paginas.css",
  "./sobre/",
  "./ajuda/",
  "./epic95-logo.png",
  "./licenciamento/",
  "./instalacao/",
  "./participe/",
  "./quem-ajuda/",
  "./colaboradores.json",
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
  const url = new URL(ev.request.url);

  /* navegação: a raiz abre o app; as páginas do site (sobre, licenciamento,
     instalação) vêm da rede e caem no cache quando não há internet.
     Resposta redirecionada nunca é guardada, porque o Chrome a recusa. */
  if(ev.request.mode === "navigate"){
    const raiz = url.pathname === "/" || url.pathname === "/index.html";
    if(raiz){
      ev.respondWith(
        caches.match("./").then(function(c){ return c || fetch(ev.request); })
          .catch(function(){ return caches.match("./"); })
      );
      return;
    }
    const comBarra = url.pathname.endsWith("/") ? url.pathname : url.pathname + "/";
    ev.respondWith(
      fetch(ev.request).then(function(resp){
        if(resp && resp.status === 200 && !resp.redirected){
          const copia = resp.clone();
          caches.open(VERSAO).then(function(c){ c.put(comBarra, copia); });
        }
        return resp;
      }).catch(function(){
        return caches.match(comBarra).then(function(c){ return c || caches.match("./"); });
      })
    );
    return;
  }

  /* lista de colaboradores: rede primeiro, para atualizar sem nova versão */
  if(url.pathname.endsWith("/colaboradores.json")){
    ev.respondWith(
      fetch(ev.request).then(function(resp){
        if(resp && resp.status === 200 && !resp.redirected){
          const copia = resp.clone();
          caches.open(VERSAO).then(function(c){ c.put("./colaboradores.json", copia); });
        }
        return resp;
      }).catch(function(){ return caches.match("./colaboradores.json"); })
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
