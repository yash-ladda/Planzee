import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";

import EventsList from "./pages/EventsList";
import Login from "./pages/Login";
import Register from "./pages/Signup";
import Navbar from "./components/Navbar";
import EventDetails from "./pages/EventDetails";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<EventsList />} />
                    <Route path="/events" element={<EventsList />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/events/:id" element={<EventDetails />}></Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;