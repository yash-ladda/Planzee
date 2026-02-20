import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { isLoggedIn, loading } = useAuth();

    if (loading) {
        return <p>Checking authentication...</p>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return children;
}