import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';

export default function Home() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const FIREBASE_DB_URL = import.meta.env.VITE_FIREBASE_DB_URL;

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/auth');
            return;
        }
        fetchHotels();
    }, [navigate]);

    const fetchHotels = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(
                `${FIREBASE_DB_URL}/hotels.json?auth=${token}`
            );
            setHotels(response.data ? Object.entries(response.data).map(([key, val]) => ({ id: key, ...val })) : []);
        } catch (err) {
            setError('Failed to fetch hotels: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        navigate('/auth');
    };

    const handleAddHotel = () => {
        navigate('/manage-listings');
    };

    const handleEditHotel = (hotelId) => {
        navigate(`/manage-listings?edit=${hotelId}`);
    };

    const handleDeleteHotel = async (hotelId) => {
        if (window.confirm('Are you sure you want to delete this hotel?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(
                    `${FIREBASE_DB_URL}/hotels/${hotelId}.json?auth=${token}`
                );
                setHotels(hotels.filter(h => h.id !== hotelId));
            } catch (err) {
                setError('Failed to delete hotel');
            }
        }
    };

    return (
        <div className="admin-container">
            <nav className="admin-nav">
                <h1 className="nav-brand">HotelAdmin</h1>
                <div className="nav-menu">
                    <a href="/" className="nav-link active">Home</a>
                    <a href="/bookings" className="nav-link">Bookings</a>
                    <a href="/manage-listings" className="nav-link">Manage Listings</a>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </nav>

            <main className="admin-main">
                <div className="dashboard-header">
                    <h2>Admin Dashboard - Admin Hotels</h2>
                    <button onClick={handleAddHotel} className="btn-add-hotel">
                        + Add New Hotel
                    </button>
                </div>

                {error && <p className="error-message">{error}</p>}
                {loading && <p className="loading">Loading hotels...</p>}

                <div className="hotels-grid">
                    {hotels.map((hotel) => (
                        <div key={hotel.id} className="hotel-card">
                            <img src={hotel.images?.[0] || '/placeholder.jpg'} alt={hotel.name} className="hotel-image" />
                            <div className="hotel-info">
                                <h3>{hotel.name}</h3>
                                <p><strong>Price:</strong> ₹{hotel.price}/night</p>
                                <p><strong>Address:</strong> {hotel.address}</p>
                                <p><strong>City:</strong> {hotel.city}</p>
                                <p><strong>Category:</strong> {hotel.category}</p>
                                <div className="hotel-actions">
                                    <button onClick={() => handleEditHotel(hotel.id)} className="btn-edit">Edit</button>
                                    <button onClick={() => handleDeleteHotel(hotel.id)} className="btn-delete">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {hotels.length === 0 && !loading && (
                    <p className="no-hotels">No hotels added yet. Click "Add New Hotel" to get started.</p>
                )}
            </main>
        </div>
    );
}
