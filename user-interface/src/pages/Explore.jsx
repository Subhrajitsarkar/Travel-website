import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Explore.css';

const Explore = () => {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState(10000);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const FIREBASE_DB_URL = import.meta.env.VITE_FIREBASE_DB_URL;

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/auth');
            return;
        }

        // Fetch hotels
        fetch(`${FIREBASE_DB_URL}/hotels.json?auth=${token}`)
            .then(response => response.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    const hotelArray = Object.entries(data).map(([key, value]) => ({
                        id: key,
                        ...value
                    }));
                    setHotels(hotelArray);
                    setFilteredHotels(hotelArray);

                    // Extract unique categories
                    const uniqueCategories = [...new Set(hotelArray.map(h => h.category))].filter(Boolean);
                    setCategories(uniqueCategories);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching hotels:', error);
                setLoading(false);
            });
    }, [navigate]);

    const filterListings = () => {
        let filtered = hotels;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(hotel => hotel.category === selectedCategory);
        }

        // Filter by price range
        filtered = filtered.filter(hotel => hotel.price <= priceRange);

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(hotel =>
                hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredHotels(filtered);
    };

    useEffect(() => {
        filterListings();
    }, [selectedCategory, priceRange, searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        filterListings();
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="explore-container">
                    <p>Loading...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="explore-container">
                <h1>Explore Hotels</h1>

                <div className="search-bar">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search by hotel name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>
                </div>

                <div className="filters-section">
                    <div className="category-filters">
                        <button
                            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="price-filter">
                        <label>Max Price: ₹{priceRange}</label>
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            value={priceRange}
                            onChange={(e) => setPriceRange(parseInt(e.target.value))}
                        />
                    </div>
                </div>

                <div className="hotels-grid">
                    {filteredHotels.length > 0 ? (
                        filteredHotels.map((hotel) => (
                            <div key={hotel.id} className="hotel-card">
                                <div className="hotel-image">
                                    {hotel.images && hotel.images.length > 0 ? (
                                        <img src={hotel.images[0]} alt={hotel.name} />
                                    ) : (
                                        <div className="placeholder">No Image</div>
                                    )}
                                </div>
                                <div className="hotel-info">
                                    <h3>
                                        <span
                                            className="hotel-name-link"
                                            onClick={() => navigate(`/details/${hotel.id}`)}
                                        >
                                            {hotel.name}
                                        </span>
                                    </h3>
                                    {hotel.category && (
                                        <span className="category-badge">{hotel.category}</span>
                                    )}
                                    <p className="address"><strong>Address:</strong> {hotel.address}</p>
                                    <p className="description">{hotel.description}</p>
                                    <p className="price"><strong>Price:</strong> ₹{hotel.price}/night</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">No hotels found matching your criteria.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Explore;
