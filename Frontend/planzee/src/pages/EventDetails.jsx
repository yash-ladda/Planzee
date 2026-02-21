import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function EventDetails () {
    const {id} = useParams();    

    const [event, setEvent] = useState(null);
    const [participation, setParticipation] = useState(null);

    const {isLoggedIn} = useAuth();

    useEffect(() => {
        const getEvent = async () => {
            try {
                const myEvent = await api.get(`/events/${id}`);                                
                setEvent(myEvent.data.event);
                setParticipation(myEvent.data.participation);
            }
            catch (err) {
                console.log("Err: ", err);
            }
        }

        getEvent();          

    }, [id]);

    const handleJoinEvent = async () => {
        try {
            await api.post(`/events/${id}/join`);
            const updated = await api.get(`/events/${id}`);
            setEvent(updated.data.event);
            setParticipation(updated.data.participation);
            alert("Joined successfully");
        } catch (err) {
            console.log("Err:", err.response?.data);
            alert(err.response?.data.message);
        }
    };

    const handleLeaveEvent = async () => {
        try {
            await api.post(`/events/${id}/leave`);
            const updated = await api.get(`/events/${id}`);
            setEvent(updated.data.event);
            setParticipation(updated.data.participation);
            alert("Left event");
        } catch (err) {
            console.log("Err:", err.response?.data);
        }
    };    

    return (
        <div>
            {!event ? 
                (
                    <h1>Event not found</h1>
                ) :
                (   
                    <div>
                        <h1>{event.title}</h1>

                        <p><strong>Category:</strong> {event.category}</p>

                        <p><strong>Description:</strong> {event.description}</p>

                        <p><strong>State:</strong> {event.state}</p>

                        <p><strong>Location Type:</strong> {event.locationType}</p>

                        {event.locationDetails && (
                            <p><strong>Location:</strong> {event.locationDetails}</p>
                        )}

                        {event.joinLink && (
                            <p>
                                <strong>Join Link:</strong>{" "}
                                <a href={event.joinLink} target="_blank">
                                    Join Event
                                </a>
                            </p>
                        )}

                        <p>
                            <strong>Start:</strong>{" "}
                            {new Date(event.startTime).toLocaleString()}
                        </p>

                        <p>
                            <strong>End:</strong>{" "}
                            {new Date(event.endTime).toLocaleString()}
                        </p>

                        <p><strong>Capacity:</strong> {event.capacity}</p>

                        {isLoggedIn &&
                            (   
                                <div>
                                {participation && (
                                    <button onClick={handleLeaveEvent}>Leave Event</button>
                                )}
                                {
                                    !participation && event.state == "REG_OPEN" && (
                                        <button onClick={handleJoinEvent}>Join Event</button>
                                    )
                                }
                                </div>
                            )
                        }

                    </div>
                )
            }
        </div>
    );
}