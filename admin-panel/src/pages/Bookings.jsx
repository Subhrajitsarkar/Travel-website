import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Bookings.css';

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
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
        fetchBookings();
    }, [navigate]);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            console.log('Fetching bookings with token:', token);
            const response = await axios.get(
                `${FIREBASE_DB_URL}/bookings.json?auth=${token}`
            );
            setBookings(response.data ? Object.entries(response.data).map(([key, val]) => ({ id: key, ...val })) : []);
        } catch (err) {
            console.error('Firebase Bookings Error:', err.response?.data || err.message);
            setError('Failed to fetch bookings: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleApproveBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.patch(
                `${FIREBASE_DB_URL}/bookings/${bookingId}.json?auth=${token}`,
                { status: 'completed' }
            );
            fetchBookings();
        } catch (err) {
            setError('Failed to approve booking');
        }
    };

    const handleRejectBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.patch(
                `${FIREBASE_DB_URL}/bookings/${bookingId}.json?auth=${token}`,
                { status: 'rejected' }
            );
            fetchBookings();
        } catch (err) {
            setError('Failed to reject booking');
        }
    };

    return (
        <div className="admin-container">
            <nav className="admin-nav">
                <h1 className="nav-brand">HotelAdmin</h1>
                <div className="nav-menu">
                    <a href="/" className="nav-link">Home</a>
                    <a href="/bookings" className="nav-link active">Bookings</a>
                    <a href="/manage-listings" className="nav-link">Manage Listings</a>
                    <button onClick={() => {
                        localStorage.removeItem('adminToken');
                        navigate('/auth');
                    }} className="btn-logout">Logout</button>
                </div>
            </nav>

            <main className="admin-main">
                <h2>All Hotel Bookings</h2>

                {error && <p className="error-message">{error}</p>}
                {loading && <p className="loading">Loading bookings...</p>}

                <div className="bookings-grid">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-image">
                                <img src={booking.hotelImage || '/placeholder.jpg'} alt={booking.hotelName} />
                            </div>
                            <div className="booking-info">
                                <h3>{booking.hotelName}</h3>
                                <p><strong>Price:</strong> ₹{booking.price}/night</p>
                                <p><strong>Address:</strong> {booking.hotelAddress}</p>
                                <p><strong>Pincode:</strong> {booking.hotelPincode}</p>
                                <p><strong>City:</strong> {booking.hotelCity}</p>
                                <p><strong>Email:</strong> {booking.userEmail}</p>

                                <p><strong>Total Guests:</strong> {booking.guests}</p>
                                <p><strong>Check-In:</strong> {booking.checkIn}</p>
                                <p><strong>Check-Out:</strong> {booking.checkOut}</p>
                                <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
                                <p>
                                    <strong>Status:</strong>
                                    <span className={`status-badge ${booking.status}`}>
                                        {booking.status?.toUpperCase() || 'PENDING'}
                                    </span>
                                </p>

                                {booking.status !== 'completed' && booking.status !== 'rejected' && (
                                    <div className="booking-actions">
                                        <button onClick={() => handleApproveBooking(booking.id)} className="btn-approve">
                                            Approve
                                        </button>
                                        <button onClick={() => handleRejectBooking(booking.id)} className="btn-reject">
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {bookings.length === 0 && !loading && (
                    <p className="no-bookings">No bookings yet.</p>
                )}
            </main>
        </div>
    );
}
