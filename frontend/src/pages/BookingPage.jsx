import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { API_ROOT } from "../config/api";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BookingPage() {
  const { slug } = useParams();
  const [eventData, setEventData] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      setLoadingEvent(true);

      try {
        const res = await axios.get(`${API_ROOT}/events`);
        const event = res.data.find((item) => item.slug === slug);

        if (!event) {
          setError("This booking page could not be found.");
          return;
        }

        setEventData(event);
        setError("");
      } catch (loadError) {
        console.error(loadError);
        setError("We couldn't load this event right now.");
      } finally {
        setLoadingEvent(false);
      }
    };

    loadEvent();
  }, [slug]);

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  const fetchSlots = async () => {
    if (!eventData?.id || !date) {
      setError("Choose a date before checking available slots.");
      return;
    }

    setLoadingSlots(true);
    setSelectedSlot(null);
    setError("");

    try {
      const res = await axios.get(`${API_ROOT}/slots?eventId=${eventData.id}&date=${date}`);
      setSlots(res.data);

      if (res.data.length === 0) {
        setError("No slots are available on that date. Try another day.");
      }
    } catch (loadError) {
      console.error(loadError);
      setError("We couldn't load slots for that date.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const bookSlot = async () => {
    if (!selectedSlot || !name.trim() || !email.trim()) {
      setError("Select a slot and fill in your name and email.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await axios.post(`${API_ROOT}/bookings`, {
        event_id: eventData.id,
        name: name.trim(),
        email: email.trim(),
        date,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
      });

      setBookingDetails({
        eventTitle: eventData.title,
        name: name.trim(),
        email: email.trim(),
        date,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
      });
    } catch (submitError) {
      console.error(submitError);
      setError(submitError.response?.data?.message || "We couldn't confirm your booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shell min-h-screen px-3 py-4 sm:px-5">
      <div className="hero-orb left-[-80px] top-20 h-60 w-60 bg-emerald-500/15" />
      <div className="hero-orb bottom-10 right-[-60px] h-72 w-72 bg-orange-400/15" />

      <main className="app-container">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="secondary-btn">
            Back to Dashboard
          </Link>
          {eventData ? (
            <span className="rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-slate-600">
              {eventData.duration} minute session
            </span>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="glass-panel p-6 sm:p-8">
            <span className="eyebrow">Book a Session</span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900">
              {loadingEvent ? "Loading booking page..." : eventData?.title || "Appointment"}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {eventData?.description ||
                "Choose a date, pick a time, and lock in your session with a simple confirmation flow."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="metric-card">
                <p className="text-sm text-slate-500">Step 1</p>
                <p className="mt-2 text-lg font-bold text-slate-900">Pick a date</p>
              </div>
              <div className="metric-card">
                <p className="text-sm text-slate-500">Step 2</p>
                <p className="mt-2 text-lg font-bold text-slate-900">Choose a slot</p>
              </div>
              <div className="metric-card">
                <p className="text-sm text-slate-500">Step 3</p>
                <p className="mt-2 text-lg font-bold text-slate-900">Confirm details</p>
              </div>
            </div>
          </section>

          <section className="glass-panel p-6 sm:p-8">
            {bookingDetails ? (
              <div className="space-y-6">
                <div>
                  <span className="eyebrow">Confirmed</span>
                  <h2 className="mt-4 text-3xl font-bold text-slate-900">Your booking is locked in.</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    A clean confirmation summary is below so you can review the details at a glance.
                  </p>
                </div>

                <div className="soft-panel space-y-4 p-5">
                  <div>
                    <p className="text-sm text-slate-500">Event</p>
                    <p className="text-lg font-bold text-slate-900">{bookingDetails.eventTitle}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-slate-500">Guest</p>
                      <p className="font-semibold text-slate-800">{bookingDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-semibold text-slate-800">{bookingDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Date</p>
                      <p className="font-semibold text-slate-800">{formatDate(bookingDetails.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Time</p>
                      <p className="font-semibold text-slate-800">
                        {bookingDetails.start_time} - {bookingDetails.end_time}
                      </p>
                    </div>
                  </div>
                </div>

                <Link to="/" className="primary-btn">
                  Return to Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Choose your time</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Start with a date, then select the slot that works best for you.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Date</label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="date"
                      value={date}
                      min={minDate}
                      onChange={(event) => setDate(event.target.value)}
                      className="field"
                    />
                    <button
                      onClick={fetchSlots}
                      disabled={loadingEvent || loadingSlots}
                      className="primary-btn min-w-44"
                    >
                      {loadingSlots ? "Checking..." : "Get Available Slots"}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700">Available slots</label>
                    {selectedSlot ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Selected: {selectedSlot.start_time}
                      </span>
                    ) : null}
                  </div>

                  {loadingSlots ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {[...Array(6)].map((_, index) => (
                        <div key={index} className="h-12 animate-pulse rounded-2xl bg-white/70" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {slots.map((slot) => {
                        const isSelected = selectedSlot?.start_time === slot.start_time;

                        return (
                          <button
                            key={`${slot.start_time}-${slot.end_time}`}
                            onClick={() => setSelectedSlot(slot)}
                            className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                              isSelected
                                ? "border-emerald-700 bg-emerald-700 text-white shadow-lg shadow-emerald-900/10"
                                : "border-slate-200 bg-white/80 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50"
                            }`}
                          >
                            {slot.start_time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {selectedSlot ? (
                  <div className="soft-panel p-5">
                    <h3 className="text-lg font-bold text-slate-900">Your details</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      You&apos;re booking for {date ? formatDate(date) : "your selected date"} at{" "}
                      {selectedSlot.start_time}.
                    </p>

                    <div className="mt-4 grid gap-3">
                      <input
                        placeholder="Your name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="field"
                      />
                      <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="field"
                      />
                    </div>
                  </div>
                ) : null}

                {error ? <p className="text-sm text-red-700">{error}</p> : null}

                <button
                  onClick={bookSlot}
                  disabled={!selectedSlot || submitting}
                  className="primary-btn w-full"
                >
                  {submitting ? "Confirming..." : "Confirm Booking"}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
