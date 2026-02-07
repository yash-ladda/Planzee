import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

function Home() {
  return <h2>Home Page</h2>;
}

function Login() {
  return <h2>Login Page</h2>;
}

function Register() {
  return <h2>Register Page</h2>;
}

export default function App() {
  return (
        <>
        <Home />
        <Login />
        <Register />
        </>
  );
}
