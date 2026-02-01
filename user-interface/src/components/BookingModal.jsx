import React, { useState } from 'react';
import axios from 'axios';
import { differenceInDays } from 'date-fns';
import '../styles/BookingModal.css';

export default function BookingModal({ listing, onClose }) {
    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const calculateTotalPrice = () => {
        if (!formData.checkIn || !formData.checkOut) return 0;
        const days = differenceInDays(new Date(formData.checkOut), new Date(formData.checkIn));
        return days > 0 ? days * listing.price : 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.checkIn || !formData.checkOut || !formData.address) {
                setError('Please fill all fields');
                setLoading(false);
                return;
            }

            if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
                setError('Check-out date must be after check-in date');
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('userToken');
            const userEmail = localStorage.getItem('userEmail');
            const totalPrice = calculateTotalPrice();

            const bookingData = {
                hotelId: listing.id,
                hotelName: listing.name,
                hotelAddress: listing.address,
                hotelCity: listing.city,
                hotelPincode: listing.pincode,
                hotelImage: listing.images?.[0] || null,
                price: listing.price,
                checkIn: formData.checkIn,
                checkOut: formData.checkOut,
                guests: parseInt(formData.guests),
                userAddress: formData.address,
                userEmail,
                totalPrice,
                status: 'pending',
                createdAt: new Date().toISOString(),
            };

            await axios.post(
                `https://travel-website-a0b2d-default-rtdb.firebaseio.com/bookings.json?auth=${token}`,
                bookingData
            );

            alert('Booking created successfully! Admin will review your booking.');
            onClose();
        } catch (err) {
            setError('Failed to create booking: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = calculateTotalPrice();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                <h2>Book {listing.name}</h2>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Check-in Date</label>
                        <input
                            type="date"
                            name="checkIn"
                            value={formData.checkIn}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Check-out Date</label>
                        <input
                            type="date"
                            name="checkOut"
                            value={formData.checkOut}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Number of Guests</label>
                        <input
                            type="number"
                            name="guests"
                            min="1"
                            max="10"
                            value={formData.guests}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Your Address</label>
                        <textarea
                            name="address"
                            placeholder="Enter your address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="3"
                            required
                        />
                    </div>

                    {totalPrice > 0 && (
                        <div className="price-summary">
                            <h4>Price Summary</h4>
                            <p>
                                <span>Price per night:</span>
                                <span>₹{listing.price}</span>
                            </p>
                            <p>
                                <span>Number of nights:</span>
                                <span>{differenceInDays(new Date(formData.checkOut), new Date(formData.checkIn))}</span>
                            </p>
                            <p className="total">
                                <span>Total Price:</span>
                                <span>₹{totalPrice}</span>
                            </p>
                        </div>
                    )}

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Processing...' : 'Proceed to Book'}
                    </button>
                </form>
            </div>
        </div>
    );
}
