import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav style={{ padding: "10px", borderBottom: "1px solid black" }}>
            <Link to="/events" style={{ marginRight: "15px" }}>
                Events
            </Link>

            <Link to="/login" style={{ marginRight: "15px" }}>
                Login
            </Link>

            <Link to="/signup">
                Sign Up
            </Link>
        </nav>
    );
};