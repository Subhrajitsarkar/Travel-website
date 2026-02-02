import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Home.css';

const Home = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const FIREBASE_DB_URL = import.meta.env.VITE_FIREBASE_DB_URL;

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/auth');
            return;
        }

        // Fetch all hotels from Firebase
        fetch(`${FIREBASE_DB_URL}/hotels.json?auth=${token}`)
            .then(response => response.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    const hotelArray = Object.entries(data).map(([key, value]) => ({
                        id: key,
                        ...value
                    }));
                    // Show only first 3 hotels as featured
                    setHotels(hotelArray.slice(0, 3));
                }
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
            });
    }, [navigate]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="home-container">
                    <p>Loading...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="home-container">
                <div className="home-hero">
                    <h1>Welcome to LuxeStays</h1>
                    <p>Handpicked premium stays for your next unforgettable experience.</p>
                    <button className="explore-btn" onClick={() => navigate('/explore')}>
                        Explore Hotels
                    </button>
                </div>

                <div className="featured-section">
                    <h2>Featured Accommodations</h2>
                    <div className="featured-grid">
                        {hotels.map((hotel) => (
                            <div key={hotel.id} className="featured-card">
                                <div className="featured-image">
                                    {hotel.images && hotel.images.length > 0 ? (
                                        <img src={hotel.images[0]} alt={hotel.name} />
                                    ) : (
                                        <div className="placeholder">No Image</div>
                                    )}
                                </div>
                                <div className="featured-content">
                                    <h3>{hotel.name}</h3>
                                    <p className="description">{hotel.description}</p>
                                    <button
                                        className="view-details-btn"
                                        onClick={() => navigate(`/details/${hotel.id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Home;
