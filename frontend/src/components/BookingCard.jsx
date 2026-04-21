function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status) {
  if (status === "cancelled") return "status-pill status-cancelled";
  if (status === "completed") return "status-pill status-completed";
  return "status-pill status-confirmed";
}

export default function BookingCard({ booking, onCancel, showCancel = false }) {
  return (
    <article className="soft-panel p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">{booking.title}</h3>
            <span className={getStatusClass(booking.status)}>{booking.status}</span>
          </div>

          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-slate-800">Guest:</span> {booking.name}
            </p>
            <p>
              <span className="font-semibold text-slate-800">Email:</span> {booking.email}
            </p>
            <p>
              <span className="font-semibold text-slate-800">Date:</span> {formatDate(booking.date)}
            </p>
            <p>
              <span className="font-semibold text-slate-800">Time:</span> {booking.start_time}
            </p>
          </div>
        </div>

        {showCancel && booking.status !== "cancelled" ? (
          <button onClick={() => onCancel(booking.id)} className="danger-btn sm:self-center">
            Cancel Booking
          </button>
        ) : null}
      </div>
    </article>
  );
}
