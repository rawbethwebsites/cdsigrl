import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BellRing, Copy, Plus, Send } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { LogoMark } from "@/components/Logo";
import { cn } from "@/utils/cn";
import { dayLabel, hm, missionLink } from "./lib";
import { StopEditor, TourEditor, type StopDraft, type TourDraft } from "./editors";
import { BigButton, toast } from "./ui";

const PRESETS = [
  { kind: "Wake-up call", message: "Good morning! Time to get ready. Breakfast is served downstairs.", options: "I'm awake, Give me 10 minutes" },
  { kind: "Lobby call", message: "Please come down to the lobby. The bus leaves in 15 minutes.", options: "Coming down now, Already in the lobby, Running late" },
  { kind: "Meeting starting", message: "We're starting. Please join the team in the meeting room.", options: "On my way, I'm here" },
  { kind: "Head count", message: "Quick check: is everyone OK?", options: "All good, I need help" },
];
const card = "rounded-3xl border border-white/10 bg-coal p-5 sm:p-6";
const input = "w-full min-w-0 rounded-xl border border-white/10 bg-ink px-4 py-3 text-lg text-cream placeholder:text-white/30 focus:border-brand focus:outline-none";
const fmtAfter = (ms: number) => (ms < 60_000 ? `${Math.max(1, Math.round(ms / 1000))} s` : `${Math.round(ms / 60_000)} min`);

export default function Control({ token }: { token: string }) {
  const me = useQuery(api.mission.me, { token });
  const [stop, setStop] = useState<StopDraft | null>(null);
  const [tour, setTour] = useState<TourDraft | null>(null);
  if (me === undefined) return <div className="grid min-h-screen place-items-center bg-ink text-xl text-cream">Loading…</div>;
  if (!me || me.role !== "admin") return (
    <div className="grid min-h-screen place-items-center bg-ink p-6 text-center text-cream">
      <div><p className="text-xl">Trip control is for the trip leader only.</p><Link to="/mission" className="mt-4 inline-block text-lg text-brand underline">Back to the mission</Link></div>
    </div>
  );
  return (
    <div className="min-h-screen bg-ink pb-24 text-cream">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <LogoMark className="h-10 w-10" />
          <div className="leading-tight"><div className="text-lg font-black">Trip control</div><div className="text-sm text-white/55">China Partner Mission</div></div>
          <Link to="/mission" className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-3 font-bold hover:border-brand hover:text-brand"><ArrowLeft size={18} /> Delegate view</Link>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pt-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6"><RollCall token={token} /><Itinerary token={token} onEdit={setStop} onEditTour={setTour} /></div>
        <div className="flex min-w-0 flex-col gap-6"><People token={token} /><Requests token={token} /><TripDetails token={token} /></div>
      </main>
      {stop && <StopEditor token={token} stop={stop} onClose={() => setStop(null)} />}
      {tour && <TourEditor token={token} tour={tour} onClose={() => setTour(null)} />}
    </div>
  );
}

