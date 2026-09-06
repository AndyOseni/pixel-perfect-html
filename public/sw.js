/* NUT Eti-Osa COOP offline support.
   Navigations: network first, cached copy when offline.
   Same-origin static app files: cache first, refreshed in the background.
   Kill switch: open any page with ?sw=off to unregister this worker. */
var VERSION = "nut-v1";
var SHELL = "nut-shell-" + VERSION;
var ASSETS = "nut-assets-" + VERSION;
var PRECACHE = [
  "/app/index.html",
  "/app/portal.js",
  "/app/chat.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(ASSETS).then(function (cache) {
      return Promise.allSettled(PRECACHE.map(function (u) { return cache.add(new Request(u, { cache: "reload" })); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.allSettled(
        names
          .filter(function (n) { return /^nut-(shell|assets)-/.test(n) && n.indexOf(VERSION) === -1; })
          .map(function (n) { return caches.delete(n); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

function isStaticAsset(url) {
  return (
    url.origin === self.location.origin &&
    (url.pathname.indexOf("/app/") === 0 ||
      url.pathname === "/manifest.json" ||
      /\.(png|jpg|jpeg|svg|webp|ico|css|js|woff2?)$/.test(url.pathname)) &&
    url.pathname.indexOf("/sw.js") === -1
  );
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.pathname.indexOf("/~oauth") === 0) return;
  if (url.searchParams.get("sw") === "off") return;

  /* HTML navigations: network first, fall back to the cached page */
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(SHELL).then(function (c) { c.put(req, copy); });
          return res;
        })
        .catch(function () {
          return caches.match(req).then(function (hit) {
            return hit || caches.match("/app/index.html");
          });
        })
    );
    return;
  }

  if (!isStaticAsset(url)) return; /* API / Supabase traffic always goes to the network */

  event.respondWith(
    caches.match(req).then(function (hit) {
      var network = fetch(req)
        .then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(ASSETS).then(function (c) { c.put(req, copy); });
          }
          return res;
        })
        .catch(function () { return hit; });
      return hit || network;
    })
  );
});
