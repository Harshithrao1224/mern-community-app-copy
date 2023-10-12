import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import "../styles/login.css";

export const Login = () => {
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 
// eslint-disable-next-line
    const [_, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/auth/login", {
                email,
                password
            });

            setCookies("access_token", response.data.token);
            window.sessionStorage.setItem("userID", response.data.userID);
            window.sessionStorage.setItem("userName", response.data.username);
            navigate("/");
        } catch (error) {
            console.error(error);
            setError("Login failed. Please check your email and password."); // Set error message
        }
    };

    return (
        <div className="login container row col-12">
            <div className="form-container col-md-6 mt-5">
                <h1 className="title">Welcome back!</h1>
                <p className="subtitle">Please enter your details</p>
                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="text"
                            className="form-input"
                            id="email"
                            value={email}
                            onChange={(event) => setemail(event.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">Log In</button>
                    {error && <p className="error-message">{error}</p>} {/* Display error message */}
                </form>
                <p className="register-text">Don't have an account?<Link className="register-link" to="/register">Sign Up</Link></p>
            </div>
    <img id="logo" src={require("../assets/community.svg").default} alt="login" />
        </div>
    );
};
