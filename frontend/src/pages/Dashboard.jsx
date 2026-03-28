import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API_ROOT } from "../config/api";

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState("events");

    // Create Modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        duration: "",
        slug: "",
    });

    // Fetch Events
    useEffect(() => {
        axios
            .get(`${API_ROOT}/events`)
            .then((res) => setEvents(res.data))
            .catch((err) => console.error(err));
    }, []);

    // Fetch Bookings
    useEffect(() => {
        axios
            .get(`${API_ROOT}/bookings`)
            .then((res) => setBookings(res.data))
            .catch((err) => console.error(err));
    }, []);

    // Create Event
    const createEvent = async () => {
        if (!newEvent.title || !newEvent.duration || !newEvent.slug) {
            return alert("Please fill required fields");
        }

        try {
            const res = await axios.post(
                `${API_ROOT}/events`,
                {
                    ...newEvent,
                    duration: Number(newEvent.duration),
                }
            );

            setEvents([...events, { ...newEvent, id: res.data.insertId }]);

            setNewEvent({
                title: "",
                description: "",
                duration: "",
                slug: "",
            });

            setShowCreateModal(false);
        } catch (err) {
            alert(err.response?.data?.message || "Error creating event");
        }
    };

    // Cancel Booking
    const cancelBooking = async (id) => {
        if (!window.confirm("Cancel booking?")) return;

        await axios.put(`${API_ROOT}/bookings/cancel/${id}`);

        setBookings(
            bookings.map((b) =>
                b.id === id ? { ...b, status: "cancelled" } : b
            )
        );
    };

    const today = new Date().toISOString().split("T")[0];

    const upcoming = bookings.filter(
        (b) => b.date >= today && b.status !== "cancelled"
    );

    const past = bookings.filter(
        (b) => b.date < today && b.status !== "cancelled"
    );

    return (
        <div className="min-h-screen bg-gray-100">

            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="p-6">

                {/* EVENTS */}
                {activeTab === "events" && (
                    <div className="max-w-3xl mx-auto">

                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">Your Events</h2>

                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-black text-white px-4 py-2 rounded"
                            >
                                + Create Event
                            </button>
                        </div>

                        {events.map((event) => (
                            <div key={event.id} className="bg-white p-4 mb-3 rounded shadow">
                                <h3 className="font-semibold">{event.title}</h3>
                                <p className="text-sm text-gray-500">{event.description}</p>
                                <p className="text-sm text-gray-600">
                                    {event.duration} mins
                                </p>

                                <button
                                    onClick={() =>
                                        (window.location.href = `/book/${event.slug}`)
                                    }
                                    className="mt-2 bg-black text-white px-4 py-2 rounded"
                                >
                                    Book Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* BOOKINGS */}
                {activeTab === "bookings" && (
                    <div className="max-w-3xl mx-auto">

                        <h2 className="font-bold mb-2">Upcoming Bookings</h2>

                        {upcoming.length === 0 ? (
                            <p>No upcoming bookings</p>
                        ) : (
                            upcoming.map((b) => (
                                <div key={b.id} className="bg-white p-4 mb-3 rounded shadow">
                                    <p><strong>Event:</strong> {b.title}</p>
                                    <p><strong>Name:</strong> {b.name}</p>
                                    <p><strong>Email:</strong> {b.email}</p>
                                    <p><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
                                    <p><strong>Time:</strong> {b.start_time}</p>
                                    <p><strong>Status:</strong> {b.status}</p>

                                    <button
                                        onClick={() => cancelBooking(b.id)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded mt-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ))
                        )}

                        <h2 className="font-bold mt-4 mb-2">Past Bookings</h2>

                        {past.length === 0 ? (
                            <p>No past bookings</p>
                        ) : (
                            past.map((b) => (
                                <div key={b.id} className="bg-gray-200 p-3 mb-2 rounded">
                                    <p><strong>Event:</strong> {b.title}</p>
                                    <p><strong>Name:</strong> {b.name}</p>
                                    <p><strong>Email:</strong> {b.email}</p>
                                    <p><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
                                    <p><strong>Time:</strong> {b.start_time}</p>
                                    <p><strong>Status:</strong> {b.status}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

            </div>

            {/* CREATE MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-full max-w-md">

                        <h2 className="font-bold mb-3">Create Event</h2>

                        <input
                            placeholder="Title"
                            value={newEvent.title}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, title: e.target.value })
                            }
                            className="border p-2 w-full mb-2"
                        />

                        <input
                            placeholder="Description"
                            value={newEvent.description}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, description: e.target.value })
                            }
                            className="border p-2 w-full mb-2"
                        />

                        <input
                            placeholder="Duration"
                            value={newEvent.duration}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, duration: e.target.value })
                            }
                            className="border p-2 w-full mb-2"
                        />

                        <input
                            placeholder="Slug"
                            value={newEvent.slug}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, slug: e.target.value })
                            }
                            className="border p-2 w-full mb-2"
                        />

                        <div className="flex justify-between">
                            <button onClick={() => setShowCreateModal(false)}>Cancel</button>
                            <button
                                onClick={createEvent}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Create
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
