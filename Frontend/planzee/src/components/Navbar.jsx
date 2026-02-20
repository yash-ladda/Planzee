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
                    <button onClick={handleLogout}>Logout</button>
                    <Link to="/profile" style={{marginLeft: "15px"}}>
                        Profile
                    </Link>
                </>
            ) : (
                <>
                    <Link to="/login" style={{ marginRight: "15px" }}>
                        Login
                    </Link>
                    <Link to="/register">
                        Register
                    </Link>
                </>
            )}
        </nav>
    );
}