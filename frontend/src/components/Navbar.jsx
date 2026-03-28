export default function Navbar({ activeTab, setActiveTab }) {
    return (
        <div className="bg-black text-white p-4 flex justify-between">
            <h1 className="font-bold">Scheduler</h1>

            <div className="space-x-4">
                <button
                    onClick={() => setActiveTab("events")}
                    className={`px-3 py-1 rounded ${activeTab === "events" ? "bg-white text-black" : ""
                        }`}
                >
                    Events
                </button>

                <button
                    onClick={() => setActiveTab("bookings")}
                    className={`px-3 py-1 rounded ${activeTab === "bookings" ? "bg-white text-black" : ""
                        }`}
                >
                    Bookings
                </button>
            </div>
        </div>
    );
}