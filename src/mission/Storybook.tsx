import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Printer } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { buildItems, dayLabel, groupDays, TYPES } from "./lib";

/** The delegate's journey as a printable book: open it, then Print → Save as PDF. */
export default function Storybook({ token }: { token: string }) {
  const me = useQuery(api.mission.me, { token });
  const trip = useQuery(api.mission.trip, me ? { token } : "skip");
  const journal = useQuery(api.mission.journal, me ? { token } : "skip");
  const opened = useMutation(api.mission.markBookOpened);
  useEffect(() => { if (me) void opened({ token }); }, [me?._id]); // eslint-disable-line react-hooks/exhaustive-deps
  const days = useMemo(() => (trip ? groupDays(buildItems(trip.stops, trip.tours, trip.myRequests)) : []), [trip]);

  if (!me || !trip || !journal) return <div className="grid min-h-screen place-items-center bg-[#E9E5DC] text-xl text-[#1d1b17]">{me === null ? "This link isn't valid." : "Binding your storybook…"}</div>;

  const entry = (k: string) => journal.entries.find((e) => e.stopKey === k);
  const pics = (k: string) => journal.photos.filter((p) => p.stopKey === k && p.url);
  const factories = days.flatMap((d) => d.list).filter((s) => s.type === "factory").map((s) => {
    const sc = (entry(s.key)?.items ?? []).filter((x) => x.score > 0 && x.i < s.sees.length);
    return { title: s.title.replace("Factory visit: ", ""), city: s.city, avg: sc.length ? sc.reduce((a, x) => a + x.score, 0) / sc.length : 0, n: sc.length, total: s.sees.length };
  });

  return (
    <div className="book-root min-h-screen bg-[#E9E5DC] px-3 py-6 font-[Newsreader,Georgia,serif] text-[#1d1b17] print:bg-white print:p-0">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap" />
      <style>{`@page{size:A4;margin:0}@media print{.book-page{box-shadow:none!important;margin:0!important;break-after:page;min-height:297mm}.no-print{display:none!important}.book-cover{-webkit-print-color-adjust:exact;print-color-adjust:exact}}`}</style>
      <div className="no-print mx-auto mb-5 flex max-w-[780px] flex-wrap items-center justify-between gap-3 font-sans">
        <Link to="/mission" className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 text-lg font-bold text-[#0E8A3E]"><ArrowLeft size={20} /> Back to the mission</Link>
        <button onClick={() => window.print()} className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-[#0E8A3E] px-6 text-lg font-bold text-white"><Printer size={22} /> Print or save as PDF</button>
      </div>

      <section className="book-page book-cover mx-auto mb-5 flex min-h-[640px] max-w-[780px] flex-col justify-between gap-10 bg-[#06111C] p-8 sm:p-12 text-[#EEF4F8] shadow-xl">
        <div>
          <div className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#8FF0B5]">CDS-IGRL · Federal Concessionaire for Legal Metrology</div>
          <h1 className="mt-6 font-sans text-5xl font-black leading-[0.92] sm:text-6xl tracking-tight">{trip.meta.name}</h1>
        </div>
        <div>
          <div className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#8FF0B5]">The journey of</div>
          <div className="mt-2 text-4xl">{me.name}</div>
          {me.title && <div className="mt-1 text-xl italic opacity-80">{me.title}</div>}
          <div className="mt-6 font-sans text-base opacity-80">{trip.meta.route.join(" → ")}</div>
          <div className="font-sans text-base opacity-80">{trip.meta.dates}</div>
          <div className="mt-6 font-sans text-base"><b className="text-[#18C25A]">{me.stats.points} points</b> · {me.stats.level} · {me.stats.badges.length} medal{me.stats.badges.length === 1 ? "" : "s"}</div>
        </div>
      </section>

      {days.map((d) => (
        <section key={d.date} className="book-page mx-auto mb-5 max-w-[780px] bg-[#fffdf8] px-8 py-10 shadow-xl sm:px-14">
          <div className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#0E8A3E]">Day {d.n} · {d.city}</div>
          <h2 className="mt-1 font-sans text-4xl font-black tracking-tight">{dayLabel(d.date)}</h2>
          {d.list.map((s) => {
            const e = entry(s.key);
            const notes = s.sees.map((label, i) => ({ label, v: e?.items.find((x) => x.i === i) })).filter((x) => x.v && (x.v.note.trim() || x.v.score));
            const ph = pics(s.key);
            return (
              <article key={s.key} className="mt-7 break-inside-avoid border-t border-[#e3ddd0] pt-5">
                <div className="font-sans text-sm text-[#6b6457]">{s.time} {s.tz} · {TYPES[s.type] ?? s.type}{s.place ? ` · ${s.place}` : ""}</div>
                <h3 className="font-sans text-2xl font-extrabold">{s.title}</h3>
                {e?.note.trim() && <p className="mt-3 border-l-[3px] border-[#0E8A3E] pl-4 text-xl italic leading-relaxed">{e.note}</p>}
                {notes.length > 0 && (
                  <table className="mt-3 w-full border-collapse font-sans text-base">
                    <tbody>{notes.map((n) => (
                      <tr key={n.label} className="border-b border-[#e3ddd0] align-top">
                        <td className="py-2 pr-3">{n.label}</td>
                        {s.type === "factory" && <td className="w-14 py-2 font-bold">{n.v!.score ? `${n.v!.score}/5` : "–"}</td>}
                        <td className="py-2 text-[#3d3a33]">{n.v!.note}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                )}
                {ph.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {ph.map((p) => <img key={p._id} src={p.url!} alt="" className={`w-full rounded object-cover ${ph.length === 1 ? "col-span-2 aspect-[16/10]" : "aspect-[4/3]"}`} />)}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      ))}

      {factories.length > 0 && (
        <section className="book-page mx-auto mb-5 max-w-[780px] bg-[#fffdf8] px-8 py-10 shadow-xl sm:px-14">
          <div className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#0E8A3E]">Due diligence summary</div>
          <h2 className="mt-1 font-sans text-4xl font-black tracking-tight">Factories inspected</h2>
          <table className="mt-5 w-full border-collapse font-sans text-lg">
            <thead><tr className="border-b-2 border-[#1d1b17] text-left text-sm uppercase tracking-wider text-[#6b6457]"><th className="py-2">Sector</th><th>City</th><th>Average</th><th>Checks</th></tr></thead>
            <tbody>{factories.map((f) => (
              <tr key={f.title} className="border-b border-[#e3ddd0]"><td className="py-2.5 font-semibold">{f.title}</td><td>{f.city}</td><td className="font-bold">{f.n ? `${f.avg.toFixed(1)} / 5` : "–"}</td><td>{f.n} of {f.total}</td></tr>
            ))}</tbody>
          </table>
          <p className="mt-10 text-2xl italic">“We seek a partner, not just a supplier.”</p>
        </section>
      )}
    </div>
  );
}
