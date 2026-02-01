import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

export default function Header() {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail');

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        navigate('/auth');
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <h1>✈️ LuxeStays</h1>
                </Link>

                <nav className="nav-menu">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/explore" className="nav-link">Explore</Link>
                    <Link to="/bookings" className="nav-link">My Bookings</Link>
                </nav>

                <div className="header-actions">
                    {userEmail && <span className="user-email">{userEmail}</span>}
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </div>
        </header>
    );
}
