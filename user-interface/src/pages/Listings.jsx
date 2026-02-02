import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Listings.css';

export default function Listings() {
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const FIREBASE_DB_URL = import.meta.env.VITE_FIREBASE_DB_URL;

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/auth');
            return;
        }
        fetchListings();
        fetchCategories();
    }, [navigate]);

    useEffect(() => {
        filterListings();
    }, [selectedCategory, priceRange, listings]);

    const fetchListings = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get(
                `${FIREBASE_DB_URL}/hotels.json?auth=${token}`
            );
            const data = response.data ? Object.entries(response.data).map(([key, val]) => ({
                id: key,
                ...val,
            })).filter(h => h.availability !== false) : [];
            setListings(data);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get(
                `${FIREBASE_DB_URL}/categories.json?auth=${token}`
            );
            if (response.data) {
                setCategories(['All', ...Object.values(response.data)]);
            } else {
                setCategories(['All']);
            }
        } catch (err) {
            setCategories(['All']);
        }
    };

    const filterListings = () => {
        let filtered = listings;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(l => l.category === selectedCategory);
        }

        filtered = filtered.filter(l => l.price >= priceRange[0] && l.price <= priceRange[1]);

        setFilteredListings(filtered);
    };

    return (
        <div className="page-container">
            <Header />

            <main className="listings-main">
                <div className="listings-container">
                    <aside className="filters-sidebar">
                        <h3>Filters</h3>

                        <div className="filter-group">
                            <h4>Categories</h4>
                            <div className="category-list">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4>Price Range</h4>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                className="price-slider"
                            />
                            <p className="price-display">
                                ₹0 - ₹{priceRange[1]}
                            </p>
                        </div>
                    </aside>

                    <section className="listings-grid-section">
                        {loading ? (
                            <p className="loading">Loading listings...</p>
                        ) : filteredListings.length > 0 ? (
                            <div className="listings-grid">
                                {filteredListings.map((listing) => (
                                    <div key={listing.id} className="listing-card">
                                        {listing.images && listing.images[0] && (
                                            <img src={listing.images[0]} alt={listing.name} className="listing-image" />
                                        )}
                                        <div className="listing-content">
                                            <h3>{listing.name}</h3>
                                            <p className="listing-category">{listing.category}</p>
                                            <p className="listing-address">{listing.address}, {listing.city}</p>
                                            <p className="listing-description">{listing.description}</p>
                                            <div className="listing-footer">
                                                <span className="listing-price">₹{listing.price}/night</span>
                                                <button
                                                    onClick={() => navigate(`/details/${listing.id}`)}
                                                    className="btn-view-details"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-listings">No listings found. Try adjusting your filters.</p>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
