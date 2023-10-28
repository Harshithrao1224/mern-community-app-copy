import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal"; // Import the modal component
import Button from "react-bootstrap/Button"; // Import the button component

import "../styles/login.css";

export const Register = () => {
    const [email, setemail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility

    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:4000/auth/register", {
                email,username,password
            });

            // Show the modal after successful registration
            setShowModal(true);
        } catch(error) {
            console.error(error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate("/login");
    };

    return (
        <div className="login container row col-12">
            <div className="form-container col-md-6 mt-5">
                <h1 className="title">Welcome here!</h1>
                <p className="subtitle">Please enter your details</p>
                <form id="form" onSubmit={onSubmit}>
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
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            id="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
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

                    <button type="submit" className="login-btn">Register</button>
                </form>
                <p className="register-text">Already have an account?<Link className="register-link" to="/login">Sign In</Link></p>
            </div>
           

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Registration Successful</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    You have registered successfully. Now you can<Link className="login-link" to="/login">Log in</Link>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
};
