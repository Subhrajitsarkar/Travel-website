import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h4>LuxeStays</h4>
                    <p>Your perfect travel companion</p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/order-history">My Bookings</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>Email: info@luxestays.com</p>
                    <p>Phone: +1-800-LUXE-STAY</p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} LuxeStays. All rights reserved.</p>
            </div>
        </footer>
    );
}
