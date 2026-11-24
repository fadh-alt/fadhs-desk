// dash-io offline worker, build 20261124053444
const SHELL = "fyd-shell-20261124053444";
const RUNTIME = "fyd-runtime-v1";
const FILES = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/favicon-32-blink.png"];
const LIBS = [
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
  "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
].filter(Boolean);
async function cacheLibs() {
  const c = await caches.open(RUNTIME);
  await Promise.all(LIBS.map(async u => {
    try { if (await c.match(u)) return; const r = await fetch(new Request(u, { mode: "no-cors" })); if (r && (r.ok || r.type === "opaque")) await c.put(u, r); } catch (e) {}
  }));
}
self.addEventListener("install", e => { e.waitUntil(caches.open(SHELL).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => cacheLibs()).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("fyd-shell-") && k !== SHELL).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: "dash-io", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "dash-io", { body: d.body || "", icon: "icons/icon-192.png", badge: "icons/favicon-32.png", tag: d.tag || undefined, renotify: !!d.tag, data: { url: d.url || "#desk" } }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const hash = (e.notification.data && e.notification.data.url) || "#desk";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) { c.postMessage({ go: hash }); return c.focus(); } }
    return self.clients.openWindow(new URL("./" + hash, self.registration.scope).href);
  }));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (req.mode === "navigate") {
    e.respondWith(caches.open(SHELL).then(c => c.match("index.html").then(hit => {
      const net = fetch(req, { cache: "no-store" }).then(r => { if (r && r.ok) c.put("index.html", r.clone()); return r; });
      if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
      return net.catch(() => caches.match("index.html"));
    })));
    return;
  }
  if (url.origin === self.location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
    return;
  }
  if (/(cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname)) {
    e.respondWith(caches.open(RUNTIME).then(c => c.match(req, { ignoreVary: true }).then(hit => hit || c.match(req.url)).then(hit => {
      const net = fetch(req).then(r => { if (r && (r.ok || r.type === "opaque")) c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    })));
  }
});
