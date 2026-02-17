import { useEffect, useState } from "react";
import api from "./api/axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import EventsList from "./pages/EventsList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/navbar";

export default function App() {

    return (
        <div>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route  path="/events" element={<EventsList />}/>
                    <Route  path="/login" element={<Login />}/>
                    <Route  path="/signup" element={<Signup />}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
