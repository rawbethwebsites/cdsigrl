import { useState, type ReactNode } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { TYPES } from "./lib";
import { BigButton, Overlay } from "./ui";

const field = "mt-1.5 w-full rounded-xl border border-white/10 bg-ink px-3 py-2.5 text-base font-normal text-cream focus:border-brand focus:outline-none";
function F({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) {
  return <label className={`block text-left text-sm font-bold text-white/80 ${full ? "sm:col-span-2" : ""}`}>{label}{children}</label>;
}
const TzSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <select className={field} value={value} onChange={(e) => onChange(e.target.value)}>
    <option value="WAT">WAT · Nigeria</option><option value="CST">CST · China</option><option value="EAT">EAT · Addis Ababa</option>
  </select>
);

function Shell({ title, children, onSave, onDelete, onClose, error }: { title: string; children: ReactNode; onSave: () => void; onDelete?: () => void; onClose: () => void; error: string }) {
  const [armed, setArmed] = useState(false);
  return (
    <Overlay>
      <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="text-left">
        <h2 className="text-2xl font-extrabold">{title}</h2>
        <div className="mt-4 grid max-h-[62vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">{children}</div>
        {error && <p className="mt-3 text-red-300">{error}</p>}
        <div className="mt-5 flex flex-wrap justify-between gap-3">
          {onDelete ? <BigButton tone="danger" onClick={() => (armed ? onDelete() : setArmed(true))}>{armed ? "Tap again to delete" : "Delete"}</BigButton> : <span />}
          <div className="flex gap-3"><BigButton tone="ghost" onClick={onClose}>Cancel</BigButton><button type="submit" className="min-h-14 rounded-2xl bg-brand px-6 text-lg font-bold text-ink">Save</button></div>
        </div>
      </form>
    </Overlay>
  );
}

