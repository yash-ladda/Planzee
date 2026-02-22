import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function EventDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [participation, setParticipation] = useState(null);
    const [participants, setParticipants] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [reviewData, setReviewData] = useState({ rating: 3, comment: "" });

    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const getEvent = async () => {
            try {
                const myEvent = await api.get(`/events/${id}`);
                setEvent(myEvent.data.event);
                setParticipation(myEvent.data.participation);
            } catch (err) {
                console.log("Err: ", err);
            }
        };
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setReviewData({
            ...reviewData,
            [name]: name === "rating" ? Number(value) : value
        });
    };

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
        } catch (err) {
            console.log("Err: ", err.response?.data);
        }
    };

    const handleOpenRegistration = async () => {
        try {
            const res = await api.patch(`/events/${id}/publish`);
            setEvent(res.data.event);
            alert("Registrations opened for this event");
        } catch (err) {
            console.log("Err: ", err);
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/events/${id}/reviews`, reviewData);
            const res = await api.get(`/events/${id}/reviews`);
            setReviews(res.data.reviews);
            setAvgRating(res.data.avgRating);
            setTotalReviews(res.data.totalReviews);
            setReviewData({ rating: 3, comment: "" });
            alert("Review Added");
        } catch (err) {
            console.log("Err: ", err);
        }
    };

    useEffect(() => {
        if (event?.state === "COMPLETED") {
            const getReviews = async () => {
                try {
                    const res = await api.get(`/events/${id}/reviews`);
                    setReviews(res.data.reviews);
                    setAvgRating(res.data.avgRating);
                    setTotalReviews(res.data.totalReviews);
                } catch (err) {
                    console.log("Err: ", err);
                }
            };
            getReviews();
        }
    }, [event?.state, id]);

    const hasReviewed = reviews.some(
        (r) => r.userId === participation?.userId
    );

    return (
        <div>
            {!event ? (
                <h1>Event not found</h1>
            ) : (
                <div>
                    <h1>{event.title}</h1>
                    <p><strong>Category:</strong> {event.category}</p>
                    <p><strong>Description:</strong> {event.description}</p>
                    <p><strong>State:</strong> {event.state}</p>
                    <p><strong>Location Type:</strong> {event.locationType}</p>
                    {event.locationDetails && <p><strong>Location:</strong> {event.locationDetails}</p>}

                    {event.joinLink && (
                        <p>
                            <strong>Join Link:</strong>{" "}
                            <a href={event.joinLink} target="_blank" rel="noreferrer">Join Event</a>
                        </p>
                    )}

                    <p><strong>Start:</strong> {new Date(event.startTime).toLocaleString()}</p>
                    <p><strong>End:</strong> {new Date(event.endTime).toLocaleString()}</p>
                    <p><strong>Capacity:</strong> {event.capacity}</p>

                    {isLoggedIn && (
                        <div>
                            {participation && !isOrganizer && participation.status !== "LEFT"  && event.state != "COMPLETED" && (
                                <button onClick={handleLeaveEvent}>Leave Event</button>
                            )}
                            {!participation && event.state === "REG_OPEN" && (
                                <div>
                                    <button onClick={handleJoinEvent}>Join Event</button>
                                    <button onClick={handleJoinAsVolunteer}>Join as volunteer</button>
                                </div>
                            )}
                        </div>
                    )}

                    {event.state === "DRAFT" && isOrganizer && (
                        <button onClick={handleOpenRegistration}>Open Registration</button>
                    )}

                    {isLoggedIn && isOrganizer && participants && (
                        <div>
                            <br />
                            {(participants?.attendees?.length > 0 || participants?.waitlisted?.length > 0 || participants?.volunteers?.length > 0) && (
                                <h2>Participants of this Event</h2>
                            )}
                            {participants?.attendees?.length > 0 && (
                                <div>
                                    <h3>Attendees</h3>
                                    <ul>
                                        {participants.attendees.map((p) => (
                                            <li key={p._id}>
                                                <h5>{p.userId?.name}</h5>
                                                <p>{p.userId?.username}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                                {participants?.waitlisted?.length > 0 && (
                                    <div>
                                        <h3>Waitlisted</h3>
                                        <ul>
                                            {participants.waitlisted.map((p) => (
                                                <li key={p._id}>
                                                    <h5>{p.userId?.name}</h5>
                                                    <p>{p.userId?.username}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {participants?.volunteers?.length > 0 && (
                                    <div>
                                        <h3>Volunteers</h3>
                                        <ul>
                                            {participants.volunteers.map((p) => (
                                                <li key={p._id}>
                                                    <h5>{p.userId?.name}</h5>
                                                    <p>{p.userId?.username}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                        </div>
                    )}

                        {event.state === "COMPLETED" && isLoggedIn &&  participation?.status !== "LEFT" &&
                            (participation?.role === "ATTENDEE" || participation?.role === "VOLUNTEER") &&
                            !hasReviewed && (
                                <form onSubmit={handleAddReview}>
                                    <br /><br />
                                    <h4>Add a review</h4>
                                    <label>Rating: {reviewData.rating}</label>
                                    <input
                                        type="range"
                                        name="rating"
                                        min="1"
                                        max="5"
                                        value={reviewData.rating}
                                        onChange={handleChange}
                                    />
                                    <br />
                                    <textarea
                                        name="comment"
                                        placeholder="Write a review..."
                                        value={reviewData.comment}
                                        onChange={handleChange}
                                    />
                                    <br />
                                    <button type="submit">Add Review</button>
                                </form>
                            )}

                    <br />
                    <h3>Reviews</h3>
                    {event?.state === "COMPLETED" && (
                        <div>
                            {totalReviews > 0 ? (
                                <div>
                                    <h4>Average Rating: {avgRating}</h4>
                                    <p>Total: {totalReviews}</p>
                                    <ul>
                                            {reviews.map(({ _id, rating, comment, userId }) => (
                                                <li key={_id}>
                                                    <h4><i>{userId?.name}</i></h4>
                                                    <p><strong>{rating} stars</strong></p>
                                                    <p>"{comment}"</p>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            ) : (
                                <p>No reviews yet for this event.</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}