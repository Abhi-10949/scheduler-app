export default function EventCard({ event }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-500">{event.description}</p>

            <p className="text-sm text-gray-600">
                Duration: {event.duration} mins
            </p>

            <button
                onClick={() => (window.location.href = `/book/${event.slug}`)}
                className="mt-3 bg-black text-white px-4 py-2 rounded"
            >
                Book Now
            </button>
        </div>
    );
}