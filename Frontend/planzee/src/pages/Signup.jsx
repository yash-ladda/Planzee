import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Signup() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        // console.log(formData);

        e.preventDefault(); // stop page refresh

        try {
            const res = await api.post("/auth/register", formData);
            
            // store token in localStorage
            // localStorage.setItem("token", res.data.token);
            login(res.data.token);

            alert("Registration successful!");

            navigate("/");
        } catch (error) {
            console.log(error.response);

            let message = undefined;
            
            if (error.response.data.errors) {
                message = Object.values(error.response.data.errors)[0];
            }
            else {
                message = error.response.data.message;
            }

            console.log(message);
            
            // const message = error.response?.data?.message || "Registration failed";
            console.log(message);
            
            alert(message);
        }

    };

    return (
        <div>
            <h2>Sign Up</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <br /><br />

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <br /><br />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <br /><br />

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};