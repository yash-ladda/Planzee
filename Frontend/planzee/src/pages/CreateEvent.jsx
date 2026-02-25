import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function CreateEvent() {
    const navigate = useNavigate();
    const {user, loading} = useAuth();

    if(!user) return <p>User not found</p>
    if(loading) return <p>Loading...</p>

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "HACKATHON",
        locationType: "ONLINE",
        locationDetails: "",
        joinLink: "",
        startTime: "",
        endTime: "",
        capacity: 1
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: name === "capacity" ? Number(value) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/events", formData);            
            navigate(`/events/${res.data.event._id}`);
        } catch (err) {
            console.log("Error:", err.response?.data);
            alert(err.response?.data?.message || "Error creating event");
        }
    };

    return (
        <div>
            <h2>Create Event</h2>

            <form onSubmit={handleSubmit}>
                <p>Title</p>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <br /><br />

                <p>Description</p>
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <br /><br />

                <p>Category</p>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value="HACKATHON">Hackathon</option>
                    <option value="WORKSHOP">Workshop</option>
                    <option value="SEMINAR">Seminar</option>
                    <option value="FEST">Fest</option>
                    <option value="MEETUP">Meetup</option>
                    <option value="WEBINAR">Webinar</option>
                </select>
                <br /><br />

                <p>Location Type</p>
                <select
                    name="locationType"
                    value={formData.locationType}
                    onChange={handleChange}
                >
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                    <option value="HYBRID">Hybrid</option>
                </select>
                <br /><br />

                <p>Location Details</p>
                <input
                    type="text"
                    name="locationDetails"
                    placeholder="Location Details"
                    value={formData.locationDetails}
                    onChange={handleChange}
                />
                <br /><br />

                <p>Join Link</p>
                <input
                    type="text"
                    name="joinLink"
                    placeholder="Join Link (for online events)"
                    value={formData.joinLink}
                    onChange={handleChange}
                />
                <br /><br />

                <p>Start Time</p>
                <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                />
                <br /><br />

                <p>End Time</p>
                <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                />
                <br /><br />

                <p>Capacity</p>
                <input
                    type="number"
                    name="capacity"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                />
                <br /><br />

                <button type="submit">Create Event</button>

            </form>
        </div>
    );
}