export type StopDraft = Partial<Doc<"stops">>;
export function StopEditor({ token, stop, onClose }: { token: string; stop: StopDraft; onClose: () => void }) {
  const saveStop = useMutation(api.admin.saveStop);
  const del = useMutation(api.admin.deleteStop);
  const [s, setS] = useState({
    date: stop.date ?? "2026-10-20", time: stop.time ?? "09:00", end: stop.end ?? "", tz: stop.tz ?? "CST", type: stop.type ?? "factory",
    title: stop.title ?? "", city: stop.city ?? "", place: stop.place ?? "", details: stop.details ?? "", sees: (stop.sees ?? []).join("\n"), alarm: String(stop.alarm ?? 30),
  });
  const [error, setError] = useState("");
  const set = (k: keyof typeof s) => (v: string) => setS({ ...s, [k]: v });
  return (
    <Shell title={stop._id ? "Edit stop" : "Add a stop"} onClose={onClose} error={error}
      onDelete={stop._id ? async () => { await del({ token, id: stop._id! }); onClose(); } : undefined}
      onSave={async () => {
        if (!s.title.trim()) return setError("Give the stop a title.");
        try {
          await saveStop({ token, id: stop._id, date: s.date, time: s.time, end: s.end || undefined, tz: s.tz, type: s.type, title: s.title.trim(), city: s.city.trim(), place: s.place.trim(), details: s.details.trim(), sees: s.sees.split("\n").map((x) => x.trim()).filter(Boolean), alarm: Number(s.alarm) || 0 });
          onClose();
        } catch (e) { setError(e instanceof Error ? e.message : "Couldn't save."); }
      }}>
      <F label="Title" full><input className={field} value={s.title} onChange={(e) => set("title")(e.target.value)} placeholder="Factory visit: weighbridges" /></F>
      <F label="Date"><input type="date" className={field} value={s.date} onChange={(e) => set("date")(e.target.value)} /></F>
      <F label="Type"><select className={field} value={s.type} onChange={(e) => set("type")(e.target.value)}>{Object.entries(TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></F>
      <F label="Starts"><input type="time" className={field} value={s.time} onChange={(e) => set("time")(e.target.value)} /></F>
      <F label="Ends (optional)"><input type="time" className={field} value={s.end} onChange={(e) => set("end")(e.target.value)} /></F>
      <F label="Time zone"><TzSelect value={s.tz} onChange={set("tz")} /></F>
      <F label="Alarm, minutes before"><input type="number" min={0} className={field} value={s.alarm} onChange={(e) => set("alarm")(e.target.value)} /></F>
      <F label="City"><input className={field} value={s.city} onChange={(e) => set("city")(e.target.value)} /></F>
      <F label="Place"><input className={field} value={s.place} onChange={(e) => set("place")(e.target.value)} placeholder="Factory, hotel or venue" /></F>
      <F label="Details for the delegation" full><textarea rows={3} className={field} value={s.details} onChange={(e) => set("details")(e.target.value)} /></F>
      <F label="Checks / things to see (one per line, each gets a note box and a score)" full><textarea rows={6} className={field} value={s.sees} onChange={(e) => set("sees")(e.target.value)} /></F>
    </Shell>
  );
}

export type TourDraft = Partial<Doc<"tours">>;
export function TourEditor({ token, tour, onClose }: { token: string; tour: TourDraft; onClose: () => void }) {
  const saveTour = useMutation(api.admin.saveTour);
  const del = useMutation(api.admin.deleteTour);
  const [t, setT] = useState({
    title: tour.title ?? "", city: tour.city ?? "", date: tour.date ?? "", time: tour.time ?? "", tz: tour.tz ?? "CST", duration: tour.duration ?? "",
    price: tour.price ?? "Price on request", teaser: tour.teaser ?? "", details: tour.details ?? "", visible: tour.visible ?? true,
  });
  const [error, setError] = useState("");
  const set = (k: keyof typeof t) => (v: string) => setT({ ...t, [k]: v });
  return (
    <Shell title={tour._id ? "Edit tour" : "Add a tour"} onClose={onClose} error={error}
      onDelete={tour._id ? async () => { await del({ token, id: tour._id! }); onClose(); } : undefined}
      onSave={async () => {
        if (!t.title.trim()) return setError("Give the tour a title.");
        try { await saveTour({ token, id: tour._id, ...t }); onClose(); } catch (e) { setError(e instanceof Error ? e.message : "Couldn't save."); }
      }}>
      <F label="Title" full><input className={field} value={t.title} onChange={(e) => set("title")(e.target.value)} /></F>
      <F label="City"><input className={field} value={t.city} onChange={(e) => set("city")(e.target.value)} /></F>
      <F label="Date"><input type="date" className={field} value={t.date} onChange={(e) => set("date")(e.target.value)} /></F>
      <F label="Starts"><input type="time" className={field} value={t.time} onChange={(e) => set("time")(e.target.value)} /></F>
      <F label="Time zone"><TzSelect value={t.tz} onChange={set("tz")} /></F>
      <F label="Duration"><input className={field} value={t.duration} onChange={(e) => set("duration")(e.target.value)} placeholder="3 hours" /></F>
      <F label="Price"><input className={field} value={t.price} onChange={(e) => set("price")(e.target.value)} /></F>
      <F label="Teaser (everyone sees this)" full><textarea rows={2} className={field} value={t.teaser} onChange={(e) => set("teaser")(e.target.value)} /></F>
      <F label="Meeting point & details (shown once confirmed)" full><textarea rows={3} className={field} value={t.details} onChange={(e) => set("details")(e.target.value)} /></F>
      <label className="flex items-center gap-3 text-base font-semibold sm:col-span-2"><input type="checkbox" className="h-5 w-5 accent-[#18C25A]" checked={t.visible} onChange={(e) => setT({ ...t, visible: e.target.checked })} /> Visible to the delegation</label>
    </Shell>
  );
}
