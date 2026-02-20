import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Profile() {
    const { user, loading } = useAuth();
    const [myEvents, setMyEvents] = useState({});

    useEffect(() => {
        const getMyEvents = async () => {
            try {
                const res = await api.get("/me/events");
                setMyEvents(res.data);
            }
            catch (err) {
                console.log("Err: ", err);
            }
        }
        if (user) getMyEvents();
    }, [user]);

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>No user found</p>;

    const hasEvents =
  myEvents.organized?.length ||
  myEvents.volunteered?.length ||
  myEvents.attended?.length ||
  myEvents.pastAttended?.length;

    return (
        <div>
            <h2>Profile</h2>
            <img src={user.profileImage} alt="Profile" />
            <h3>{user.name}</h3>

            <br />

            {!hasEvents ? (
                <h4>You do not have any events</h4>
            ) : (
                <div>
                    <h2>Your events</h2>
                    <br />
                        {myEvents.organized?.length > 0 && (
                            <div>
                                <h4>Organized Events</h4>
                                <ul>
                                {myEvents.organized.map(({ _id, eventId: event }) =>
                                    event && (
                                        <li key={_id}>
                                            <Link to={`/events/${event._id}`}>
                                                <h5>{event.title}</h5>
                                                <span>{event.category}</span>
                                            </Link>
                                        </li>
                                    )
                                )}
                                </ul>
                            </div>
                        )}

                    <br />
                        {myEvents.volunteered?.length > 0 && (
                            <div>
                                <h4>Volunteered Events</h4>
                                <ul>
                                    {myEvents.volunteered.map(({ _id, eventId: event }) =>
                                        event && (
                                            <li key={_id}>
                                                <Link to={`/events/${event._id}`}>
                                                    <h5>{event.title}</h5>
                                                    <span>{event.category}</span>
                                                </Link>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}

                    <br />
                        {myEvents.attended?.length > 0 && (
                            <div>
                                <h4>Attended Events</h4>
                                <ul>
                                    {myEvents.attended.map(({ _id, eventId: event }) =>
                                        event && (
                                            <li key={_id}>
                                                <Link to={`/events/${event._id}`}>
                                                    <h5>{event.title}</h5>
                                                    <span>{event.category}</span>
                                                </Link>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}

                    <br />
                        {myEvents.pastAttended?.length > 0 && (
                            <div>
                                <h4>Past Attended Events</h4>
                                <ul>
                                    {myEvents.pastAttended.map(({ _id, eventId: event }) =>
                                        event && (
                                            <li key={_id}>
                                                <Link to={`/events/${event._id}`}>
                                                    <h5>{event.title}</h5>
                                                    <span>{event.category}</span>
                                                </Link>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                </div>
            ) }
        </div>
    );
}