function RollCall({ token }: { token: string }) {
  const board = useQuery(api.calls.board, { token });
  const send = useMutation(api.calls.send);
  const close = useMutation(api.calls.close);
  const [p, setP] = useState(0);
  const [kind, setKind] = useState(PRESETS[0].kind);
  const [message, setMessage] = useState(PRESETS[0].message);
  const [options, setOptions] = useState(PRESETS[0].options);
  const [sending, setSending] = useState(false);
  const pick = (i: number) => { setP(i); if (i < PRESETS.length) { setKind(PRESETS[i].kind); setMessage(PRESETS[i].message); setOptions(PRESETS[i].options); } else { setKind("Announcement"); setMessage(""); setOptions("Got it"); } };
  const latest = board?.calls[0];
  const answered = latest ? latest.rows.filter((r) => r.choice).length : 0;
  return (
    <section className={card}>
      <h2 className="flex items-center gap-3 text-2xl font-black"><BellRing className="text-brand" /> Roll call</h2>
      <p className="mt-1 text-lg text-white/60">Every delegate's screen rings until they answer. Anyone with alerts on gets it on their phone too.</p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[...PRESETS.map((x) => x.kind), "Custom"].map((k, i) => (
          <button key={k} onClick={() => pick(i)} aria-pressed={p === i} className={cn("min-h-14 rounded-2xl border-2 px-3 text-base font-bold", p === i ? "border-brand bg-brand/10 text-brand" : "border-white/10 hover:border-white/30")}>{k}</button>
        ))}
      </div>
      <div className="mt-4 grid gap-3">
        <input className={input} value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Call title" />
        <textarea className={input} rows={2} value={message} onChange={(e) => setMessage(e.target.value)} aria-label="Message" placeholder="What should everyone know?" />
        <label className="text-sm font-bold text-white/70">Reply buttons, separated by commas<input className={cn(input, "mt-1.5")} value={options} onChange={(e) => setOptions(e.target.value)} /></label>
        <BigButton disabled={sending || !message.trim()} className="text-xl" onClick={async () => {
          setSending(true);
          try { await send({ token, kind: kind.trim() || "Announcement", message: message.trim(), options: options.split(",") }); toast("Call sent to everyone"); }
          catch (e) { toast(e instanceof Error ? e.message : "Couldn't send"); }
          setSending(false);
        }}><span className="inline-flex items-center gap-2"><Send size={20} /> Send to everyone</span></BigButton>
      </div>

      {latest && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-ink/50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><div className="text-sm font-bold uppercase tracking-widest text-white/50">{latest.active ? "Live" : "Closed"} · sent {hm(latest.sentAt, 8)} China</div><div className="text-xl font-extrabold">{latest.kind}</div></div>
            <div className="text-right"><div className="text-4xl font-black tabular-nums text-brand">{answered}/{latest.rows.length}</div><div className="text-sm text-white/50">answered</div></div>
          </div>
          <ul className="mt-3 divide-y divide-white/5">
            <AnimatePresence initial={false}>
              {[...latest.rows].sort((a, b) => (a.after ?? 9e15) - (b.after ?? 9e15)).map((r) => {
                const online = board?.people.find((x) => x._id === r.travellerId)?.online;
                return (
                  <motion.li layout key={r.travellerId} className="flex items-center justify-between gap-3 py-2.5 text-lg">
                    <span><span className={cn("mr-2 inline-block h-2.5 w-2.5 rounded-full", online ? "bg-brand" : "bg-white/20")} />{r.name}</span>
                    {r.choice ? <span className="font-bold text-brand">{r.choice} <span className="font-normal text-white/45">· {fmtAfter(r.after!)}</span></span> : <span className="text-amber-300">Waiting…</span>}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
          {latest.active && <button onClick={() => void close({ token, callId: latest._id })} className="mt-3 text-base text-white/60 underline">Close this call</button>}
        </div>
      )}
    </section>
  );
}

function People({ token }: { token: string }) {
  const list = useQuery(api.admin.travellers, { token });
  const add = useMutation(api.admin.addTraveller);
  const remove = useMutation(api.admin.removeTraveller);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [role, setRole] = useState<"traveller" | "admin">("traveller");
  const [armed, setArmed] = useState<string | null>(null);
  const copy = async (t: string) => {
    try { await navigator.clipboard.writeText(missionLink(t)); toast("Link copied. Send it privately."); }
    catch { window.prompt("Copy this link", missionLink(t)); }
  };
  return (
    <section className={card}>
      <h2 className="text-2xl font-black">Delegation</h2>
      <p className="mt-1 text-lg text-white/60">Each person gets a private link. Opening it signs them in, so send it only to them.</p>
      <form className="mt-4 grid gap-2" onSubmit={async (e) => { e.preventDefault(); if (!name.trim()) return; await add({ token, name, title, role }); setName(""); setTitle(""); toast(`${name} added`); }}>
        <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name, e.g. Hon. Minister …" aria-label="Name" />
        <div className="flex gap-2">
          <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title or role" aria-label="Title" />
          <select className={cn(input, "w-auto")} value={role} onChange={(e) => setRole(e.target.value as "traveller" | "admin")} aria-label="Access"><option value="traveller">Delegate</option><option value="admin">Trip leader</option></select>
        </div>
        <BigButton type="submit" className="w-full"><span className="inline-flex items-center gap-2"><Plus size={20} /> Add person</span></BigButton>
      </form>
      <ul className="mt-4 divide-y divide-white/5">
        {list?.map((t) => (
          <li key={t._id} className="flex flex-wrap items-center gap-2 py-3">
            <span className="min-w-0 flex-1"><span className="block text-lg font-bold">{t.name}{t.role === "admin" && <span className="ml-2 text-sm text-brand">Trip leader</span>}</span>
              <span className="block text-sm text-white/50">{t.title || "—"} · {t.checkedIn ? "Checked in" : "Not checked in yet"} · {t.alerts ? "Alerts on" : "Alerts off"}</span></span>
            <button onClick={() => void copy(t.token)} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-white/15 px-3 font-bold hover:border-brand hover:text-brand"><Copy size={16} /> Copy link</button>
            <button onClick={() => (armed === t._id ? void remove({ token, id: t._id as Id<"travellers"> }) : setArmed(t._id))} className="min-h-11 px-2 text-sm text-white/45 hover:text-red-300">{armed === t._id ? "Tap to confirm" : "Remove"}</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Requests({ token }: { token: string }) {
  const reqs = useQuery(api.admin.tourRequests, { token });
  const set = useMutation(api.admin.setRequest);
  const pending = reqs?.filter((r) => r.status === "requested") ?? [];
  return (
    <section className={card}>
      <h2 className="text-2xl font-black">Tour requests {pending.length > 0 && <span className="ml-2 rounded-full bg-amber-400 px-2.5 py-0.5 text-base text-ink">{pending.length}</span>}</h2>
      {!reqs?.length ? <p className="mt-2 text-lg text-white/60">No requests yet. They appear here when a delegate unlocks a tour.</p> : (
        <ul className="mt-3 divide-y divide-white/5">
          {reqs.map((r) => (
            <li key={r._id} className="flex flex-wrap items-center gap-2 py-3">
              <span className="min-w-0 flex-1"><span className="block text-lg font-bold">{r.traveller}</span><span className="block text-sm text-white/55">{r.tour}</span></span>
              {r.status === "requested" ? <>
                <button onClick={() => void set({ token, id: r._id, status: "confirmed" })} className="min-h-11 rounded-xl bg-brand px-4 font-bold text-ink">Confirm</button>
                <button onClick={() => void set({ token, id: r._id, status: "declined" })} className="min-h-11 rounded-xl border border-white/15 px-4 font-bold">Decline</button>
              </> : <span className={r.status === "confirmed" ? "font-bold text-brand" : "text-red-300"}>{r.status === "confirmed" ? "Confirmed" : "Declined"}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Itinerary({ token, onEdit, onEditTour }: { token: string; onEdit: (s: StopDraft) => void; onEditTour: (t: TourDraft) => void }) {
  const trip = useQuery(api.mission.trip, { token });
  if (!trip) return null;
  const byDay = new Map<string, typeof trip.stops>();
  for (const s of [...trip.stops].sort((a, b) => (a.date + a.time < b.date + b.time ? -1 : 1))) { if (!byDay.has(s.date)) byDay.set(s.date, []); byDay.get(s.date)!.push(s); }
  return (
    <section className={card}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black">Itinerary</h2>
        <div className="flex gap-2"><button onClick={() => onEdit({})} className="min-h-11 rounded-xl bg-brand px-4 font-bold text-ink">Add a stop</button><button onClick={() => onEditTour({})} className="min-h-11 rounded-xl border border-white/15 px-4 font-bold">Add a tour</button></div>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {[...byDay.entries()].map(([date, list]) => (
          <div key={date}>
            <div className="text-sm font-bold uppercase tracking-widest text-brand">{dayLabel(date)}</div>
            {list.map((s) => (
              <button key={s._id} onClick={() => onEdit(s)} className="mt-1 flex w-full items-baseline gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/5">
                <span className="w-24 shrink-0 font-bold tabular-nums">{s.time} <span className="text-xs text-white/45">{s.tz}</span></span>
                <span className="min-w-0 flex-1 truncate text-lg">{s.title}</span>
                {s.place.includes("to be confirmed") && <span className="shrink-0 rounded bg-amber-400/15 px-2 text-xs font-bold text-amber-300">TBC</span>}
              </button>
            ))}
          </div>
        ))}
      </div>
      <h3 className="mt-6 text-xl font-extrabold">Tours</h3>
      {trip.tours.map((t) => (
        <button key={t._id} onClick={() => onEditTour(t)} className="mt-1 flex w-full items-baseline gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/5">
          <span className="w-24 shrink-0 text-sm text-white/60">{dayLabel(t.date, true)}</span><span className="min-w-0 flex-1 truncate text-lg">{t.title}</span>{!t.visible && <span className="text-xs text-white/45">hidden</span>}
        </button>
      ))}
    </section>
  );
}

function TripDetails({ token }: { token: string }) {
  const trip = useQuery(api.mission.trip, { token });
  const save = useMutation(api.admin.saveMeta);
  const [m, setM] = useState<{ name: string; dates: string; route: string } | null>(null);
  useEffect(() => { if (trip && !m) setM({ name: trip.meta.name, dates: trip.meta.dates, route: trip.meta.route.join(", ") }); }, [trip, m]);
  if (!m) return null;
  return (
    <section className={card}>
      <h2 className="text-2xl font-black">Trip details</h2>
      <form className="mt-3 grid gap-2" onSubmit={async (e) => { e.preventDefault(); await save({ token, name: m.name, dates: m.dates, route: m.route.split(",").map((x) => x.trim()).filter(Boolean) }); toast("Trip details saved"); }}>
        <input className={input} value={m.name} onChange={(e) => setM({ ...m, name: e.target.value })} aria-label="Trip name" />
        <input className={input} value={m.dates} onChange={(e) => setM({ ...m, dates: e.target.value })} aria-label="Dates" />
        <input className={input} value={m.route} onChange={(e) => setM({ ...m, route: e.target.value })} aria-label="Route, comma separated" />
        <BigButton type="submit" tone="ghost">Save details</BigButton>
      </form>
    </section>
  );
}
