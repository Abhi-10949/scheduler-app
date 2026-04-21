import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  return (
    <article className="soft-panel group h-full p-5 shadow-sm shadow-orange-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-900/10">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700/70">
              Shareable booking page
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">{event.title}</h3>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            {event.duration} min
          </span>
        </div>

        <p className="min-h-[48px] text-sm leading-6 text-slate-600">
          {event.description || "A focused session with a clean booking link and simple attendee flow."}
        </p>

        <div className="rounded-2xl bg-slate-900/[0.03] px-4 py-3 text-sm text-slate-500">
          <span className="font-semibold text-slate-700">Booking URL:</span> /book/{event.slug}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <p className="text-sm text-slate-500">Ready to accept bookings</p>
          <Link to={`/book/${event.slug}`} className="primary-btn px-4 py-2.5">
            Open Booking Page
          </Link>
        </div>
      </div>
    </article>
  );
}
