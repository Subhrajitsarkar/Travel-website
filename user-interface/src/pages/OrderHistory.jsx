import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/OrderHistory.css';

export default function OrderHistory() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const userEmail = localStorage.getItem('userEmail');
        if (!token) {
            navigate('/auth');
            return;
        }
        fetchBookings(userEmail, token);
    }, [navigate]);

    const fetchBookings = async (userEmail, token) => {
        try {
            const response = await axios.get(
                'https://your-firebase-db.firebaseio.com/bookings.json?auth=' + token
            );
            if (response.data) {
                const userBookings = Object.entries(response.data)
                    .map(([key, val]) => ({ id: key, ...val }))
                    .filter(b => b.userEmail === userEmail);
                setBookings(userBookings);
            }
        } catch (err) {
            setError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Header />

            <main className="order-history-main">
                <div className="order-history-container">
                    <h1>Order History</h1>

                    {error && <p className="error-message">{error}</p>}
                    {loading && <p className="loading">Loading your bookings...</p>}

                    {bookings.length > 0 ? (
                        <div className="bookings-list">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="booking-item">
                                    {booking.hotelImage && (
                                        <img src={booking.hotelImage} alt={booking.hotelName} className="booking-image" />
                                    )}
                                    <div className="booking-details">
                                        <h3>{booking.hotelName}</h3>
                                        <p className="booking-address">{booking.hotelAddress}, {booking.hotelCity}</p>
                                        <p className="booking-dates">
                                            <strong>Check-in:</strong> {booking.checkIn} | <strong>Check-out:</strong> {booking.checkOut}
                                        </p>
                                        <p className="booking-guests">
                                            <strong>Guests:</strong> {booking.guests}
                                        </p>
                                        <p className="booking-price">
                                            <strong>Total Price:</strong> ₹{booking.totalPrice}
                                        </p>
                                        <p className={`booking-status ${booking.status}`}>
                                            <strong>Status:</strong> <span>{booking.status?.toUpperCase() || 'PENDING'}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && <p className="no-bookings">No bookings yet. Start exploring and book your next stay!</p>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
