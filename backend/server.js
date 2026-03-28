require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

/*
   ROOT
*/
app.get("/", (req, res) => {
    res.send("Backend Running");
});

/* =========================
   EVENT TYPES
========================= */

// CREATE EVENT
// ================= EVENTS =================

function insertAvailabilityForEvent(eventId, rows, done) {
    if (!rows || rows.length === 0) return done(null);

    const insertQuery = `
    INSERT INTO availability (event_id, day_of_week, start_time, end_time)
    VALUES (?, ?, ?, ?)
  `;

    let i = 0;
    function insertNext(err) {
        if (err) return done(err);
        if (i >= rows.length) return done(null);
        const row = rows[i++];
        const dow = Number(row.day_of_week);
        if (Number.isNaN(dow) || dow < 0 || dow > 6) {
            return done(new Error("Invalid day_of_week (use 0–6, same as JavaScript getDay)"));
        }
        db.query(
            insertQuery,
            [eventId, dow, row.start_time, row.end_time],
            insertNext
        );
    }
    insertNext(null);
}

// CREATE EVENT
app.post("/api/events", (req, res) => {
    console.log("BODY:", req.body);
    const { title, description, duration, slug, availability } = req.body;

    console.log("Incoming Data:", req.body);

    // Validation
    if (!title || !duration || !slug) {
        return res.status(400).json({
            message: "Title, duration, and slug are required",
        });
    }

    const query = `
    INSERT INTO event_types (title, description, duration, slug)
    VALUES (?, ?, ?, ?)
  `;

    db.query(
        query,
        [title, description || "", parseInt(duration), slug],
        (err, result) => {
            if (err) {
                console.error("DB ERROR:", err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        message: "Slug already exists. Use unique slug.",
                    });
                }

                return res.status(500).json({
                    message: err.sqlMessage,
                });
            }

            const eventId = result.insertId;
            const rows = Array.isArray(availability) ? availability : [];

            insertAvailabilityForEvent(eventId, rows, (availErr) => {
                if (availErr) {
                    console.error("AVAILABILITY ERROR:", availErr);
                    return res.status(500).json({
                        message:
                            availErr.message ||
                            "Event created but failed to save availability",
                    });
                }

                res.json({
                    message: "Event created successfully",
                    insertId: eventId,
                });
            });
        }
    );
});

// GET EVENTS
app.get("/api/events", (req, res) => {
    db.query("SELECT * FROM event_types", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

/* =========================
   AVAILABILITY
========================= */

// CREATE AVAILABILITY
app.post("/api/availability", (req, res) => {
    const { event_id, day_of_week, start_time, end_time } = req.body;

    const query = `
    INSERT INTO availability (event_id, day_of_week, start_time, end_time)
    VALUES (?, ?, ?, ?)
  `;

    db.query(
        query,
        [event_id, day_of_week, start_time, end_time],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Availability added" });
        }
    );
});

// GET AVAILABILITY
app.get("/api/availability/:eventId", (req, res) => {
    const { eventId } = req.params;

    db.query(
        "SELECT * FROM availability WHERE event_id = ?",
        [eventId],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

/* =========================
   SLOT GENERATION
========================= */

app.get("/api/slots", (req, res) => {
    const { eventId, date } = req.query;

    if (!eventId || !date) {
        return res.status(400).json({
            message: "eventId and date are required",
        });
    }

    // 🔥 Get event duration
    db.query(
        "SELECT duration FROM event_types WHERE id = ?",
        [eventId],
        (err, eventResult) => {
            if (err) return res.status(500).json(err);

            if (!eventResult.length) {
                return res.status(404).json({ message: "Event not found" });
            }

            const duration = eventResult[0].duration;

            // 🔥 Get availability
            db.query(
                "SELECT * FROM availability WHERE event_id = ?",
                [eventId],
                (err, availabilityResult) => {
                    if (err) return res.status(500).json(err);

                    const day = new Date(date).getDay();

                    const dayAvailability = availabilityResult.find(
                        (a) => Number(a.day_of_week) === day
                    );

                    if (!dayAvailability) return res.json([]);

                    let slots = [];

                    const toMinutes = (t) => {
                        const [h, m] = t.split(":");
                        return parseInt(h) * 60 + parseInt(m);
                    };

                    const formatTime = (min) => {
                        const h = Math.floor(min / 60)
                            .toString()
                            .padStart(2, "0");
                        const m = (min % 60).toString().padStart(2, "0");
                        return `${h}:${m}:00`;
                    };

                    let startMin = toMinutes(dayAvailability.start_time);
                    let endMin = toMinutes(dayAvailability.end_time);

                    // 🔥 Generate slots
                    for (let i = startMin; i + duration <= endMin; i += duration) {
                        slots.push({
                            start_time: formatTime(i),
                            end_time: formatTime(i + duration),
                        });
                    }

                    // 🔥 Remove booked slots
                    db.query(
                        "SELECT start_time FROM bookings WHERE event_id = ? AND date = ?",
                        [eventId, date],
                        (err, bookingsResult) => {
                            if (err) return res.status(500).json(err);

                            const booked = bookingsResult.map((b) => b.start_time);

                            const availableSlots = slots.filter(
                                (slot) => !booked.includes(slot.start_time)
                            );

                            res.json(availableSlots);
                        }
                    );
                }
            );
        }
    );
});

/* =========================
   BOOKINGS
========================= */

// CREATE BOOKING
app.post("/api/bookings", (req, res) => {
    const { event_id, name, email, date, start_time, end_time } = req.body;

    const query = `
    INSERT INTO bookings (event_id, name, email, date, start_time, end_time)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    db.query(
        query,
        [event_id, name, email, date, start_time, end_time],
        (err, result) => {
            if (err) {
                console.error("BOOKING ERROR:", err);
                return res.status(500).json(err);
            }

            res.json({
                message: "Booking successful",
                bookingId: result.insertId,
            });
        }
    );
});

// GET BOOKINGS
app.get("/api/bookings", (req, res) => {
    const query = `
    SELECT b.*, e.title 
    FROM bookings b
    JOIN event_types e ON b.event_id = e.id
  `;

    db.query(query, (err, result) => {
        if (err) {
            console.error("BOOKINGS ERROR:", err);
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

// CANCEL BOOKING
app.put("/api/bookings/cancel/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
        [id],
        (err) => {
            if (err) return res.status(500).json(err);

            res.json({ message: "Booking cancelled" });
        }
    );
});

/* =========================
   SERVER
========================= */

const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});