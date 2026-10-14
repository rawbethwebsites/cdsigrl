import type { Doc } from "../../convex/_generated/dataModel";

export type Stop = Doc<"stops">;
export type Tour = Doc<"tours">;

/* ---------- sign-in link ---------- */
const KEY = "cds-mission-token";
export function readToken(): string {
  const k = new URLSearchParams(window.location.search).get("k");
  if (k) {
    try { localStorage.setItem(KEY, k); } catch { /* private mode */ }
    const url = new URL(window.location.href);
    url.searchParams.delete("k");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    return k;
  }
  try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; }
}
export const missionLink = (token: string) => `${window.location.origin}/mission?k=${token}`;

/* ---------- time ---------- */
export const TZ: Record<string, number> = { WAT: 1, CST: 8, EAT: 3 };
export const TZ_LABEL: Record<string, string> = { WAT: "Nigeria", CST: "China", EAT: "Addis Ababa" };
export function startsAt(date: string, time: string, tz: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [h, mi] = (time || "00:00").split(":").map(Number);
  return Date.UTC(y, m - 1, d, h - (TZ[tz] ?? 1), mi || 0);
}
export const hm = (t: number, off: number) => new Date(t + off * 3_600_000).toISOString().slice(11, 16);
const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export function dayLabel(date: string, short = false) {
  const [y, m, d] = date.split("-").map(Number);
  const dow = DOW[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return short ? `${dow.slice(0, 3)} ${d} ${MON[m - 1].slice(0, 3)}` : `${dow} ${d} ${MON[m - 1]}`;
}
export function countdown(ms: number) {
  const m = Math.round(ms / 60000);
  if (m < 1) return "Now";
  if (m < 60) return `in ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `in ${h} h ${m % 60} min`;
  const d = Math.floor(h / 24);
  return `in ${d} day${d > 1 ? "s" : ""} ${h % 24} h`;
}
export function todayIn(tz: string) {
  return new Date(Date.now() + (TZ[tz] ?? 1) * 3_600_000).toISOString().slice(0, 10);
}
const stamp = (t: number) => new Date(t).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
export function calendarLink(s: { title: string; details: string; place: string; city: string }, t: number, end: number) {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: s.title,
    dates: `${stamp(t)}/${stamp(end)}`,
    details: `${s.details}\n\nCDS-IGRL China Partner Mission`,
    location: [s.place, s.city].filter(Boolean).join(", "),
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

export const TYPES: Record<string, string> = {
  flight: "Flight", transfer: "Transfer", hotel: "Hotel", factory: "Factory visit", meeting: "Meeting",
  meal: "Meal", tour: "Tour", free: "Free time", briefing: "Briefing",
};

/** A timeline item: an itinerary stop, or a tour this traveller has joined. */
export type Item = {
  key: string; date: string; time: string; end?: string; tz: string; type: string; title: string;
  city: string; place: string; details: string; sees: string[]; alarm: number; t: number; te: number;
  stopId?: Stop["_id"]; editable: boolean;
};
export function buildItems(stops: Stop[], tours: Tour[], myRequests: { tourId: string; status: string }[]): Item[] {
  const items: Item[] = stops.map((s) => ({
    key: s._id, stopId: s._id, date: s.date, time: s.time, end: s.end, tz: s.tz, type: s.type, title: s.title,
    city: s.city, place: s.place, details: s.details, sees: s.sees, alarm: s.alarm,
    t: startsAt(s.date, s.time, s.tz), te: s.end ? startsAt(s.date, s.end, s.tz) : 0, editable: true,
  }));
  for (const tr of tours) {
    if (myRequests.find((r) => r.tourId === tr._id)?.status !== "confirmed") continue;
    items.push({
      key: `tour:${tr._id}`, date: tr.date, time: tr.time, tz: tr.tz, type: "tour", title: tr.title, city: tr.city,
      place: "", details: [tr.teaser, tr.details].filter(Boolean).join("\n\n"), sees: [], alarm: 60,
      t: startsAt(tr.date, tr.time, tr.tz), te: 0, editable: false,
    });
  }
  return items.sort((a, b) => a.t - b.t);
}
export function groupDays(items: Item[]) {
  const m = new Map<string, Item[]>();
  for (const it of items) { if (!m.has(it.date)) m.set(it.date, []); m.get(it.date)!.push(it); }
  return [...m.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([date, list], i) => ({
    date, list, n: i + 1, city: (list.find((x) => x.type !== "flight") ?? list[0]).city,
  }));
}

/* ---------- photos ---------- */
export function shrinkImage(file: File, max = 1800, q = 0.84): Promise<Blob> {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const sc = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? res(b) : rej(new Error("encode"))), "image/jpeg", q);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("read")); };
    img.src = url;
  });
}

/* ---------- sound ---------- */
let audio: AudioContext | null = null;
export function unlockSound() {
  try {
    audio ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    void audio.resume();
  } catch { /* no audio */ }
}
export function chime(kind: "alarm" | "reward" = "alarm") {
  if (!audio) return;
  const t0 = audio.currentTime;
  const notes = kind === "alarm" ? [880, 660, 880, 660, 880, 660] : [523, 659, 784, 1047];
  notes.forEach((f, i) => {
    const o = audio!.createOscillator(), g = audio!.createGain();
    const at = t0 + i * (kind === "alarm" ? 0.32 : 0.11);
    o.type = kind === "alarm" ? "square" : "triangle";
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(kind === "alarm" ? 0.25 : 0.18, at + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.28);
    o.connect(g).connect(audio!.destination);
    o.start(at); o.stop(at + 0.3);
  });
  try { navigator.vibrate?.(kind === "alarm" ? [400, 150, 400, 150, 400] : 60); } catch { /* no vibration */ }
}

/* ---------- wake-up alerts (web push) ---------- */
const b64 = (s: string) => {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const raw = atob((s + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};
export const pushSupported = () => "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
export const isInstalled = () => window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
export async function alertsActive() {
  if (!pushSupported() || Notification.permission !== "granted") return false;
  const reg = await navigator.serviceWorker.getRegistration("/os/");
  return !!(await reg?.pushManager.getSubscription());
}
export async function turnOnAlerts(publicKey: string) {
  const reg = await navigator.serviceWorker.register("/os/mission-sw.js", { scope: "/os/" });
  // The page is outside the worker's scope, so `serviceWorker.ready` would never resolve: wait for activation directly.
  const sw = reg.installing ?? reg.waiting;
  if (sw && !reg.active) await new Promise<void>((r) => sw.addEventListener("statechange", () => sw.state === "activated" && r()));
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error("denied");
  const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(publicKey) }));
  const j = sub.toJSON();
  return { endpoint: j.endpoint!, p256dh: j.keys!.p256dh, auth: j.keys!.auth };
}
