import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import '../styles/Details.css';

export default function Details() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const navigate = useNavigate();
    const FIREBASE_DB_URL = import.meta.env.VITE_FIREBASE_DB_URL;

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/auth');
            return;
        }
        fetchListing();
    }, [id, navigate]);

    const fetchListing = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(
                `${FIREBASE_DB_URL}/hotels/${id}.json?auth=${token}`
            );
            const data = await response.json();
            if (data) {
                setListing({ id, ...data });
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const handleNextImage = () => {
        if (listing?.images) {
            setImageIndex((prev) => (prev + 1) % listing.images.length);
        }
    };

    const handlePrevImage = () => {
        if (listing?.images) {
            setImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <Header />
                <p className="loading">Loading...</p>
                <Footer />
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="page-container">
                <Header />
                <p className="not-found">Listing not found</p>
                <Footer />
            </div>
        );
    }

    return (
        <div className="page-container">
            <Header />

            <main className="details-main">
                <div className="details-container">
                    <div className="details-gallery">
                        {listing.images && listing.images.length > 0 ? (
                            <>
                                <img
                                    src={listing.images[imageIndex]}
                                    alt={listing.name}
                                    className="main-image"
                                />
                                {listing.images.length > 1 && (
                                    <>
                                        <button onClick={handlePrevImage} className="nav-btn prev">❮</button>
                                        <button onClick={handleNextImage} className="nav-btn next">❯</button>
                                        <div className="image-indicators">
                                            {listing.images.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    className={`indicator ${idx === imageIndex ? 'active' : ''}`}
                                                    onClick={() => setImageIndex(idx)}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <img src="/placeholder.jpg" alt={listing.name} className="main-image" />
                        )}
                    </div>

                    <div className="details-info">
                        <h1>{listing.name}</h1>
                        <p className="category-badge">{listing.category}</p>

                        <div className="info-section">
                            <h3>Location</h3>
                            <p>{listing.address}</p>
                            <p>{listing.city}, {listing.pincode}</p>
                        </div>

                        <div className="info-section">
                            <h3>About</h3>
                            <p>{listing.description}</p>
                        </div>

                        <div className="info-section">
                            <h3>Price</h3>
                            <p className="price-display">₹{listing.price} per night</p>
                        </div>

                        <div className="booking-section">
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="btn-book-now"
                            >
                                Book Now
                            </button>
                        </div>

                        {showBookingModal && (
                            <BookingModal
                                listing={listing}
                                onClose={() => setShowBookingModal(false)}
                            />
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
