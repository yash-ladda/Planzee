import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav style={{ padding: "10px", borderBottom: "1px solid black" }}>
            <Link to="/events" style={{ marginRight: "15px" }}>
                Events
            </Link>

            {isLoggedIn ? (
                <>
                    <Link to="/events/new" style={{marginLeft: "15px"}}>
                        Create New Event
                    </Link>
                    <Link to="/profile" style={{marginLeft: "15px"}}>
                        Profile
                    </Link>
                    <button onClick={handleLogout} style={{position: "absolute", right: "0", marginRight: "30px"}}>Logout</button>
                </>
            ) : (
                <>
                <button style={{ position: "absolute", right: "0", marginRight: "30px" }}>
                    <Link to="/login" style={{ textDecoration: "none"}}>
                        Login
                    </Link>
                </button>
                <button style={{ position: "absolute", right: "0", marginRight: "90px" }}>
                    <Link to="/register" style={{ textDecoration: "none" }}>
                        Register
                    </Link>
                </button>
                </>
            )}
        </nav>
    );
}