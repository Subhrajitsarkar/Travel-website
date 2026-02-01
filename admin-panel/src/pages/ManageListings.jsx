import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ManageListings.css';

export default function ManageListings() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        address: '',
        pincode: '',
        city: '',
        category: 'Villa',
        images: [],
        description: '',
        availability: true,
    });

    const [hotels, setHotels] = useState([]);
    const [categories, setCategories] = useState(['Villa', 'Apartment', 'Houseboat']);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/auth');
            return;
        }
        fetchHotels();
        fetchCategories();
    }, [navigate]);

    const fetchHotels = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(
                'https://your-firebase-db.firebaseio.com/hotels.json?auth=' + token
            );
            setHotels(response.data ? Object.entries(response.data).map(([key, val]) => ({ id: key, ...val })) : []);
        } catch (err) {
            console.error('Failed to fetch hotels');
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(
                'https://your-firebase-db.firebaseio.com/categories.json?auth=' + token
            );
            if (response.data) {
                setCategories(Object.values(response.data));
            }
        } catch (err) {
            console.error('Failed to fetch categories');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        const imageUrls = [];
        let loadedCount = 0;

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                imageUrls.push(event.target.result);
                loadedCount++;
                if (loadedCount === files.length) {
                    setFormData((prev) => ({
                        ...prev,
                        images: imageUrls,
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const payload = {
                ...formData,
                createdAt: new Date().toISOString(),
            };

            if (editingId) {
                await axios.patch(
                    `https://your-firebase-db.firebaseio.com/hotels/${editingId}.json?auth=${token}`,
                    payload
                );
                alert('Hotel updated successfully!');
            } else {
                await axios.post(
                    `https://your-firebase-db.firebaseio.com/hotels.json?auth=${token}`,
                    payload
                );
                alert('Hotel added successfully!');
            }

            resetForm();
            fetchHotels();
        } catch (err) {
            alert('Failed to save hotel: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(
                `https://your-firebase-db.firebaseio.com/categories.json?auth=${token}`,
                { name: newCategory }
            );
            setCategories([...categories, newCategory]);
            setNewCategory('');
            alert('Category added successfully!');
        } catch (err) {
            alert('Failed to add category');
        }
    };

    const handleEditHotel = (hotel) => {
        setFormData(hotel);
        setEditingId(hotel.id);
        window.scrollTo(0, 0);
    };

    const handleDeleteHotel = async (hotelId) => {
        if (window.confirm('Are you sure?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(
                    `https://your-firebase-db.firebaseio.com/hotels/${hotelId}.json?auth=${token}`
                );
                fetchHotels();
            } catch (err) {
                alert('Failed to delete hotel');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            address: '',
            pincode: '',
            city: '',
            category: 'Villa',
            images: [],
            description: '',
            availability: true,
        });
        setEditingId(null);
    };

    return (
        <div className="admin-container">
            <nav className="admin-nav">
                <h1 className="nav-brand">HotelAdmin</h1>
                <div className="nav-menu">
                    <a href="/" className="nav-link">Home</a>
                    <a href="/bookings" className="nav-link">Bookings</a>
                    <a href="/manage-listings" className="nav-link active">Manage Listings</a>
                    <button onClick={() => {
                        localStorage.removeItem('adminToken');
                        navigate('/auth');
                    }} className="btn-logout">Logout</button>
                </div>
            </nav>

            <main className="admin-main">
                <div className="manage-listings-container">
                    {/* Add Hotel Form */}
                    <section className="form-section">
                        <h2>Add Hotel Listing</h2>
                        <form onSubmit={handleSubmit} className="add-hotel-form">
                            <div className="form-group">
                                <label>Hotel Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter hotel name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Price per Night</label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="e.g. 2500"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>PIN Code</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    placeholder="e.g. 110001"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="e.g. New Delhi"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="e.g. 129-q new Delhi"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Enter hotel description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                />
                            </div>

                            <div className="form-group">
                                <label>Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="availability"
                                        checked={formData.availability}
                                        onChange={handleInputChange}
                                    />
                                    Available
                                </label>
                            </div>

                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? 'Saving...' : editingId ? 'Update Hotel' : 'Add Hotel'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={resetForm} className="btn-cancel">
                                    Cancel Edit
                                </button>
                            )}
                        </form>
                    </section>

                    {/* Add Category Form */}
                    <section className="form-section">
                        <h3>Add New Category</h3>
                        <form onSubmit={handleAddCategory} className="add-category-form">
                            <div className="form-group">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Enter new category"
                                />
                            </div>
                            <button type="submit" className="btn-submit">Add Category</button>
                        </form>
                    </section>

                    {/* Hotels List */}
                    <section className="listings-section">
                        <h2>All Hotels</h2>
                        <div className="hotels-grid">
                            {hotels.map((hotel) => (
                                <div key={hotel.id} className="hotel-card">
                                    {hotel.images && hotel.images[0] && (
                                        <img src={hotel.images[0]} alt={hotel.name} className="hotel-image" />
                                    )}
                                    <div className="hotel-info">
                                        <h3>{hotel.name}</h3>
                                        <p><strong>Price:</strong> ₹{hotel.price}/night</p>
                                        <p><strong>Address:</strong> {hotel.address}</p>
                                        <p><strong>Pincode:</strong> {hotel.pincode}</p>
                                        <p><strong>City:</strong> {hotel.city}</p>
                                        <p><strong>Category:</strong> {hotel.category}</p>
                                        <p><strong>Available:</strong> {hotel.availability ? 'Yes' : 'No'}</p>
                                        <div className="hotel-actions">
                                            <button onClick={() => handleEditHotel(hotel)} className="btn-edit">Edit</button>
                                            <button onClick={() => handleDeleteHotel(hotel.id)} className="btn-delete">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
