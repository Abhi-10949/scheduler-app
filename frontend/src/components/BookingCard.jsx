export default function BookingCard({ booking, onCancel }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <p><strong>Event:</strong> {booking.title}</p>
            <p><strong>Name:</strong> {booking.name}</p>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Time:</strong> {booking.start_time}</p>

            <button
                onClick={() => onCancel(booking.id)}
                className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded"
            >
                Cancel
            </button>
        </div>
    );
}