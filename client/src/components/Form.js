import React from 'react';

export const Form = ({ email, setemail, password, setPassword, label, onSubmit }) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Username:</label>
                <input
                    type="text"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(event) => setemail(event.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password:</label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
            </div>

            <button type="submit" className="btn btn-primary">{label}</button>
        </form>
    );
};