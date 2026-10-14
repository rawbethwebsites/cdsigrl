import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ChevronDown, CalendarPlus, Pencil, X } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/utils/cn";
import { calendarLink, hm, shrinkImage, TYPES, type Item } from "./lib";
import { Bar, toast } from "./ui";

type EntryItem = { i: number; note: string; score: number };
type Entry = { note: string; items: EntryItem[] };
type Photo = { _id: Id<"photos">; url: string | null };

const TYPE_STYLE: Record<string, string> = {
  factory: "bg-brand/15 text-brand border-brand/30",
  flight: "bg-sky-400/10 text-sky-300 border-sky-400/30",
  tour: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  meeting: "bg-violet-400/10 text-violet-300 border-violet-400/30",
};

export default function StopCard({ item, entry, photos, token, now, open, onToggle, onEdit }: {
  item: Item; entry?: Entry; photos: Photo[]; token: string; now: number; open: boolean;
  onToggle: () => void; onEdit?: () => void;
}) {
  const save = useMutation(api.mission.saveEntry);
  const uploadUrl = useMutation(api.photos.uploadUrl);
  const addPhoto = useMutation(api.photos.add);
  const removePhoto = useMutation(api.photos.remove);

  const [draft, setDraft] = useState<Entry>(() => entry ?? { note: "", items: [] });
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState("");
  useEffect(() => { if (!dirty.current && entry) setDraft(entry); }, [entry]);

  const isFactory = item.type === "factory";
  const isNow = item.t <= now && now < (item.te || item.t + 60 * 60_000);
  const past = !isNow && (item.te || item.t + 60 * 60_000) < now;
  const scored = item.sees.filter((_, i) => (draft.items.find((x) => x.i === i)?.score ?? 0) > 0).length;
  const complete = isFactory && item.sees.length > 0 && scored === item.sees.length;
  const noteCount = item.sees.filter((_, i) => (draft.items.find((x) => x.i === i)?.note ?? "").trim()).length + (draft.note.trim() ? 1 : 0);
  const wasComplete = useRef(complete);
  useEffect(() => {
    if (complete && !wasComplete.current && dirty.current) toast(`${item.title.replace("Factory visit: ", "")} fully inspected`, "+50");
    wasComplete.current = complete;
  }, [complete, item.title]);

  function update(next: Entry) {
    setDraft(next);
    dirty.current = true;
    setStatus("Saving…");
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try { await save({ token, stopKey: item.key, note: next.note, items: next.items }); setStatus("Saved"); }
      catch { setStatus("Couldn't save. Check your connection and try again."); }
      dirty.current = false;
    }, 700);
  }
  const setItem = (i: number, patch: Partial<EntryItem>) => {
    const cur = draft.items.find((x) => x.i === i) ?? { i, note: "", score: 0 };
    update({ ...draft, items: [...draft.items.filter((x) => x.i !== i), { ...cur, ...patch }] });
  };
  function score(i: number, n: number) {
    const cur = draft.items.find((x) => x.i === i)?.score ?? 0;
    setItem(i, { score: cur === n ? 0 : n });
    if (!cur) toast("Check scored", "+10");
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const list = [...files];
    try {
      for (const [k, f] of list.entries()) {
        setBusy(`Uploading photo ${k + 1} of ${list.length}…`);
        const blob = await shrinkImage(f);
        const url = await uploadUrl({ token });
        const r = await fetch(url, { method: "POST", headers: { "Content-Type": "image/jpeg" }, body: blob });
        if (!r.ok) throw new Error("upload");
        const { storageId } = await r.json();
        await addPhoto({ token, stopKey: item.key, storageId });
      }
      toast(list.length > 1 ? `${list.length} photos added` : "Photo added", `+${5 * list.length}`);
    } catch { setBusy("Couldn't upload that photo. Try again."); return; }
    setBusy("");
  }

  const end = item.te || item.t + 60 * 60_000;
  return (
    <motion.article layout className={cn("relative rounded-3xl border bg-coal p-5 sm:p-6", isNow ? "border-brand shadow-[0_0_0_1px_#18C25A,0_0_40px_rgba(24,194,90,.15)]" : "border-white/10", past && "opacity-70")}>
      <div className="grid gap-4 sm:grid-cols-[110px_minmax(0,1fr)]">
        <div className={cn("flex flex-wrap items-baseline gap-x-3 sm:block", complete && "pr-24 sm:pr-0")}>
          <div className="text-3xl font-black tabular-nums tracking-tight">{item.time}</div>
          <div className="text-sm text-white/60">{item.tz}{item.end ? ` – ${item.end}` : ""}</div>
          <div className="text-sm text-white/45 sm:mt-1">{item.tz === "WAT" ? `${hm(item.t, 8)} China` : `${hm(item.t, 1)} Abuja`}</div>
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wider", TYPE_STYLE[item.type] ?? "border-white/15 bg-white/5 text-white/70")}>{TYPES[item.type] ?? item.type}</span>
            {isNow && <span className="animate-pulse rounded-lg bg-brand px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-ink">Happening now</span>}
            {onEdit && <button type="button" onClick={onEdit} className="ml-auto inline-flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1 text-sm text-white/70 hover:text-brand"><Pencil size={14} /> Edit</button>}
          </div>
          <h3 className={cn("mt-2 text-2xl font-extrabold leading-tight tracking-tight", complete && "pr-24")}>{item.title}</h3>
          {(item.place || item.city) && <p className="mt-1 text-lg text-white/65">{[item.place, item.city].filter(Boolean).join(" · ")}</p>}
          {item.details && <p className="mt-3 max-w-[68ch] whitespace-pre-line text-lg leading-relaxed text-white/85">{item.details}</p>}

          {isFactory && (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-base font-semibold">
              <span className={complete ? "text-brand" : "text-white/80"}>Due diligence: {scored} of {item.sees.length} checks scored</span>
              <Bar value={item.sees.length ? scored / item.sees.length : 0} className="w-full max-w-xs" />
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-base text-white/60">
            {item.alarm > 0 && <span>Alarm {item.alarm >= 60 ? `${item.alarm / 60} h` : `${item.alarm} min`} before</span>}
            <a href={calendarLink(item, item.t, end)} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline"><CalendarPlus size={18} /> Add to my calendar</a>
          </div>

          <button type="button" onClick={onToggle} aria-expanded={open}
            className="mt-5 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[.04] px-4 py-4 text-left text-lg font-bold hover:border-brand/50">
            <span>{isFactory ? "Inspect & take notes" : "My notes & photos"}<span className="ml-3 text-base font-normal text-white/50">{noteCount} notes · {photos.length} photos</span></span>
            <ChevronDown className={cn("transition-transform", open && "rotate-180")} />
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="flex flex-col gap-3 pt-4">
                  {item.sees.map((label, i) => {
                    const v = draft.items.find((x) => x.i === i) ?? { i, note: "", score: 0 };
                    return (
                      <div key={i} className={cn("rounded-2xl border p-4", v.score ? "border-brand/40 bg-brand/[.06]" : "border-white/10 bg-ink/40")}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="text-lg font-semibold">{label}</span>
                          {isFactory && (
                            <div className="flex items-center gap-1.5" role="group" aria-label={`Score: ${label}`}>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <motion.button key={n} type="button" whileTap={{ scale: 0.85 }} onClick={() => score(i, n)} aria-pressed={v.score === n}
                                  className={cn("h-12 w-12 rounded-xl border-2 text-lg font-bold", v.score >= n ? "border-brand bg-brand text-ink" : "border-white/15 text-white/70 hover:border-brand/60")}>
                                  {n}
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                        <textarea value={v.note} onChange={(e) => setItem(i, { note: e.target.value })} rows={2}
                          placeholder={isFactory ? "What did you see? Certificates, capacity, answers given…" : "Your notes…"}
                          className="mt-3 w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-lg text-cream placeholder:text-white/30 focus:border-brand focus:outline-none" />
                      </div>
                    );
                  })}
                  <label className="mt-1 block text-lg font-bold">
                    {isFactory ? "Overall impression of this factory" : "How did it go?"}
                    <textarea value={draft.note} onChange={(e) => update({ ...draft, note: e.target.value })} rows={3}
                      placeholder="Write it while it's fresh. It goes into your storybook."
                      className="mt-2 w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-lg font-normal text-cream placeholder:text-white/30 focus:border-brand focus:outline-none" />
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {photos.map((p) => (
                      <div key={p._id} className="group relative aspect-square overflow-hidden rounded-xl bg-white/5">
                        {p.url && <img src={p.url} alt={`Photo at ${item.title}`} className="h-full w-full object-cover" loading="lazy" />}
                        <button type="button" onClick={() => void removePhoto({ token, photoId: p._id })} aria-label="Remove photo" className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1.5 text-white"><X size={14} /></button>
                      </div>
                    ))}
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-white/20 text-center text-sm font-semibold text-white/60 hover:border-brand hover:text-brand">
                      <Camera size={26} /> Add photos
                      <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { void onFiles(e.target.files); e.target.value = ""; }} />
                    </label>
                  </div>
                  <p className="min-h-6 text-sm text-white/50" aria-live="polite">{busy || status}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {complete && (
          <motion.div initial={{ scale: 2.2, opacity: 0, rotate: 10 }} animate={{ scale: 1, opacity: 1, rotate: -12 }} transition={{ type: "spring", stiffness: 260, damping: 14 }}
            className="pointer-events-none absolute right-3 top-3 grid h-20 w-20 text-[10px] sm:h-24 sm:w-24 sm:text-[11px] place-items-center rounded-full border-4 border-double border-brand bg-coal text-center font-black uppercase leading-tight tracking-widest text-brand">
            Inspected<br />& verified
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
