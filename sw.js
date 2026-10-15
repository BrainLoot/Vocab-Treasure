/* Vocab Treasure – hält die Login-Seite für den Start ohne Internet bereit.
   Mit Internet kommt immer die aktuelle Seite; die App selbst liegt nicht hier,
   sondern nach dem Anmelden im Speicher des Browsers. */
var CACHE = "vt-seite-1";
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.add("./"); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  var r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || r.mode !== "navigate") return;
  e.respondWith(fetch(r).then(function(antw){
    if (antw.ok){ var k = antw.clone(); caches.open(CACHE).then(function(c){ c.put("./", k); }); }
    return antw;
  }).catch(function(){ return caches.match("./"); }));
});
