import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function EventDetails () {
    const {id} = useParams();    

    const [event, setEvent] = useState(null);
    const [participation, setParticipation] = useState(null);
    const [participants, setParticipants] = useState(null);

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

    const isOrganizer = participation?.role === "ORGANIZER";

    useEffect(() => {
        if (isOrganizer) {
            const getParticipants = async () => {
                try {
                    const res = await api.get(`/events/${id}/participants`);
                    setParticipants(res.data);
                } catch (err) {
                    console.log("Err: ", err);
                }
            };
            getParticipants();
        }
    }, [id, isOrganizer]);

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

    const handleJoinAsVolunteer = async () => {
        try {
            await api.post(`/events/${id}/volunteer`);
            const updated = await api.get(`/events/${id}`);
            setEvent(updated.data.event);
            setParticipation(updated.data.participation);
            alert("Joined as volunteer");
        }
        catch (err) {
            console.log("Err: ", err.response?.data);
        }
    };

    const handleOpenRegistration = async () => {
        try {
            const res = await api.patch(`/events/${id}/publish`);            
            setEvent(res.data.event);
            alert("Registrations opened for this event");
        }
        catch (err) {
            console.log("Err: ", err);
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
                                {participation && !isOrganizer && (
                                    <button onClick={handleLeaveEvent}>Leave Event</button>
                                )}
                                {
                                    !participation && event.state == "REG_OPEN" && (
                                        <div>
                                            <button onClick={handleJoinEvent}>Join Event</button>
                                            <button onClick={handleJoinAsVolunteer}>Join as volunteer</button>
                                        </div>
                                    )
                                }
                                </div>
                            )
                        }

                        {
                            event.state == "DRAFT" && (
                                <button onClick={handleOpenRegistration}>Open Registration</button>
                            )
                        }

                        {isLoggedIn &&
                            isOrganizer && 
                                participants  && (
                                <div>
                                    <br /><br />
                                    {
                                        (participants?.attendees?.length > 0 ||
                                        participants?.waitlisted?.length > 0  ||
                                        participants?.volunteers?.length > 0 ) && (
                                            <h2>Participants of this Event</h2>   
                                        )
                                    }
                                    {
                                        participants?.attendees?.length > 0 && (
                                            <div>
                                                <h3>Attendees</h3>
                                                <ul>
                                                    {   
                                                    participants.attendees.map(({ _id, userId: user}) => (
                                                        <li key={_id}>
                                                            <h5>{user.name}</h5>
                                                            <p>{user.username}</p>
                                                            <p>{user.name}</p>
                                                        </li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        )
                                    }

                                    {
                                        participants?.waitlisted?.length > 0 && (
                                            <div>
                                                <h3>Waitlisted participants</h3>
                                                <ul>
                                                    {
                                                    participants.waitlisted.map(({ _id, userId: user }) => (
                                                        <li key={_id}>
                                                            <h5>{user.name}</h5>
                                                            <p>{user.username}</p>
                                                            <p>{user.name}</p>
                                                        </li>
                                                    ))
                                                    }
                                                </ul>
                                            </div>
                                        )
                                    }

                                    {
                                        participants?.volunteers?.length > 0 && (
                                            <div>
                                                <h3>Volunteers</h3>
                                                <ul>
                                                    {
                                                    participants.volunteers.map(({ _id, userId: user }) => (
                                                        <li key={_id}>
                                                            <p>Name: {user.name}</p>
                                                            <p>Username: {user.username}</p>
                                                            <p>Email: {user.email}</p>
                                                        </li>
                                                    ))
                                                    }
                                                </ul>
                                            </div>
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