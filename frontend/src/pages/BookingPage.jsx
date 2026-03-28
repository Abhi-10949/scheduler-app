import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function BookingPage() {
    const { slug } = useParams();

    const [eventId, setEventId] = useState(null);
    const [eventTitle, setEventTitle] = useState("");

    const [date, setDate] = useState("");
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [bookingDetails, setBookingDetails] = useState(null);

    // 🔥 Fetch event using slug
    useEffect(() => {
        axios.get("http://localhost:8000/api/events")
            .then((res) => {
                const event = res.data.find((e) => e.slug === slug);
                if (event) {
                    setEventId(event.id);
                    setEventTitle(event.title);
                }
            });
    }, [slug]);

    // 🔥 Fetch slots
    const fetchSlots = async () => {
        if (!eventId || !date) return;

        const res = await axios.get(
            `http://localhost:8000/api/slots?eventId=${eventId}&date=${date}`
        );

        setSlots(res.data);
    };

    // 🔥 Book slot
    const bookSlot = async () => {
        await axios.post("http://localhost:8000/api/bookings", {
            event_id: eventId,
            name,
            email,
            date,
            start_time: selectedSlot.start_time,
            end_time: selectedSlot.end_time,
        });

        // ✅ Set confirmation data
        setBookingDetails({
            eventTitle,
            name,
            email,
            date,
            start_time: selectedSlot.start_time,
            end_time: selectedSlot.end_time,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">

                {/* ✅ CONFIRMATION SCREEN */}
                {bookingDetails ? (
                    <div className="text-center">

                        <h2 className="text-2xl font-bold text-green-600 mb-4">
                            Booking Confirmed 🎉
                        </h2>

                        <div className="bg-green-50 p-4 rounded-lg text-left space-y-2">
                            <p><strong>Event:</strong> {bookingDetails.eventTitle}</p>
                            <p><strong>Name:</strong> {bookingDetails.name}</p>
                            <p><strong>Email:</strong> {bookingDetails.email}</p>
                            <p>
                                <strong>Date:</strong>{" "}
                                {new Date(bookingDetails.date).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Time:</strong>{" "}
                                {bookingDetails.start_time} - {bookingDetails.end_time}
                            </p>
                        </div>

                        <button
                            onClick={() => (window.location.href = "/")}
                            className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                ) : (

                    /* ✅ BOOKING FORM */
                    <>
                        <h2 className="text-xl font-bold mb-3 text-center">
                            {eventTitle || "Book Appointment"}
                        </h2>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border p-2 w-full mb-3 rounded-lg"
                        />

                        <button
                            onClick={fetchSlots}
                            className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
                        >
                            Get Available Slots
                        </button>

                        {/* SLOT LIST */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {slots.map((slot, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`p-2 border rounded-lg ${selectedSlot === slot
                                            ? "bg-blue-200"
                                            : "hover:bg-blue-100"
                                        }`}
                                >
                                    {slot.start_time}
                                </button>
                            ))}
                        </div>

                        {/* USER FORM */}
                        {selectedSlot && (
                            <>
                                <input
                                    placeholder="Your Name"
                                    onChange={(e) => setName(e.target.value)}
                                    className="border p-2 w-full mt-4 rounded-lg"
                                />

                                <input
                                    placeholder="Your Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border p-2 w-full mt-2 rounded-lg"
                                />

                                <button
                                    onClick={bookSlot}
                                    className="bg-green-600 text-white w-full py-2 mt-3 rounded-lg hover:bg-green-700"
                                >
                                    Confirm Booking
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}