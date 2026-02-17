import { useEffect, useState } from "react";
import api from "../api/axios";

export default function EventsList() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await api.get("/events");
                setEvents(res.data.events);
            } catch (error) {
                console.log("Error:", error);
            }
        }

        fetchEvents();
    }, []);

    return (
        <div>
            <h2>Planzee Events</h2>

            {events.map((event) => (
                <div key={event._id}>
                    <h3>{event.title}</h3>
                    <p>{event.category}</p>
                </div>
            ))}
        </div>
    );
};