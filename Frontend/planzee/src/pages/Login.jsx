import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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
        e.preventDefault();

        try {
            const res = await api.post("/auth/login", formData);

            localStorage.setItem("token", res.data.token);

            alert("Login successful!");

            navigate("/"); // redirect to home
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

            alert(message);
        }
    };

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
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

                <button type="submit">Login</button>
            </form>
        </div>
    );
};