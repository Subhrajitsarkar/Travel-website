import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Bookings.css';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const FIREBASE_DB_URL = import.meta.env.VITE_FIREBASE_DB_URL;

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const userEmail = localStorage.getItem('userEmail');

        if (!token) {
            navigate('/auth');
            return;
        }

        // Fetch all bookings and filter by user email
        fetch(`${FIREBASE_DB_URL}/bookings.json?auth=${token}`)
            .then(response => response.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    const bookingArray = Object.entries(data)
                        .map(([key, value]) => ({
                            id: key,
                            ...value
                        }))
                        .filter(booking => booking.userEmail === userEmail);
                    setBookings(bookingArray);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching bookings:', error);
                setLoading(false);
            });
    }, [navigate]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="bookings-container">
                    <p>Loading...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="bookings-container">
                <h1>My Bookings</h1>

                <div className="bookings-grid">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div key={booking.id} className="booking-card">
                                <div className="booking-image">
                                    {booking.hotelImage ? (
                                        <img src={booking.hotelImage} alt={booking.hotelName} />
                                    ) : (
                                        <div className="placeholder">No Image</div>
                                    )}
                                </div>
                                <div className="booking-content">
                                    <h3>{booking.hotelName}</h3>
                                    <p><strong>Price:</strong> ₹{booking.price}/night</p>
                                    <p><strong>Address:</strong> {booking.hotelAddress}</p>
                                    <p><strong>Pincode:</strong> {booking.hotelPincode}</p>
                                    <p><strong>City:</strong> {booking.hotelCity}</p>
                                    <p><strong>Email:</strong> {booking.userEmail}</p>
                                    <p className="divider"></p>
                                    <p><strong>Total Guests:</strong> {booking.guests}</p>
                                    <p><strong>Check-In:</strong> {booking.checkIn}</p>
                                    <p><strong>Check-Out:</strong> {booking.checkOut}</p>
                                    <p className="divider"></p>
                                    <p className={`status-badge ${booking.status}`}>
                                        <strong>Status:</strong> <span>{booking.status}</span>
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-bookings">No bookings yet. Explore hotels and book your next stay!</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Bookings;
