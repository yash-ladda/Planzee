import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

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

            {events.length > 0 ? (
            <div>
                <h4>All Events</h4>
                <ul>
                    {events.map((event) =>
                        {                              
                            return <li key={event._id}>
                                <Link to={`/events/${event._id}`}>
                                    <h5>{event.title}</h5>
                                    <span>{event.category}</span>
                                </Link>
                            </li>
                        }
                    )}
                </ul>
            </div>) : (
                <h3>No events found</h3>
            )}
        </div>
    );
}