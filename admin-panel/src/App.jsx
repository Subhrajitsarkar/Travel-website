import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import ManageListings from './pages/ManageListings';
import Bookings from './pages/Bookings';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Home />} />
                <Route path="/manage-listings" element={<ManageListings />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
