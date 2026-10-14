import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, BookOpen, Camera, Compass, Lock, Medal as MedalIcon, Route, Settings2, Unlock } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { LogoMark } from "@/components/Logo";
import { cn } from "@/utils/cn";
import { alertsActive, buildItems, chime, countdown, dayLabel, groupDays, hm, isInstalled, isIOS, pushSupported, todayIn, turnOnAlerts, unlockSound } from "./lib";
import StopCard from "./StopCard";
import { StopEditor, type StopDraft } from "./editors";
import { Bar, BigButton, Burst, CountUp, Medal, Overlay, toast } from "./ui";

type Tab = "today" | "tours" | "medals" | "photos";

export default function MissionHome({ token }: { token: string }) {
  const me = useQuery(api.mission.me, { token });
  const trip = useQuery(api.mission.trip, me ? { token } : "skip");
  const journal = useQuery(api.mission.journal, me ? { token } : "skip");
  const call = useQuery(api.calls.pending, me ? { token } : "skip");
  const heartbeat = useMutation(api.mission.heartbeat);
  const [tab, setTab] = useState<Tab>("today");
  const [now, setNow] = useState(Date.now());
  const [editing, setEditing] = useState<StopDraft | null>(null);

  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 15_000); return () => clearInterval(i); }, []);
  useEffect(() => {
    if (!me) return;
    void heartbeat({ token });
    const i = setInterval(() => void heartbeat({ token }), 60_000);
    return () => clearInterval(i);
  }, [me?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Points going up get their own little moment.
  const lastPts = useRef<number | null>(null);
  useEffect(() => {
    if (!me) return;
    if (lastPts.current !== null && me.stats.points > lastPts.current) chime("reward");
    lastPts.current = me.stats.points;
  }, [me?.stats.points]); // eslint-disable-line react-hooks/exhaustive-deps

  const items = useMemo(() => (trip ? buildItems(trip.stops, trip.tours, trip.myRequests) : []), [trip]);

  if (me === undefined) return <Splash text="Opening your mission…" />;
  if (me === null) return <Splash text="This link isn't valid. Ask the trip leader to send you your personal mission link." />;

  const newBadge = me.badgeCatalog.find((b) => me.stats.badges.includes(b.id) && !me.seenBadges.includes(b.id));
  const nPhotos = journal?.photos.length ?? 0;

  return (
    <div className="min-h-screen bg-ink pb-24 text-cream">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <LogoMark className="h-10 w-10 shrink-0" />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-lg font-black tracking-tight">{trip?.meta.name ?? "China Partner Mission"}</div>
            <div className="truncate text-sm text-white/55">{me.name}{me.title ? ` · ${me.title}` : ""}</div>
          </div>
          {me.role === "admin" && (
            <Link to="/mission/control" aria-label="Trip control" className="ml-auto inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-brand/50 px-3 text-base font-bold text-brand hover:bg-brand/10"><Settings2 size={18} /><span className="hidden sm:inline">Trip control</span></Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        <Hero items={items} now={now} meta={trip?.meta} name={me.name} />
        <ScoreBar stats={me.stats} badges={me.badgeCatalog.filter((b) => me.stats.badges.includes(b.id))} onOpen={() => setTab("medals")} />
        <AlertsCard token={token} />

        <nav className="sticky top-[72px] z-20 -mx-4 mt-6 flex gap-1 overflow-x-auto border-b border-white/10 bg-ink px-4" role="tablist">
          {([["today", "Itinerary", Route], ["tours", "Tours", Compass], ["medals", "Medals", MedalIcon], ["photos", `Photos${nPhotos ? ` (${nPhotos})` : ""}`, Camera]] as const).map(([k, label, Icon]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              className={cn("flex min-h-14 items-center gap-2 whitespace-nowrap border-b-[3px] px-4 text-lg font-bold", tab === k ? "border-brand text-cream" : "border-transparent text-white/50 hover:text-cream")}>
              <Icon size={20} /> {label}
            </button>
          ))}
          <Link to="/mission/storybook" className="flex min-h-14 items-center gap-2 whitespace-nowrap px-4 text-lg font-bold text-white/50 hover:text-cream"><BookOpen size={20} /> Storybook</Link>
        </nav>

        {!trip || !journal ? <p className="py-16 text-center text-xl text-white/60">Loading the itinerary…</p>
          : tab === "today" ? <Itinerary items={items} now={now} token={token} journal={journal} factoryProgress={me.stats.factoryProgress} canEdit={me.role === "admin"} onEdit={setEditing} />
          : tab === "tours" ? <Tours token={token} tours={trip.tours} myRequests={trip.myRequests} />
          : tab === "medals" ? <Medals token={token} stats={me.stats} catalog={me.badgeCatalog} />
          : <Photos items={items} journal={journal} />}
      </main>

      <AnimatePresence>
        {!me.checkedIn ? <Welcome key="w" token={token} name={me.name} />
          : call ? <CallAlert key={call._id} token={token} call={call} />
          : newBadge ? <BadgeUnlocked key={newBadge.id} token={token} badge={newBadge} /> : null}
      </AnimatePresence>
      {editing && <StopEditor token={token} stop={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function Splash({ text }: { text: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-ink p-6 text-center text-cream">
      <div><LogoMark className="mx-auto h-16 w-16" /><p className="mt-6 max-w-md text-xl">{text}</p></div>
    </div>
  );
}

/* ---------- hero: greeting, clocks, next up ---------- */
function Hero({ items, now, meta, name }: { items: ReturnType<typeof buildItems>; now: number; meta?: { route: string[]; dates: string }; name: string }) {
  const cur = items.filter((s) => s.t <= now && now < (s.te || s.t + 45 * 60_000)).pop();
  const next = items.find((s) => s.t > now);
  const g = cur ?? next;
  const h = Number(hm(now, items.find((s) => s.date === todayIn(s.tz))?.tz === "CST" ? 8 : 1).slice(0, 2));
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return (
    <section className="grid gap-4 pt-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="flex flex-col justify-between gap-5">
        <div>
          <p className="text-lg font-semibold text-brand">{greet}, {name.split(" ")[0]}</p>
          <h1 className="mt-1 text-[clamp(1.75rem,6vw,3.4rem)] font-black leading-[0.95] tracking-tight [overflow-wrap:anywhere]">Your mission to find Nigeria's metrology partners</h1>
          {meta && <p className="mt-3 text-lg text-white/60">{meta.route.join(" → ")}{meta.dates ? ` · ${meta.dates}` : ""}</p>}
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {[["Abuja", 1], ["China", 8]].map(([city, off]) => (
            <div key={city}><div className="text-sm font-bold uppercase tracking-widest text-white/45">{city}</div><div className="text-3xl font-black tabular-nums sm:text-4xl">{hm(now, off as number)}</div></div>
          ))}
        </div>
      </div>
      <motion.div layout className="rounded-3xl bg-gradient-to-br from-brand to-brand-deep p-6 text-ink">
        <div className="text-sm font-black uppercase tracking-widest opacity-70">{cur ? "Happening now" : g ? "Next up" : "Mission"}</div>
        <div className="mt-2 text-2xl font-black leading-tight tracking-tight sm:text-3xl">{g ? g.title : items.length ? "Mission complete. Welcome home." : "Itinerary coming soon"}</div>
        {g && <div className="mt-2 text-lg font-semibold opacity-80">{dayLabel(g.date)} · {g.time} {g.tz}{g.tz !== "WAT" ? ` (${hm(g.t, 1)} Abuja)` : ""}</div>}
        {g && <div className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{cur ? "Now" : countdown(g.t - now)}</div>}
        {g?.place && <div className="mt-3 text-lg font-semibold opacity-80">{g.place}</div>}
      </motion.div>
    </section>
  );
}

type Me = NonNullable<FunctionReturnType<typeof api.mission.me>>;
type Stats = Me["stats"];
type Catalog = Me["badgeCatalog"];

function ScoreBar({ stats, badges, onOpen }: { stats: Stats; badges: Catalog; onOpen: () => void }) {
  const span = stats.nextLevel ? stats.nextLevel.at - stats.levelFloor : 1;
  const into = stats.points - stats.levelFloor;
  return (
    <button type="button" onClick={onOpen} className="mt-6 grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-5 rounded-3xl border border-white/10 bg-coal p-5 text-left hover:border-brand/50 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
      <div>
        <CountUp value={stats.points} className="block text-5xl font-black tabular-nums leading-none text-brand" />
        <div className="mt-1 text-sm font-bold uppercase tracking-widest text-white/50">points</div>
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-extrabold">{stats.level}</div>
        <Bar value={stats.nextLevel ? into / span : 1} className="mt-2" />
        <div className="mt-1.5 text-base text-white/55">{stats.nextLevel ? `${stats.nextLevel.at - stats.points} points to ${stats.nextLevel.name}` : "Highest rank reached"} · {stats.factoriesDone} of {stats.factoriesTotal} factories inspected</div>
      </div>
      <div className="col-span-2 flex flex-wrap gap-1.5 sm:col-span-1 sm:justify-end">
        {badges.length ? badges.map((b) => <Medal key={b.id} mark={b.mark} size="sm" />) : <span className="text-base text-white/50">Your medals appear here</span>}
      </div>
    </button>
  );
}

/* ---------- wake-up alerts on this phone ---------- */
function AlertsCard({ token }: { token: string }) {
  const key = useQuery(api.alerts.publicKey, {});
  const subscribe = useMutation(api.alerts.subscribe);
  const [on, setOn] = useState<boolean | null>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => { void alertsActive().then(setOn); }, []);
  if (on !== false || !key) return null;
  const needsInstall = isIOS() && !isInstalled();
  return (
    <section className="mt-4 flex flex-col gap-4 rounded-3xl border-2 border-amber-400/50 bg-amber-400/[.07] p-5 sm:flex-row sm:items-center">
      <BellRing className="shrink-0 text-amber-300" size={36} />
      <div className="min-w-0 flex-1">
        <div className="text-xl font-extrabold">Turn on wake-up alerts</div>
        <p className="mt-1 text-lg text-white/70">{needsInstall
          ? "On iPhone: tap the Share button, choose “Add to Home Screen”, then open the mission from the new icon and tap this again."
          : !pushSupported() ? "This browser can't receive alerts. Open your link in Chrome or Safari." : "So the trip leader's wake-up and lobby calls reach your phone even when this page is closed."}</p>
        {msg && <p className="mt-1 text-amber-200">{msg}</p>}
      </div>
      {!needsInstall && pushSupported() && (
        <BigButton onClick={async () => {
          unlockSound();
          try { const s = await turnOnAlerts(key); await subscribe({ token, ...s }); setOn(true); toast("Wake-up alerts are on"); }
          catch (e) { setMsg(e instanceof Error && e.message === "denied" ? "Alerts were blocked. Allow notifications for this site in your phone settings, then try again." : "Couldn't turn on alerts. Try again."); }
        }}>Turn on alerts</BigButton>
      )}
    </section>
  );
}

/* ---------- itinerary ---------- */
function Itinerary({ items, now, token, journal, canEdit, onEdit }: {
  items: ReturnType<typeof buildItems>; now: number; token: string; canEdit: boolean; onEdit: (s: StopDraft) => void;
  journal: { entries: { stopKey: string; note: string; items: { i: number; note: string; score: number }[] }[]; photos: { _id: Id<"photos">; stopKey: string; url: string | null }[] };
  factoryProgress: Record<string, { scored: number; total: number }>;
}) {
  const days = groupDays(items);
  const today = days.find((d) => d.list.some((s) => todayIn(s.tz) === d.date))?.date;
  const [day, setDay] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const trip = useQuery(api.mission.trip, { token });
  if (!days.length) return <p className="py-16 text-center text-xl text-white/60">The trip leader is still building the itinerary.</p>;
  const cur = days.find((d) => d.date === (day ?? today)) ?? days[0];
  const toggle = (k: string) => setOpen((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const facs = cur.list.filter((s) => s.type === "factory").length;
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:sticky lg:top-[140px] lg:mx-0 lg:flex-col lg:self-start lg:overflow-visible lg:px-0">
        {days.map((d) => {
          const done = d.list.every((s) => (s.te || s.t + 3_600_000) < now);
          return (
            <button key={d.date} onClick={() => setDay(d.date)} aria-current={d.date === cur.date}
              className={cn("flex min-w-[150px] items-center gap-3 whitespace-nowrap rounded-2xl border px-3 py-2.5 text-left lg:min-w-0", d.date === cur.date ? "border-brand bg-brand/10" : "border-white/10 hover:border-white/30")}>
              <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg font-black", d.date === cur.date ? "bg-brand text-ink" : done ? "bg-white/10 text-brand" : "bg-white/5 text-white/60")}>{done ? "✓" : d.n}</span>
              <span className="leading-tight"><span className="block text-base font-bold">{dayLabel(d.date, true)}</span><span className="block text-sm text-white/50">{d.date === today ? "Today" : d.city}</span></span>
            </button>
          );
        })}
      </div>
      <section className="min-w-0">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-base font-bold uppercase tracking-widest text-brand">Day {cur.n} of {days.length} · {cur.city}</div>
            <h2 className="text-3xl font-black tracking-tight">{dayLabel(cur.date)}</h2>
          </div>
          <div className="flex items-center gap-4 text-lg text-white/60">
            {cur.list.length} stops{facs ? ` · ${facs} factor${facs > 1 ? "ies" : "y"}` : ""}
            {canEdit && <button onClick={() => onEdit({ date: cur.date })} className="rounded-xl border border-white/15 px-3 py-2 text-base font-bold hover:border-brand hover:text-brand">Add a stop</button>}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {cur.list.map((it) => (
            <StopCard key={it.key} item={it} token={token} now={now} open={open.has(it.key)} onToggle={() => toggle(it.key)}
              entry={journal.entries.find((e) => e.stopKey === it.key)} photos={journal.photos.filter((p) => p.stopKey === it.key)}
              onEdit={canEdit && it.stopId ? () => onEdit(trip?.stops.find((s) => s._id === it.stopId) ?? {}) : undefined} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------- tours ---------- */
function Tours({ token, tours, myRequests }: { token: string; tours: { _id: Id<"tours">; title: string; city: string; date: string; time: string; tz: string; duration: string; price: string; teaser: string; details: string; visible: boolean }[]; myRequests: { tourId: string; status: string }[] }) {
  const request = useMutation(api.mission.requestTour);
  const cancel = useMutation(api.mission.cancelTour);
  const sorted = [...tours].sort((a, b) => (a.date + a.time < b.date + b.time ? -1 : 1));
  return (
    <section className="mt-6">
      <h2 className="text-3xl font-black tracking-tight">Tours beyond the mission</h2>
      <p className="mt-2 max-w-2xl text-lg text-white/65">Unlock a tour to ask for a seat. Once the trip leader confirms it, the meeting point appears and the tour joins your itinerary with its own alarm. Joining a tour earns 25 points and the Explorer medal.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {sorted.map((t) => {
          const st = myRequests.find((r) => r.tourId === t._id)?.status;
          const unlocked = st === "confirmed";
          return (
            <motion.article key={t._id} layout className={cn("flex flex-col gap-3 rounded-3xl border p-6", unlocked ? "border-amber-400/60 bg-amber-400/[.06]" : "border-white/10 bg-coal")}>
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-amber-300">{unlocked ? <Unlock size={16} /> : <Lock size={16} />} {unlocked ? "Unlocked" : "Locked tour"}{!t.visible && " · hidden"}</div>
              <h3 className="text-2xl font-extrabold leading-tight">{t.title}</h3>
              <div className="text-lg text-white/60">{t.city} · {t.date ? dayLabel(t.date, true) : ""} · {t.time} {t.tz} · {t.duration}</div>
              <p className="text-lg text-white/85">{t.teaser}</p>
              {t.details && <p className={cn("text-lg", unlocked ? "text-amber-100" : "select-none text-white/40 blur-[5px]")} aria-hidden={!unlocked}>{unlocked ? t.details : t.details.replace(/\S/g, "x")}</p>}
              <div className="text-base text-white/50">{t.price}</div>
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                {!st && <BigButton onClick={async () => { await request({ token, tourId: t._id }); toast("Request sent to the trip leader"); }}><span className="inline-flex items-center gap-2"><Unlock size={20} /> Unlock this tour</span></BigButton>}
                {st === "requested" && <><span className="rounded-xl bg-amber-400/15 px-4 py-3 text-lg font-bold text-amber-200">Waiting for the trip leader</span><button className="text-base text-white/60 underline" onClick={() => void cancel({ token, tourId: t._id })}>Cancel</button></>}
                {st === "confirmed" && <span className="rounded-xl bg-brand/15 px-4 py-3 text-lg font-bold text-brand">On your itinerary</span>}
                {st === "declined" && <span className="rounded-xl bg-red-500/10 px-4 py-3 text-lg font-bold text-red-300">Not available this time</span>}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- medals & standings ---------- */
function Medals({ token, stats, catalog }: { token: string; stats: Stats; catalog: Catalog }) {
  const standings = useQuery(api.mission.standings, { token });
  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div>
        <h2 className="text-3xl font-black tracking-tight">Your medals</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {catalog.map((b) => {
            const got = stats.badges.includes(b.id);
            return (
              <div key={b.id} className={cn("flex items-center gap-4 rounded-2xl border p-4", got ? "border-amber-400/40 bg-amber-400/[.05]" : "border-white/10 bg-coal")}>
                <Medal mark={b.mark} locked={!got} />
                <div><div className="text-lg font-extrabold">{b.name}</div><div className="text-base text-white/55">{got ? "Earned" : b.how}</div></div>
              </div>
            );
          })}
        </div>
        <h3 className="mt-8 text-2xl font-extrabold">How your points add up</h3>
        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
          {stats.breakdown.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-4 border-b border-white/5 px-4 py-3 text-lg last:border-0">
              <span>{r.label} <span className="text-white/45">· {r.each} each</span></span>
              <span className="font-bold tabular-nums">{r.n} → {r.n * r.each}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-black tracking-tight">Delegation standings</h2>
        <div className="mt-4 rounded-3xl border border-white/10 bg-coal p-2">
          {!standings ? <p className="p-4 text-white/60">Loading…</p> : standings.map((r, i) => (
            <div key={r._id} className={cn("grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl px-3 py-3", r.isMe && "bg-brand/10")}>
              <span className={cn("text-center text-2xl font-black", i === 0 ? "text-amber-300" : "text-white/40")}>{i + 1}</span>
              <span className="min-w-0"><span className="block truncate text-lg font-bold"><span className={cn("mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle", r.online ? "bg-brand" : "bg-white/20")} title={r.online ? "Online now" : "Offline"} />{r.name}{r.isMe && " (you)"}</span><span className="block text-base text-white/50">{r.level} · {r.badges} medal{r.badges === 1 ? "" : "s"}</span></span>
              <span className="text-2xl font-black tabular-nums text-brand">{r.points}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Photos({ items, journal }: { items: ReturnType<typeof buildItems>; journal: { photos: { _id: Id<"photos">; stopKey: string; url: string | null }[] } }) {
  const withPhotos = items.filter((it) => journal.photos.some((p) => p.stopKey === it.key));
  if (!withPhotos.length) return <p className="py-16 text-center text-xl text-white/60">No photos yet. Open any stop in the itinerary and tap “Add photos”. Each one earns 5 points and goes into your storybook.</p>;
  return (
    <section className="mt-6 flex flex-col gap-8">
      {withPhotos.map((it) => (
        <div key={it.key}>
          <div className="text-base font-bold uppercase tracking-widest text-brand">{dayLabel(it.date, true)} · {it.city}</div>
          <h3 className="text-2xl font-extrabold">{it.title}</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {journal.photos.filter((p) => p.stopKey === it.key).map((p) => p.url && <img key={p._id} src={p.url} alt={`Photo at ${it.title}`} className="aspect-square w-full rounded-xl object-cover" loading="lazy" />)}
          </div>
        </div>
      ))}
    </section>
  );
}

/* ---------- overlays ---------- */
function Welcome({ token, name }: { token: string; name: string }) {
  const checkIn = useMutation(api.mission.checkIn);
  return (
    <Overlay>
      <Burst />
      <LogoMark className="mx-auto h-16 w-16" />
      <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight">Welcome aboard, {name.split(" ")[0]}</h2>
      <p className="mt-4 text-xl text-white/75">This is your guide for the China Partner Mission: every flight, factory and dinner, with alarms.</p>
      <ul className="mx-auto mt-5 max-w-sm space-y-2 text-left text-lg text-white/80">
        <li>Score each factory check from 1 to 5 and earn points</li>
        <li>Answer the trip leader's wake-up calls quickly for bonus points</li>
        <li>Collect medals and keep a storybook of the journey</li>
      </ul>
      <BigButton className="mt-7 w-full text-xl" onClick={() => { unlockSound(); chime("reward"); void checkIn({ token }); }}>Check in · +50 points</BigButton>
    </Overlay>
  );
}

function CallAlert({ token, call }: { token: string; call: { _id: Id<"calls">; kind: string; message: string; options: string[]; sentAt: number } }) {
  const answer = useMutation(api.calls.answer);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    chime("alarm");
    const i = setInterval(() => chime("alarm"), 4000);
    const stop = setTimeout(() => clearInterval(i), 120_000);
    return () => { clearInterval(i); clearTimeout(stop); };
  }, []);
  return (
    <Overlay tone="alarm">
      <motion.div animate={{ rotate: [0, -14, 14, -14, 14, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }} className="inline-block text-red-400"><BellRing size={64} /></motion.div>
      <div className="mt-3 text-base font-bold uppercase tracking-widest text-red-300">From the trip leader · {hm(call.sentAt, 8)} China time</div>
      <h2 className="mt-2 text-5xl font-black leading-none tracking-tight">{call.kind}</h2>
      <p className="mt-4 text-2xl text-white/85">{call.message}</p>
      <div className="mt-7 flex flex-col gap-3">
        {call.options.map((o, i) => (
          <BigButton key={o} tone={i === 0 ? "brand" : "ghost"} disabled={busy} className="py-5 text-2xl" onClick={async () => {
            setBusy(true);
            try { const r = await answer({ token, callId: call._id, choice: o }); toast(r.quick ? "Quick response bonus included" : "Answer sent", `+${r.points}`); }
            catch { setBusy(false); }
          }}>{o}</BigButton>
        ))}
      </div>
      <p className="mt-4 text-base text-white/50">Answer within 5 minutes for 30 points</p>
    </Overlay>
  );
}

function BadgeUnlocked({ token, badge }: { token: string; badge: { id: string; mark: string; name: string; how: string } }) {
  const seen = useMutation(api.mission.markBadgesSeen);
  useEffect(() => { chime("reward"); }, []);
  return (
    <Overlay>
      <Burst />
      <motion.div initial={{ scale: 0.2, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 180, damping: 10 }}>
        <div className="flex justify-center"><Medal mark={badge.mark} size="lg" /></div>
      </motion.div>
      <div className="mt-5 text-base font-bold uppercase tracking-widest text-amber-300">Medal earned</div>
      <h2 className="mt-1 text-4xl font-black tracking-tight">{badge.name}</h2>
      <p className="mt-3 text-xl text-white/70">{badge.how}</p>
      <BigButton className="mt-7 w-full" onClick={() => void seen({ token, badges: [badge.id] })}>Wonderful</BigButton>
    </Overlay>
  );
}
