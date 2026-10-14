// CDS-IGRL China Mission: wake-up calls and stop alarms arrive here even when the page is closed.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data && e.data.text() }; }
  e.waitUntil(
    self.registration.showNotification(d.title || "CDS-IGRL Mission", {
      body: d.body || "",
      tag: d.tag,
      renotify: true,
      requireInteraction: true,
      vibrate: [400, 200, 400, 200, 400],
      icon: "/os/mission-icon.png",
      badge: "/os/mission-icon.png",
      data: { url: d.url || "/mission" },
    }),
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/mission";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const w of wins) if (w.url.includes("/mission") && "focus" in w) return w.focus();
      return self.clients.openWindow(url);
    }),
  );
});
