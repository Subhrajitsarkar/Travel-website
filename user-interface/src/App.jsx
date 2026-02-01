import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Listings from './pages/Listings';
import Details from './pages/Details';
import OrderHistory from './pages/OrderHistory';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Listings />} />
                <Route path="/details/:id" element={<Details />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
