import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import BookingCard from "../components/BookingCard";
import { API_ROOT } from "../config/api";

const emptyEvent = {
  title: "",
  description: "",
  duration: "",
  slug: "",
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("events");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState(emptyEvent);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      setEventsLoading(true);

      try {
        const res = await axios.get(`${API_ROOT}/events`);
        setEvents(res.data);
      } catch (error) {
        console.error(error);
        setPageError("We couldn't load your events right now.");
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const loadBookings = async () => {
      setBookingsLoading(true);

      try {
        const res = await axios.get(`${API_ROOT}/bookings`);
        setBookings(res.data);
      } catch (error) {
        console.error(error);
        setPageError("We couldn't load your bookings right now.");
      } finally {
        setBookingsLoading(false);
      }
    };

    loadBookings();
  }, []);

  const createEvent = async () => {
    if (!newEvent.title || !newEvent.duration || !newEvent.slug) {
      setFormError("Title, duration, and slug are required.");
      return;
    }

    setCreateLoading(true);
    setFormError("");

    try {
      const payload = {
        ...newEvent,
        duration: Number(newEvent.duration),
      };

      const res = await axios.post(`${API_ROOT}/events`, payload);

      setEvents((current) => [...current, { ...payload, id: res.data.insertId }]);
      setNewEvent(emptyEvent);
      setShowCreateModal(false);
    } catch (error) {
      setFormError(error.response?.data?.message || "Error creating event.");
    } finally {
      setCreateLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await axios.put(`${API_ROOT}/bookings/cancel/${id}`);
      setBookings((current) =>
        current.map((booking) =>
          booking.id === id ? { ...booking, status: "cancelled" } : booking,
        ),
      );
    } catch (error) {
      console.error(error);
      window.alert("We couldn't cancel that booking. Please try again.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const upcoming = useMemo(
    () => bookings.filter((booking) => booking.date >= today && booking.status !== "cancelled"),
    [bookings, today],
  );

  const past = useMemo(
    () => bookings.filter((booking) => booking.date < today && booking.status !== "cancelled"),
    [bookings, today],
  );

  const cancelled = useMemo(
    () => bookings.filter((booking) => booking.status === "cancelled"),
    [bookings],
  );

  const totalMinutes = useMemo(
    () => events.reduce((sum, event) => sum + Number(event.duration || 0), 0),
    [events],
  );

  return (
    <div className="shell min-h-screen px-3 py-4 sm:px-5">
      <div className="hero-orb left-[-120px] top-10 h-64 w-64 bg-emerald-500/15" />
      <div className="hero-orb bottom-20 right-[-80px] h-72 w-72 bg-orange-500/15" />

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="app-container space-y-8">
        <section className="glass-panel overflow-hidden p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.95fr]">
            <div>
              <span className="eyebrow">Control Center</span>
              <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Turn scheduling into a polished experience, not admin overhead.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Create branded event pages, keep upcoming bookings visible, and move through your day
                with a clearer picture of what is booked, pending, and complete.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => setShowCreateModal(true)} className="primary-btn">
                  Create New Event
                </button>
                <button onClick={() => setActiveTab("bookings")} className="secondary-btn">
                  View Today&apos;s Bookings
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="metric-card">
                <p className="text-sm text-slate-500">Live events</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{formatNumber(events.length)}</p>
                <p className="mt-2 text-sm text-slate-500">Ready to share and start taking bookings</p>
              </div>

              <div className="metric-card">
                <p className="text-sm text-slate-500">Upcoming bookings</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{formatNumber(upcoming.length)}</p>
                <p className="mt-2 text-sm text-slate-500">Confirmed sessions still ahead on the calendar</p>
              </div>

              <div className="metric-card">
                <p className="text-sm text-slate-500">Session minutes</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{formatNumber(totalMinutes)}</p>
                <p className="mt-2 text-sm text-slate-500">Total duration offered across all event types</p>
              </div>
            </div>
          </div>
        </section>

        {pageError ? (
          <section className="soft-panel p-4 text-sm text-red-700">{pageError}</section>
        ) : null}

        {activeTab === "events" ? (
          <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="section-title">Events</h2>
                <p className="section-copy mt-2">
                  Each event gets a shareable booking page, clear duration, and focused summary.
                </p>
              </div>

              <button onClick={() => setShowCreateModal(true)} className="secondary-btn">
                Add another event
              </button>
            </div>

            {eventsLoading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="soft-panel h-56 animate-pulse bg-white/60" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="soft-panel p-8 text-center">
                <p className="text-lg font-semibold text-slate-900">No events yet</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Start with one event type and you&apos;ll instantly get a cleaner booking flow to share
                  with guests.
                </p>
                <button onClick={() => setShowCreateModal(true)} className="primary-btn mt-6">
                  Create your first event
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-8">
            <div>
              <h2 className="section-title">Bookings</h2>
              <p className="section-copy mt-2">
                Upcoming meetings stay front and center, while older sessions move into a calmer archive.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="metric-card">
                <p className="text-sm text-slate-500">Upcoming</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{formatNumber(upcoming.length)}</p>
              </div>
              <div className="metric-card">
                <p className="text-sm text-slate-500">Past</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{formatNumber(past.length)}</p>
              </div>
              <div className="metric-card">
                <p className="text-sm text-slate-500">Cancelled</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{formatNumber(cancelled.length)}</p>
              </div>
            </div>

            {bookingsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="soft-panel h-36 animate-pulse bg-white/60" />
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Upcoming bookings</h3>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {upcoming.length} active
                    </span>
                  </div>

                  {upcoming.length === 0 ? (
                    <div className="soft-panel p-6 text-sm text-slate-500">
                      Nothing upcoming right now. New bookings will show up here first.
                    </div>
                  ) : (
                    upcoming.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onCancel={cancelBooking}
                        showCancel
                      />
                    ))
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Past bookings</h3>
                  {past.length === 0 ? (
                    <div className="soft-panel p-6 text-sm text-slate-500">
                      Your completed sessions will settle here once their date has passed.
                    </div>
                  ) : (
                    past.map((booking) => <BookingCard key={booking.id} booking={booking} />)
                  )}
                </div>
              </>
            )}
          </section>
        )}
      </main>

      {showCreateModal ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">New Event</p>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">Create a polished booking type</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add the basics now. You can share the booking page as soon as it is created.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormError("");
                }}
                className="secondary-btn px-3 py-2"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Event title</label>
                <input
                  placeholder="30-min discovery call"
                  value={newEvent.title}
                  onChange={(event) => setNewEvent({ ...newEvent, title: event.target.value })}
                  className="field"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  placeholder="Tell guests what this meeting is for and how to prepare."
                  value={newEvent.description}
                  onChange={(event) => setNewEvent({ ...newEvent, description: event.target.value })}
                  className="field min-h-28 resize-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Duration in minutes</label>
                <input
                  type="number"
                  min="1"
                  placeholder="30"
                  value={newEvent.duration}
                  onChange={(event) => setNewEvent({ ...newEvent, duration: event.target.value })}
                  className="field"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Slug</label>
                <input
                  placeholder="discovery-call"
                  value={newEvent.slug}
                  onChange={(event) =>
                    setNewEvent({
                      ...newEvent,
                      slug: event.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  className="field"
                />
              </div>
            </div>

            {formError ? <p className="mt-4 text-sm text-red-700">{formError}</p> : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormError("");
                }}
                className="secondary-btn"
              >
                Cancel
              </button>
              <button onClick={createEvent} disabled={createLoading} className="primary-btn">
                {createLoading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
